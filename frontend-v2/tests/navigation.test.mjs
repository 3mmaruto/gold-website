import assert from "node:assert/strict";
import { after, test } from "node:test";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { createServer } from "vite";

const dom = new JSDOM("<div id='root'></div><button id='outside'>Outside</button>", { url: "https://gold-group-hvac.com/ar/" });
for (const name of ["window", "document", "navigator"]) Object.defineProperty(globalThis, name, { configurable: true, value: name === "window" ? dom.window : dom.window[name] });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (callback) => { callback(); return 1; };
const viewport = new dom.window.EventTarget();
Object.assign(viewport, { height: 620, offsetTop: 0 });
Object.defineProperty(window, "visualViewport", { configurable: true, value: viewport });
const desktopMedia = new dom.window.EventTarget();
desktopMedia.matches = false;
window.matchMedia = () => desktopMedia;
let resizeCallback;
globalThis.ResizeObserver = class {
  constructor(callback) { resizeCallback = callback; }
  observe() {}
  disconnect() {}
};

const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToString } = await import("react-dom/server");
const { MemoryRouter } = await import("react-router");
const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", oxc: { jsx: { runtime: "automatic" } } });
const { default: SiteHeader } = await vite.ssrLoadModule("/app/components/SiteHeader.jsx");
const { default: SiteFooter } = await vite.ssrLoadModule("/app/components/SiteFooter.jsx");
const { getContent, getUi } = await vite.ssrLoadModule("/app/lib/content.js");
after(async () => { await vite.close(); dom.window.close(); });

function tree(locale, component = SiteHeader) {
  return React.createElement(MemoryRouter, { initialEntries: [`/${locale}/`] }, React.createElement(component, { locale, content: getContent(locale), ui: getUi(locale) }));
}
async function mounted(locale, check) {
  const root = createRoot(document.getElementById("root"));
  await React.act(async () => root.render(tree(locale)));
  try { await check(); } finally { await React.act(async () => root.unmount()); }
}
async function click(element) { await React.act(async () => element.click()); }
async function key(element, name) {
  await React.act(async () => element.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: name, bubbles: true })));
}

for (const locale of ["ar", "en"]) {
  test(`${locale}: real same-tab Lab links are pre-rendered in desktop, mobile and footer`, () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree(locale)) + renderToString(tree(locale, SiteFooter));
    const links = [...container.querySelectorAll(`a[href="https://lab.gold-group-hvac.com/lab?lang=${locale}"]`)];
    assert.equal(links.length, 3);
    assert.equal(container.querySelector(".desktop-nav > .nav-lab-link").textContent, locale === "ar" ? "مختبر غولد" : "Gold Lab");
    for (const link of links) {
      assert.equal(link.getAttribute("target"), null);
      assert.equal(link.getAttribute("data-discover"), null);
    }
    assert.equal(container.querySelectorAll(`a[href^="/${locale}/lab"], a[href*="undefined"]`).length, 0);
  });

  test(`${locale}: products keep keyboard traversal, last link, Escape and outside close`, async () => {
    await mounted(locale, async () => {
      const trigger = document.querySelector('[aria-controls="desktop-products-menu"]');
      const panel = document.getElementById("desktop-products-menu");
      await key(trigger, "ArrowUp");
      assert.equal(trigger.getAttribute("aria-expanded"), "true");
      const links = [...panel.querySelectorAll("a")];
      assert.equal(links.length, 6);
      assert.equal(document.activeElement, links.at(-1));
      await key(links.at(-1), "Escape");
      await key(trigger, "ArrowDown");
      assert.equal(document.activeElement, links[0]);
      await key(links[0], "End");
      assert.equal(document.activeElement, links.at(-1));
      assert.equal(document.activeElement.pathname, `/${locale}/products/hot-water-cylinders/`);
      await key(links.at(-1), "Home");
      assert.equal(document.activeElement, links[0]);
      await key(links[0], "ArrowUp");
      assert.equal(document.activeElement, links.at(-1));
      await key(links.at(-1), "Escape");
      assert.equal(trigger.getAttribute("aria-expanded"), "false");
      assert.equal(document.activeElement, trigger);
      await click(trigger);
      await React.act(async () => document.getElementById("outside").dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })));
      assert.equal(trigger.getAttribute("aria-expanded"), "false");
    });
  });

  test(`${locale}: mobile products and Lab link expand, Escape closes group then navigation`, async () => {
    await mounted(locale, async () => {
      const trigger = document.querySelector(".menu-toggle");
      await click(trigger);
      assert.equal(document.body.style.overflow, "hidden");
      assert.equal(document.querySelector(".mobile-nav .nav-lab-link").tabIndex, 0);
      const products = document.querySelector('[aria-controls="mobile-products-links"]');
      await click(products);
      const last = document.querySelector("#mobile-products-links a:last-child");
      assert.equal(last.tabIndex, 0);
      await key(last, "Escape");
      assert.equal(products.getAttribute("aria-expanded"), "false");
      assert.equal(trigger.getAttribute("aria-expanded"), "true");
      assert.equal(document.activeElement, products);
      await key(products, "Escape");
      assert.equal(trigger.getAttribute("aria-expanded"), "false");
      assert.equal(document.activeElement, trigger);
      assert.equal(document.body.style.overflow, "");
      assert.equal(document.querySelector(".mobile-nav .nav-lab-link").tabIndex, -1);
      await click(trigger);
      await React.act(async () => document.getElementById("outside").dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })));
      assert.equal(trigger.getAttribute("aria-expanded"), "false");
      assert.equal(document.body.style.overflow, "");
    });
  });
}

