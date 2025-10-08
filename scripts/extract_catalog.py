import sys
import re
from pathlib import Path

import fitz  # PyMuPDF (already installed)
import pdfplumber
import pandas as pd
from PIL import Image
import pytesseract
import shutil
import os
import cv2
import numpy as np


PRODUCT_KEYWORDS = {
    "heat pump water heater": "heat-pump-water-heater",
    "heat pump": "heat-pump",
    "water tank": "water-tank",
    "expansion tank": "expansion-tank",
    "expantion tank": "expansion-tank",
    "water pump": "water-pump",
}

COMPANY_KEYWORDS = ["about", "company", "who we are", "profile"]


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def save_text(target_dir: Path, filename: str, content: str):
    ensure_dir(target_dir)
    (target_dir / filename).write_text((content or "").strip() + "\n", encoding="utf-8")


def normalize_text(t: str) -> str:
    return re.sub(r"\s+", " ", t or "").strip()


def guess_section_slug(text: str) -> str | None:
    t = (text or "").lower()
    for k, slug in PRODUCT_KEYWORDS.items():
        if k in t:
            return slug
    for k in COMPANY_KEYWORDS:
        if k in t:
            return "company-overview"
    return None


def extract_table_markdown(table: list[list[str]]) -> str:
    if not table:
        return ""
    # Heuristic: first row is header if all cells are strings
    header = table[0]
    rows = table[1:]
    # Build GitHub-flavored markdown table
    md = ["| " + " | ".join(h.strip() if isinstance(h, str) else "" for h in header) + " |"]
    md.append("| " + " | ".join(["---"] * len(header)) + " |")
    for r in rows:
        md.append("| " + " | ".join((c or "").strip() for c in r) + " |")
    return "\n".join(md)


def crop_heat_pump_images(pdf_path: Path, out_img: Path, hp_page_index: int):
    # Render the heat pump page to a raster image (PIL), then crop three regions
    with pdfplumber.open(str(pdf_path)) as pdf:
        page = pdf.pages[hp_page_index]
        # Render to image
        pil = page.to_image(resolution=200).original  # Pillow Image
        w, h = pil.size
        # Heuristic crop bands (upper third where images appear)
        top = int(h * 0.18)
        bottom = int(h * 0.62)
        third = w // 3
        boxes = [
            (0, top, third, bottom),
            (third, top, 2 * third, bottom),
            (2 * third, top, w, bottom),
        ]
        names = ["heat-pump-1.jpg", "heat-pump-2.jpg", "heat-pump-3.jpg"]
        for box, name in zip(boxes, names):
            crop = pil.crop(box)
            crop.save(out_img / name, format="JPEG", quality=92)


