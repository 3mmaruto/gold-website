import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  {
    source: "public/media/brand/gold-logo-new-4.png",
    widths: [160, 320, 640],
    quality: { webp: 88, avif: 68 },
  },
  {
    source: "public/media/hero/gold-heat-pump-hero-v1.png",
    widths: [768, 1280, 1920],
    quality: { webp: 84, avif: 61 },
  },
  {
    source: "public/media/products/gold-products-family-v1.png",
    widths: [768, 1280, 1920],
    quality: { webp: 84, avif: 61 },
  },
];

const generatedDirectories = [
  "public/media/products/generated",
  "public/media/technology",
];

for (const directory of generatedDirectories) {
  const absoluteDirectory = path.join(root, directory);
  const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".png") continue;
    jobs.push({
      source: path.posix.join(directory.replaceAll("\\", "/"), entry.name),
      widths: [480, 768, 1200],
      quality: { webp: 84, avif: 61 },
    });
  }
}

for (const job of jobs) {
  const source = path.join(root, job.source);
  const parsed = path.parse(source);

  for (const width of job.widths) {
    for (const format of ["webp", "avif"]) {
      const destination = path.join(
        parsed.dir,
        `${parsed.name}-${width}.${format}`,
      );

      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: job.quality[format] })
        .toFile(destination);
    }
  }
}

console.log("Responsive WebP and AVIF assets are ready.");
