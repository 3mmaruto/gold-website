import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import routerConfig from "../react-router.config.js";

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(frontendRoot, "..");
const buildRoot = join(frontendRoot, "build", "client");
const origin = "https://gold-group-hvac.com";

const pages = {
  ar: {
    path: "/ar/gold-lab/",
    otherPath: "/en/gold-lab/",
    dir: "rtl",
    ogLocale: "ar_SY",
    h1: "بيتان. نفس الحرارة. فاتورتان مختلفتان.",
  },
  en: {
    path: "/en/gold-lab/",
    otherPath: "/ar/gold-lab/",
    dir: "ltr",
    ogLocale: "en_US",
    h1: "Two houses. Equal heat. Different bills.",
  },
};

function decodeHtml(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };

  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|apos|gt|lt|quot);/gi,
    (_, entity) => {
      if (entity[0] !== "#") return named[entity.toLowerCase()];
      const hexadecimal = entity[1].toLowerCase() === "x";
      const number = Number.parseInt(
        entity.slice(hexadecimal ? 2 : 1),
        hexadecimal ? 16 : 10,
      );
      return Number.isFinite(number) ? String.fromCodePoint(number) : _;
    },
  );
}

function readBuiltFile(...parts) {
  const file = join(buildRoot, ...parts);
  assert.ok(existsSync(file), `Expected built file at ${file}`);
  return readFileSync(file, "utf8");
}

function htmlPath(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  return join(buildRoot, ...segments, "index.html");
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(
    (match) => match[0],
  );
}

function attributes(tag) {
  const result = new Map();
  const pattern = /\s([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(pattern)) {
    result.set(match[1].toLowerCase(), decodeHtml(match[2] ?? match[3]));
  }
  return result;
}

function tagByAttribute(html, tagName, attribute, expected) {
  const key = attribute.toLowerCase();
  const match = tags(html, tagName).find(
    (tag) => attributes(tag).get(key)?.toLowerCase() === expected.toLowerCase(),
  );
  assert.ok(match, `Expected <${tagName}> with ${attribute}="${expected}"`);
  return attributes(match);
}

function textContent(fragment) {
  return decodeHtml(
    fragment
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function pageHtml(locale) {
  return readFileSync(htmlPath(pages[locale].path), "utf8");
}

function content(locale) {
  return JSON.parse(
    readFileSync(
      join(repositoryRoot, "docs", "content", `site-content.${locale}.json`),
      "utf8",
    ),
  );
}

for (const [locale, expected] of Object.entries(pages)) {
  test(`${locale} Gold Lab build has localized HTML and SEO`, () => {
    const html = pageHtml(locale);
    const localizedSeo = content(locale).seo.goldLab;
    const htmlTag = attributes(tags(html, "html")[0]);

    assert.equal(htmlTag.get("lang"), locale);
    assert.equal(htmlTag.get("dir"), expected.dir);
    assert.equal(
      tags(html, "main").length,
      1,
      "Expected exactly one main element",
    );
    assert.equal(tags(html, "h1").length, 1, "Expected exactly one h1 element");
    assert.equal(
      textContent(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0] ?? ""),
      expected.h1,
    );

    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    assert.ok(title, "Expected a document title");
    assert.equal(textContent(title[1]), localizedSeo.title);

    const description = tagByAttribute(html, "meta", "name", "description");
    assert.equal(description.get("content"), localizedSeo.description);

    const ogTitle = tagByAttribute(html, "meta", "property", "og:title");
    const ogDescription = tagByAttribute(
      html,
      "meta",
      "property",
      "og:description",
    );
    const ogUrl = tagByAttribute(html, "meta", "property", "og:url");
    const ogLocale = tagByAttribute(html, "meta", "property", "og:locale");
    assert.equal(ogTitle.get("content"), localizedSeo.title);
    assert.equal(ogDescription.get("content"), localizedSeo.description);
    assert.equal(ogUrl.get("content"), `${origin}${expected.path}`);
    assert.equal(ogLocale.get("content"), expected.ogLocale);

    const twitterTitle = tagByAttribute(html, "meta", "name", "twitter:title");
    const twitterDescription = tagByAttribute(
      html,
      "meta",
      "name",
      "twitter:description",
    );
    assert.equal(twitterTitle.get("content"), localizedSeo.title);
    assert.equal(twitterDescription.get("content"), localizedSeo.description);

    const canonical = tagByAttribute(html, "link", "rel", "canonical");
    assert.equal(canonical.get("href"), `${origin}${expected.path}`);

    const alternates = new Map(
      tags(html, "link")
        .map(attributes)
        .filter((attrs) => attrs.get("rel")?.toLowerCase() === "alternate")
        .map((attrs) => [attrs.get("hreflang"), attrs.get("href")]),
    );
    assert.equal(alternates.get(locale), `${origin}${expected.path}`);
    assert.equal(
      alternates.get(locale === "ar" ? "en" : "ar"),
      `${origin}${expected.otherPath}`,
    );
    assert.equal(alternates.get("x-default"), `${origin}/`);
  });
}

test("English visible Gold Lab copy contains no Arabic outside the language switch", () => {
  const html = pageHtml("en");
  const languageLink = html.match(
    /<a\b(?=[^>]*\bclass=(?:"[^"]*\bgl-language\b[^"]*"|'[^']*\bgl-language\b[^']*'))[^>]*>[\s\S]*?<\/a>/i,
  );
  assert.ok(languageLink, "Expected the English page language switch");
  assert.equal(textContent(languageLink[0]), "العربية");

  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const visible = textContent(
    body
      .replace(languageLink[0], " ")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<template\b[\s\S]*?<\/template>/gi, " "),
  );
  assert.doesNotMatch(visible, /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u);
});

function collectBuiltIndexRoutes(directory) {
  const files = [];
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const target = join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.name === "index.html") files.push(target);
    }
  };
  visit(directory);

  return files
    .map((file) => relative(directory, file).split(sep).join("/"))
    .map((file) =>
      file === "index.html" ? "/" : `/${file.slice(0, -"index.html".length)}`,
    )
    .sort();
}