test("menu height tracks actual header row and resized visual viewport, not a fixed cap", async () => {
  await mounted("en", async () => {
    const row = document.querySelector(".header-inner");
    const header = document.querySelector("header");
    row.getBoundingClientRect = () => ({ bottom: 88 });
    resizeCallback();
    assert.equal(header.style.getPropertyValue("--navigation-available-height"), "520px");
    viewport.height = 400;
    viewport.dispatchEvent(new dom.window.Event("resize"));
    assert.equal(header.style.getPropertyValue("--navigation-available-height"), "300px");
    row.getBoundingClientRect = () => ({ bottom: 110 });
    resizeCallback();
    assert.equal(header.style.getPropertyValue("--navigation-available-height"), "278px");
    viewport.height = 90;
    viewport.dispatchEvent(new dom.window.Event("resize"));
    assert.equal(header.style.getPropertyValue("--navigation-available-height"), "0px");
    viewport.height = 620;
  });
});

test("crossing the desktop breakpoint closes menus, releases scroll and retains visible focus", async () => {
  await mounted("en", async () => {
    const toggle = document.querySelector(".menu-toggle");
    await click(toggle);
    const products = document.querySelector('[aria-controls="mobile-products-links"]');
    await click(products);
    document.querySelector("#mobile-products-links a:last-child").focus();
    await React.act(async () => {
      desktopMedia.matches = true;
      desktopMedia.dispatchEvent(new dom.window.Event("change"));
    });
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    assert.equal(products.getAttribute("aria-expanded"), "false");
    assert.equal(document.body.style.overflow, "");
    assert.equal(document.activeElement, document.querySelector(".desktop-nav a"));
    const desktopProducts = document.querySelector('[aria-controls="desktop-products-menu"]');
    await click(desktopProducts);
    document.querySelector("#desktop-products-menu a:last-child").focus();
    await React.act(async () => {
      desktopMedia.matches = false;
      desktopMedia.dispatchEvent(new dom.window.Event("change"));
    });
    assert.equal(desktopProducts.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, toggle);
  });
});

test("desktop scrolls within available height; mobile expanded group is never fixed-height clipped", () => {
  const css = readFileSync("app/styles/global.css", "utf8");
  const desktop = css.match(/\.solutions-popover \{([^}]+)\}/)[1];
  assert.match(desktop, /max-height: var\(--navigation-available-height/);
  assert.match(desktop, /overflow-y: auto/);
  assert.match(desktop, /overscroll-behavior-y: contain/);
  assert.match(desktop, /grid-auto-rows: max-content/);
  assert.match(css.match(/\.mobile-nav\.is-open \{([^}]+)\}/)[1], /max-height: var\(--navigation-available-height/);
  assert.match(css.match(/\.mobile-solutions-links\.is-open \{([^}]+)\}/)[1], /max-height: none/);
});
