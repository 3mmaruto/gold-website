import assert from "node:assert/strict";
import { after, test } from "node:test";
import { JSDOM } from "jsdom";
import { createServer } from "vite";
import sharp from "sharp";
import { getWaterCylinder } from "../app/data/waterCylinders.js";
import { revealOnce } from "../app/lib/revealOnce.js";

const dom = new JSDOM("<div id='root'></div>");
for (const name of ["window", "document", "navigator"]) Object.defineProperty(globalThis, name, { configurable: true, value: name === "window" ? dom.window : dom.window[name] });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { renderToString } = await import("react-dom/server");
const { createRoot } = await import("react-dom/client");
const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", oxc: { jsx: { runtime: "automatic" } } });
const { default: CylinderAnatomy } = await vite.ssrLoadModule("/app/components/CylinderAnatomy.jsx");
after(async () => { await vite.close(); dom.window.close(); });

test("both languages render every technical note as real HTML without JavaScript", () => {
  for (const locale of ["ar", "en"]) for (const variant of ["insulation", "section", "service"]) {
    const product = getWaterCylinder(locale);
    const container = document.createElement("div");
    container.innerHTML = renderToString(React.createElement(CylinderAnatomy, { source: product.assets[variant === "section" ? "cutaway" : variant], content: product.anatomy[variant], variant, locale }));
    assert.equal(container.querySelectorAll(".cylinder-callout").length, 2);
    assert.equal(container.querySelector("img").alt, product.anatomy[variant].alt);
    assert.equal(container.querySelector(".cylinder-callout").dir, locale === "ar" ? "rtl" : "ltr");
    for (const note of product.anatomy[variant].notes) {
      assert.ok(container.textContent.includes(note.value));
      assert.ok(container.textContent.includes(note.detail));
    }
    for (const svg of container.querySelectorAll("svg")) assert.equal(svg.getAttribute("aria-hidden"), "true");
    assert.equal(container.querySelectorAll("[hidden], [aria-hidden='true'] .cylinder-callout").length, 0);
  }
});

test("mounted illustration observes the stage, reveals on intersection, and cleans up", async () => {
  let callback, observed, disconnected = 0;
  dom.window.IntersectionObserver = class {
    constructor(cb, options) { callback = cb; assert.equal(options.threshold, 0.2); }
    observe(element) { observed = element; }
    disconnect() { disconnected++; }
  };
  const product = getWaterCylinder("ar");
  const root = createRoot(document.getElementById("root"));
  await React.act(async () => root.render(React.createElement(CylinderAnatomy, { source: product.assets.insulation, content: product.anatomy.insulation, variant: "insulation", locale: "ar" })));
  assert.ok(observed.classList.contains("cylinder-anatomy-stage"));
  callback([{ isIntersecting: false }]);
  assert.equal(observed.classList.contains("is-revealed"), false);
  callback([{ isIntersecting: true }]);
  assert.ok(observed.classList.contains("is-revealed"));
  assert.equal(disconnected, 1);
  await React.act(async () => root.unmount());
  assert.equal(disconnected, 2);
});

test("reduced motion and unsupported observers leave readable content untouched", () => {
  const element = document.createElement("div");
  element.textContent = "4 cm / 6 cm";
  revealOnce(element, {})();
  revealOnce(element, { IntersectionObserver: class { constructor() { throw new Error("Should not animate"); } }, matchMedia: () => ({ matches: true }) })();
  assert.equal(element.className, "");
  assert.equal(element.textContent, "4 cm / 6 cm");
});

test("all four studio originals match declared dimensions", async () => {
  for (const source of Object.values(getWaterCylinder().assets)) {
    const image = await sharp(`public${source.fallback}`).metadata();
    assert.equal(image.width, source.width);
    assert.equal(image.height, source.height);
  }
});

test("callout conversions preserve the source millimetres and model-specific scope", () => {
  for (const locale of ["ar", "en"]) {
    const product = getWaterCylinder(locale);
    assert.deepEqual(product.technical.extraRows[2].values, ["40 mm", "60 mm"]);
    assert.match(product.technical.extraRows[2].note, /50/);
    assert.match(product.anatomy.insulation.notes[0].value, /4.*6/);
    assert.match(product.anatomy.insulation.notes[0].detail, /120.*200.*5/);
    assert.match(product.anatomy.insulation.notes[1].value, /0\.15–0\.5/);
    assert.match(product.anatomy.section.notes[0].value, /1500/);
    assert.match(product.anatomy.section.notes[1].value, /5/);
    assert.deepEqual(product.capacities, [120, 200, 300, 500, 800, 1000]);
  }
});