def ocr_region_to_text(pil_img: Image.Image, rel_box: tuple[float, float, float, float]) -> str:
    """OCR a relative box (left, top, right, bottom) in 0..1 relative coords on a PIL image."""
    w, h = pil_img.size
    l = int(rel_box[0] * w)
    t = int(rel_box[1] * h)
    r = int(rel_box[2] * w)
    b = int(rel_box[3] * h)
    crop = pil_img.crop((l, t, r, b))
    # Preprocess with OpenCV: grayscale, upscale, adaptive threshold, slight dilation
    cv = cv2.cvtColor(np.array(crop), cv2.COLOR_RGB2GRAY)
    cv = cv2.resize(cv, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    cv = cv2.bilateralFilter(cv, 7, 50, 50)
    cv = cv2.adaptiveThreshold(cv, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 35, 11)
    kernel = np.ones((1, 1), np.uint8)
    cv = cv2.morphologyEx(cv, cv2.MORPH_CLOSE, kernel)
    txt = pytesseract.image_to_string(cv, config="--psm 6")
    return txt


def extract(pdf_path: Path, project_root: Path):
    # Configure Tesseract path on Windows if not found in PATH
    if not shutil.which("tesseract"):
        candidates = [
            r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
            r"C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe",
        ]
        for cand in candidates:
            if os.path.exists(cand):
                pytesseract.pytesseract.tesseract_cmd = cand
                break
    out_img = project_root / "img" / "products"
    out_docs_products = project_root / "docs" / "products"
    out_docs_company = project_root / "docs" / "company"

    ensure_dir(out_img)
    ensure_dir(out_docs_products)
    ensure_dir(out_docs_company)

    # 1) Fallback: keep previous raw image extraction via PyMuPDF
    doc = fitz.open(pdf_path)
    for page_index, page in enumerate(doc):
        images = page.get_images(full=True)
        for i, img in enumerate(images, start=1):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n >= 5:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            (out_img / f"page-{page_index+1}-{page_index+1}-{i}.jpg").write_bytes(pix.tobytes("jpg"))

    # 2) Use pdfplumber to extract text per page and detect sections
    sections: dict[str, list[str]] = {}
    hp_page_index = None
    with pdfplumber.open(str(pdf_path)) as pdf:
        for idx, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            slug = guess_section_slug(text) or f"page-{idx+1}"
            sections.setdefault(slug, []).append(text)
            if hp_page_index is None and "heat pump" in (text or "").lower():
                hp_page_index = idx

        # Fallback to page 3 (index 2) if detection failed
        if hp_page_index is None and len(pdf.pages) >= 3:
            hp_page_index = 2

        # Extract first sizable table from the heat pump page
        heat_pump_table_md = ""
        if hp_page_index is not None:
            page = pdf.pages[hp_page_index]
            # Try default detection
            tables = page.extract_tables()
            # If empty, try line-based table detection
            if not tables:
                try:
                    tables = page.extract_tables(table_settings={
                        "vertical_strategy": "lines",
                        "horizontal_strategy": "lines",
                        "intersection_tolerance": 5,
                    })
                except Exception:
                    tables = []
            if tables:
                table = max(tables, key=lambda t: sum(len(r) for r in t))
                heat_pump_table_md = extract_table_markdown(table)
                save_text(out_docs_products, "heat-pump-table.md", heat_pump_table_md)

        # OCR-based extraction (table + specs) using relative regions
        if hp_page_index is not None:
            pil_full = pdf.pages[hp_page_index].to_image(resolution=220).original
            # Table region: lower ~38% of page
            table_box = (0.03, 0.60, 0.97, 0.96)
            table_txt = ocr_region_to_text(pil_full, table_box)
            # Save a cropped image of the table as well
            w, h = pil_full.size
            l = int(table_box[0] * w); t = int(table_box[1] * h); r = int(table_box[2] * w); b = int(table_box[3] * h)
            pil_full.crop((l, t, r, b)).save(out_img / "heat-pump-table.jpg", format="JPEG", quality=95)
            if table_txt.strip():
                save_text(out_docs_products, "heat-pump-table-ocr.txt", table_txt)
                # Attempt naive markdown parsing: split lines by 2+ spaces
                lines = [ln.strip() for ln in table_txt.splitlines() if ln.strip()]
                rows = []
                for ln in lines:
                    parts = [p for p in re.split(r"\s{2,}", ln) if p]
                    rows.append(parts)
                if rows and len(rows[0]) > 1:
                    md = extract_table_markdown(rows)
                    if md:
                        save_text(out_docs_products, "heat-pump-table.md", md)

            # Specs region: just above the table area roughly
            specs_txt = ocr_region_to_text(pil_full, (0.03, 0.48, 0.60, 0.62))
            if specs_txt.strip():
                save_text(out_docs_products, "heat-pump-specs.md", specs_txt)

    # 3) Save text sections
    for slug, chunks in sections.items():
        content = "\n\n".join(chunks)
        if slug == "company-overview":
            save_text(out_docs_company, "overview.md", content)
        else:
            save_text(out_docs_products, f"{slug}.md", content)
    # Combined
    combined = []
    for slug, chunks in sections.items():
        combined.append(f"## {slug}\n\n" + "\n\n".join(chunks))
    save_text(project_root / "docs" / "products", "catalog_text.md", "\n\n".join(combined))

    # 4) Create three cropped heat pump images for hero row
    if hp_page_index is not None:
        crop_heat_pump_images(pdf_path, out_img, hp_page_index)

    print("Extraction completed (enhanced).")
    print(f"Images -> {out_img}")
    print(f"Products text -> {out_docs_products}")
    print(f"Company text -> {out_docs_company}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/extract_catalog.py downloads/catalog.pdf")
        sys.exit(1)
    pdf = Path(sys.argv[1]).resolve()
    if not pdf.exists():
        print(f"PDF not found: {pdf}")
        sys.exit(1)

    # Assume script is within project/scripts/
    project_root = Path(__file__).resolve().parents[1]
    extract(pdf, project_root)