test("the build contains exactly the 25 configured prerender routes", () => {
  assert.ok(existsSync(buildRoot), `Expected build output at ${buildRoot}`);
  assert.ok(Array.isArray(routerConfig.prerender));
  assert.equal(routerConfig.prerender.length, 25);
  assert.equal(
    new Set(routerConfig.prerender).size,
    25,
    "Prerender paths must be unique",
  );
  assert.deepEqual(
    collectBuiltIndexRoutes(buildRoot),
    [...routerConfig.prerender].sort(),
  );
});

test("the built sitemap is at the root and lists exactly the prerender URLs", () => {
  const sitemap = readBuiltFile("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeHtml(match[1].trim()))
    .sort();
  const expectedLocations = routerConfig.prerender
    .map((routePath) => `${origin}${routePath}`)
    .sort();
  assert.deepEqual(locations, expectedLocations);

  for (const [locale, expected] of Object.entries(pages)) {
    const urlBlock = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gi)].find(
      (match) => match[1].includes(`<loc>${origin}${expected.path}</loc>`),
    );
    assert.ok(urlBlock, `Expected ${locale} Gold Lab sitemap entry`);
    const alternates = new Map(
      tags(urlBlock[1], "xhtml:link")
        .map(attributes)
        .map((attrs) => [attrs.get("hreflang"), attrs.get("href")]),
    );
    assert.equal(alternates.get(locale), `${origin}${expected.path}`);
    assert.equal(
      alternates.get(locale === "ar" ? "en" : "ar"),
      `${origin}${expected.otherPath}`,
    );
    assert.equal(alternates.get("x-default"), `${origin}/`);
  }
});

function localTarget(routePath, value) {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(value)
  ) {
    return null;
  }

  const pathname = decodeURIComponent(
    new URL(value, `${origin}${routePath}`).pathname,
  );
  const segments = pathname.split("/").filter(Boolean);
  const target = join(buildRoot, ...segments);
  return pathname.endsWith("/") ? join(target, "index.html") : target;
}

test("all local href and src targets used by Gold Lab exist in the build", () => {
  const missing = [];
  for (const [locale, expected] of Object.entries(pages)) {
    const html = pageHtml(locale);
    for (const tagName of ["a", "img", "link", "script"]) {
      for (const tag of tags(html, tagName)) {
        const attrs = attributes(tag);
        for (const attribute of ["href", "src"]) {
          const value = attrs.get(attribute);
          const target = localTarget(expected.path, value);
          if (target && !existsSync(target)) {
            missing.push(
              `${locale}: ${tagName}[${attribute}="${value}"] -> ${target}`,
            );
          }
        }
      }
    }
  }

  assert.deepEqual(missing, []);
});
