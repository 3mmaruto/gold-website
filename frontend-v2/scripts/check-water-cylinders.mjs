import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../react-router.config.js";
import { getWaterCylinder } from "../app/data/waterCylinders.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFile(path.join(root, relativePath), "utf8");
const catalog = JSON.parse(await read("app/data/products.json"));
const cylinder = catalog.products.find((product) => product.id === "hot-water-cylinders");
const productPath = "products/hot-water-cylinders/";
const origin = "https://gold-group-hvac.com";
const expectedCapacities = [120, 200, 300, 500, 800, 1000];
const buildRoot = path.join(root, "build/client");
const checkedAssets = new Set();
// Generic markers only: a public repository must not name private suppliers even in tests.
const privateSourcePattern = /Safety\s+Valve\s*_20260908|WATER\s+TANK[^<>]*_20260911|[A-Z]:[\\/]Users[\\/]|Industrial\s+Zone|factory\s+address|supplier\s+(?:address|contact)|(?:Dist\.?|District)[,\s]+[^<>]{0,50}\bChina/i;
const retiredLabPath = /(?:^|\/)(?:gold-)?lab(?:\/|$|[?#])/i;

function assertNoPrivateSource(text, label) {
  assert.equal(privateSourcePattern.test(text), false, `${label}: no raw-source paths or supplier-address markers`);
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)]
    .map(([, name, value]) => [name.toLowerCase(), value]));
}

function textContent(html) {
  return html.replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").replaceAll("&#x27;", "'").trim();
}

function assertPublicMarkup(html, label) {
  assertNoPrivateSource(html, label);
  for (const [tag] of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attributes(tag).href;
    if (!href) continue;
    const url = new URL(href, origin);
    if (url.origin === origin) assert.equal(retiredLabPath.test(url.pathname), false, `${label}: no retired Lab link`);
  }
}

