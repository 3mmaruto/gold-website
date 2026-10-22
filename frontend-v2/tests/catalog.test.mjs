import assert from "node:assert/strict";
import { after, test } from "node:test";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { createServer } from "vite";
import config from "../react-router.config.js";

const dom = new JSDOM("<div></div>");
const React = await import("react");
const { renderToString } = await import("react-dom/server");
const { MemoryRouter } = await import("react-router");
const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", oxc: { jsx: { runtime: "automatic" } } });
const { default: Card } = await vite.ssrLoadModule("/app/components/CatalogProductCard.jsx");
const { default: Profile } = await vite.ssrLoadModule("/app/components/CatalogProductProfile.jsx");
const { getCatalog, getCatalogProduct, queryCatalog } = await vite.ssrLoadModule("/app/lib/catalog.js");
const { getUi } = await vite.ssrLoadModule("/app/lib/content.js");
const { buildProductMeta, buildProductLinks } = await vite.ssrLoadModule("/app/lib/seo.js");
const source = JSON.parse(readFileSync(new URL("../app/data/products.json", import.meta.url), "utf8"));
after(async () => { await vite.close(); dom.window.close(); });

function render(component, props, location = "/ar/products/") {
  const element = dom.window.document.createElement("div");
  element.innerHTML = renderToString(React.createElement(MemoryRouter, { initialEntries: [location] }, React.createElement(component, props)));
  return element;
}

for (const locale of ["ar", "en"]) {
  test(`${locale}: every card has one details action and permanently readable existing information`, () => {
    const catalog = getCatalog(locale);
    catalog.products.forEach((product, index) => {
      const card = render(Card, { product, index, locale, ui: getUi(locale) });
      const links = card.querySelectorAll("a");
      assert.equal(links.length, 1);
      assert.equal(links[0].getAttribute("href"), `/${locale}/${product.detailsPath}`);
      assert.ok(links[0].getAttribute("aria-label").includes(product.name));
      assert.equal(card.querySelectorAll("button, [hidden], [aria-expanded]").length, 0);
      assert.equal(card.querySelector("h3").textContent, product.name);
      assert.equal(card.querySelector("img").alt, product.images[0].alt);
      assert.deepEqual([...card.querySelectorAll(".catalog-product-highlights li")].map((item) => item.textContent), source.products[index].highlights[locale]);
      assert.deepEqual([...card.querySelectorAll("dd")].map((item) => item.textContent), product.specs.map((spec) => spec.value));
    });
  });

  test(`${locale}: every image-led profile resolves, preserves source images and retains existing model pages`, () => {
    for (const item of source.products.filter((product) => !product.detailsPath)) {
      const product = getCatalogProduct(locale, item.slug);
      const page = render(Profile, { locale, product }, { pathname: `/${locale}/${product.detailsPath}`, state: { catalogSearch: "?q=R290&category=heat-pumps" } });
      assert.equal(page.querySelector("h1").textContent, product.name);
      assert.deepEqual([...page.querySelectorAll("img")].map((image) => image.getAttribute("src")), item.images.map((image) => image.fallback));
      assert.equal(page.querySelector(".catalog-profile-header a").getAttribute("href"), `/${locale}/products/?q=R290&category=heat-pumps`);
      assert.deepEqual([...page.querySelectorAll(".catalog-model-links a")].map((link) => link.getAttribute("href")), product.modelLinks.map((model) => `/${locale}/${model.path}`));
      for (const model of product.modelLinks) assert.ok(config.prerender.includes(`/${locale}/${model.path}`));
      assert.equal(page.querySelectorAll("table").length, 0, "placeholder does not fabricate a technical table");
      assert.equal(page.querySelectorAll("script[type='application/ld+json']").length, 1);
      const metadata = buildProductMeta(locale, product.slug);
      assert.equal(metadata.find((meta) => meta.name === "description").content, product.summary);
      const links = buildProductLinks(locale, product.slug);
      assert.equal(links.find((link) => link.rel === "canonical").href, `https://gold-group-hvac.com/${locale}/${product.detailsPath}`);
      for (const language of ["ar", "en"]) assert.ok(links.some((link) => link.hrefLang === language && link.href.endsWith(`/${language}/${product.detailsPath}`)));
    }
  });

  test(`${locale}: search, category filtering, empty state and invalid pagination stay deterministic`, () => {
    const all = queryCatalog({ locale });
    assert.equal(all.totalResults, source.products.length);
    assert.equal(all.visibleProducts.length, source.products.length);
    assert.equal(all.showPagination, false);
    assert.equal(queryCatalog({ locale, query: "r290" }).visibleProducts[0].slug, "r290-high-temperature-series");
    for (const category of all.categories) {
      const results = queryCatalog({ locale, category: category.id });
      assert.ok(results.visibleProducts.every((product) => product.category === category.id));
      assert.equal(results.totalResults, source.products.filter((product) => product.category === category.id).length);
    }
    assert.equal(queryCatalog({ locale, query: "no-such-gold-product-zz999" }).visibleProducts.length, 0);
    assert.equal(queryCatalog({ locale, category: "not-a-category", page: "invalid" }).totalResults, source.products.length);
    assert.equal(queryCatalog({ locale, page: -20 }).currentPage, 1);
  });
}

test("all catalogue destinations are unique, prerendered and present in the bilingual sitemap", () => {
  const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
  assert.deepEqual(paths.sort(), [...config.prerender].sort());
  assert.equal(new Set(paths).size, paths.length);
  for (const locale of ["ar", "en"]) {
    const products = getCatalog(locale).products;
    assert.equal(new Set(products.map((product) => product.detailsPath)).size, products.length);
    for (const product of products) assert.ok(paths.includes(`/${locale}/${product.detailsPath}`));
  }
  assert.equal(getCatalogProduct("en", "missing"), undefined);
});