async function assertImageAssets(html, route) {
  for (const [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    const references = [attrs.src, ...(attrs.srcset?.split(",").map((entry) => entry.trim().split(/\s+/)[0]) ?? [])].filter(Boolean);
    for (const reference of references) {
      if (/^(?:data|blob):/i.test(reference)) continue;
      const url = new URL(reference, `${origin}${route}`);
      if (url.origin !== origin || checkedAssets.has(url.pathname)) continue;
      const assetPath = path.resolve(buildRoot, `.${decodeURIComponent(url.pathname)}`);
      assert.ok(assetPath.startsWith(`${buildRoot}${path.sep}`), `${route}: local image stays inside build output`);
      const asset = await fs.stat(assetPath).catch(() => null);
      assert.ok(asset?.isFile() && asset.size > 0, `${route}: image exists ${url.pathname}`);
      checkedAssets.add(url.pathname);
    }
  }
}

function flattenNavigation(items) {
  return items.flatMap((item) => [item, ...flattenNavigation(item.children ?? [])]);
}

assert.equal(cylinder.detailsPath, productPath);
assert.equal(cylinder.detailSpecs.length, 5);
assert.equal(cylinder.detailSpecs.at(-1).value.en, "120 L: 7 bar · 200 L: 10 bar");
assert.match(cylinder.detailSpecsTitle.ar, /120.*200/);
assert.match(cylinder.detailSpecsTitle.en, /120.*200/);
assert.equal(cylinder.highlights.en.includes("Coil configuration"), false);
assert.equal(new Set(config.prerender).size, 25);
assert.equal(config.prerender.length, 25, "no duplicate pre-render paths");
assert.ok(config.prerender.every((route) => !retiredLabPath.test(route)), "no retired Lab pre-render path");

const routes = await read("app/routes.js");
assert.ok(routes.indexOf('route("products/hot-water-cylinders"') < routes.indexOf('route("products/:productSlug"'));
assert.doesNotMatch(routes, /route\(\s*["'][^"']*(?:gold-)?lab(?:\/|["'])/i, "no explicit retired Lab route");
const sitemap = await read("public/sitemap.xml");
assert.equal([...sitemap.matchAll(/<loc>/g)].length, 25);
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
assert.deepEqual([...sitemapPaths].sort(), [...config.prerender].sort(), "sitemap matches every pre-render route");
assertNoPrivateSource(await read("app/data/waterCylinders.js"), "new public data");
const cylinderAssets = await fs.readdir(path.join(root, "public/media/products/water-cylinders"));
assert.ok(cylinderAssets.every((name) => !/\.pdf$/i.test(name)), "raw source PDFs are not published with cylinder images");

for (const locale of ["ar", "en"]) {
  const route = `/${locale}/${productPath}`;
  const content = JSON.parse(await read(`../docs/content/site-content.${locale}.json`));
  const navigation = content.navigation.menu.find((item) => item.id === "products");
  assert.ok(flattenNavigation(content.navigation.menu).every((item) => !retiredLabPath.test(item.path ?? "")), `${locale}: no retired Lab navigation`);
  assert.equal(navigation.children.filter((item) => item.path === productPath).length, 1);
  assert.ok(config.prerender.includes(route));
  assert.ok(sitemap.includes(`<loc>https://gold-group-hvac.com${route}</loc>`));
  const product = getWaterCylinder(locale);
  assert.deepEqual(product.capacities, expectedCapacities, `${locale}: exact available capacities`);
  assert.deepEqual(product.technical.rows[0].values, ["SK-120LT", "SK-200LT"]);
  for (const row of [...product.technical.rows, ...product.technical.extraRows]) {
    assert.equal(row.values.length, 2, `${locale}: specs only have the two documented models`);
  }
  assert.match(product.intro, /120.*200/, `${locale}: hero specs remain model-scoped`);

  if (process.argv.includes("--built")) {
    const html = await read(`build/client${route}index.html`);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${locale}: one h1`);
    assert.equal([...html.matchAll(/class="cylinder-anatomy cylinder-anatomy--/g)].length, 3, `${locale}: three annotated technical images`);
    assert.equal([...html.matchAll(/class="cylinder-callout cylinder-callout--/g)].length, 6, `${locale}: six readable HTML callouts`);
    for (const source of Object.values(product.assets)) assert.ok(html.includes(source.fallback), `${locale}: every new visual is used`);
    for (const anatomy of Object.values(product.anatomy)) for (const note of anatomy.notes) assert.ok(html.includes(note.value), `${locale}: technical value prerendered, not trapped in bitmap`);
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    assert.match(html, new RegExp(`<html[^>]*dir="${locale === "ar" ? "rtl" : "ltr"}"`));
    assert.ok(html.includes(`rel="canonical" href="https://gold-group-hvac.com${route}"`));
    for (const alternate of ["ar", "en"]) {
      assert.ok([...html.matchAll(/<link\b[^>]*>/gi)].some(([tag]) =>
        tag.toLowerCase().includes(`hreflang="${alternate}"`) &&
        tag.includes(`href="https://gold-group-hvac.com/${alternate}/${productPath}"`)
      ), `${locale}: ${alternate} hreflang`);
    }
    assert.match(html, /name="description" content="[^"<>]{40,}"/);
    const linkedData = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(([, value]) => JSON.parse(value));
    const productSchema = linkedData.find((item) => item["@type"] === "Product");
    assert.ok(productSchema, `${locale}: Product schema present`);
    assert.equal(productSchema.category, product.category, `${locale}: cylinder category, not a heat-pump category`);
    assert.equal(productSchema.url, `${origin}${route}`);
    assert.equal(productSchema.brand.name, "GOLD");
    assert.equal(productSchema.description, product.intro, `${locale}: schema matches visible current model scope`);
    const breadcrumbs = linkedData.find((item) => item["@type"] === "BreadcrumbList")?.itemListElement;
    assert.deepEqual(breadcrumbs?.map((item) => item.position), [1, 2, 3], `${locale}: three breadcrumb levels`);
    assert.equal(breadcrumbs[2].item, `${origin}${route}`);

    const tables = [...html.matchAll(/<table\b[^>]*class="cylinder-spec-table"[^>]*>([\s\S]*?)<\/table>/g)];
    assert.equal(tables.length, 2, `${locale}: primary and material specification tables`);
    for (const [, table] of tables) {
      const header = table.match(/<thead>([\s\S]*?)<\/thead>/)?.[1] ?? "";
      const cells = [...header.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map(([, cell]) => textContent(cell));
      assert.deepEqual(cells, [product.technical.specification, ...product.technical.modelNames], `${locale}: table headers only 120 and 200 L`);
      const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? "";
      for (const [row] of body.matchAll(/<tr>[\s\S]*?<\/tr>/g)) {
        assert.equal([...row.matchAll(/<td(?:\s|>)/g)].length, 2, `${locale}: each spec row covers exactly two models`);
      }
    }
    const capacitiesMarkup = html.match(/<ul\b[^>]*class="cylinder-capacity-list"[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? "";
    const visibleCapacities = [...capacitiesMarkup.matchAll(/<strong>\s*<bdi\b[^>]*>(\d+)<\/bdi>\s*<\/strong>/g)].map(([, value]) => Number(value));
    assert.deepEqual(visibleCapacities, expectedCapacities, `${locale}: exact rendered capacity list`);
    assertPublicMarkup(html, `${locale}: cylinder page`);
    const catalogHtml = await read(`build/client/${locale}/products/index.html`);
    assert.ok(catalogHtml.includes(`href="${route}"`), `${locale}: visible catalog route`);
    const scopedHeading = cylinder.detailSpecsTitle[locale].replaceAll("&", "&amp;");
    assert.ok(catalogHtml.includes(scopedHeading), `${locale}: model-scoped card specs`);
  }
}

if (process.argv.includes("--built")) {
  for (const route of config.prerender) {
    const html = await read(`build/client${route}index.html`);
    assert.ok(html.startsWith("<!DOCTYPE html>"), `${route}: pre-rendered HTML exists`);
    assertPublicMarkup(html, route);
    await assertImageAssets(html, route);
  }
  for (const retiredRoute of ["lab", "gold-lab", "ar/lab", "en/lab", "ar/gold-lab", "en/gold-lab"]) {
    const retiredIndex = await fs.stat(path.join(buildRoot, retiredRoute, "index.html")).catch(() => null);
    assert.equal(retiredIndex, null, `retired ${retiredRoute} output remains absent`);
  }
}

console.log(`Water-cylinder integration checks passed${process.argv.includes("--built") ? ` (25 pre-rendered pages, ${checkedAssets.size} local image assets, bilingual schema/specification/privacy checks)` : " (source; use --built after the production build)"}.`);
