import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { JSDOM } from "jsdom";
import { createServer } from "vite";
import { intakeCopy } from "../app/lib/intake-copy.js";
import { getTurnstileToken } from "../app/lib/turnstile.js";

// Real React DOM mount; Vite transforms the existing JSX without opening a port.
const dom = new JSDOM("<!doctype html><html><body><div id='test-root'></div></body></html>", { url: "http://127.0.0.1:4173/ar/contact/", pretendToBeVisual: true });
for (const name of ["window", "document", "navigator", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "Event", "MouseEvent"]) Object.defineProperty(globalThis, name, { configurable: true, value: name === "window" ? dom.window : dom.window[name] });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { createRoot, hydrateRoot } = await import("react-dom/client");
const { renderToString } = await import("react-dom/server");
const { act } = React;
const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", oxc: { jsx: { runtime: "automatic" } } });
const { default: QuoteRequestForm } = await vite.ssrLoadModule("/app/components/QuoteRequestForm.jsx");
const container = document.getElementById("test-root");
const realFetch = globalThis.fetch;
const contact = { email: "qa@example.invalid", form: { name: "Name", phone: "Phone", address: "Address", area: "Area", areaUnit: "m²", title: "Request", eyebrow: "GOLD" } };
const localEnv = { VITE_GOLD_ERP_INTAKE_URL: "http://127.0.0.1:8000/api/public/v1/quote-requests", VITE_GOLD_INTAKE_LOCAL_ONLY: "true" };
const receipt = { data: { reference_id: "GQR-0123456789ABCDEF", status: "received", received_at: "2026-09-23T10:00:00Z" } };
const reply = (status, data = receipt) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
let root;

async function mount(props = {}) {
  root = createRoot(container);
  await act(async () => root.render(React.createElement(QuoteRequestForm, { locale: "ar", contact, environment: localEnv, ...props })));
}
async function input(name, value) {
  const element = container.querySelector(`[name="${name}"]`);
  const prototype = element.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, value);
    element.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
}
async function fill() {
  for (const [name, value] of Object.entries({ name: "QA fictional", phone: "+963999000000", location: "QA location", area_sqm: "120", description: "Test only" })) await input(name, value);
  await act(async () => container.querySelector('[name="consent"]').click());
}
async function submit() { await act(async () => container.querySelector("form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }))); }
async function waitFor(check) {
  for (let index = 0; index < 100; index++) {
    if (check()) return;
    await act(async () => new Promise((resolve) => setTimeout(resolve, 5)));
  }
  assert.ok(check(), "UI did not reach the expected state");
}
beforeEach(async () => {
  if (root) await act(async () => root.unmount());
  root = null;
  dom.reconfigure({ url: "http://127.0.0.1:4173/ar/contact/" });
  Object.defineProperty(dom.window.navigator, "onLine", { configurable: true, value: true });
  globalThis.fetch = async () => { throw new Error("Unexpected network request in test"); };
  delete dom.window.turnstile;
});
after(async () => {
  if (root) await act(async () => root.unmount());
  await vite.close();
  globalThis.fetch = realFetch;
  dom.window.close();
});

test("unconfigured UI is honest and has usable contact links, no dead submit or Google requirement", async () => {
  let networkCalls = 0;
  globalThis.fetch = async () => { networkCalls++; throw new Error("Disabled intake must not send"); };
  for (const locale of ["ar", "en"]) {
    await mount({ environment: {}, locale });
    assert.ok(container.textContent.includes(intakeCopy[locale].unavailableTitle));
    assert.equal(container.querySelector('[type="submit"]'), null);
    assert.equal(container.querySelector("input, textarea"), null);
    assert.equal(container.querySelector(".intake-reference"), null);
    assert.ok(container.querySelector('a[href^="tel:"]'));
    assert.ok(container.querySelector('a[href^="mailto:"]'));
    assert.equal(container.textContent.includes("Google"), false);
    await submit();
    assert.equal(networkCalls, 0);
    await act(async () => root.unmount());
    root = null;
  }
});

test("AR/EN prerender uses a neutral initial state, then hydrates without an unavailable flash", async () => {
  for (const locale of ["ar", "en"]) {
    const element = React.createElement(QuoteRequestForm, { locale, contact, environment: localEnv });
    container.innerHTML = renderToString(element);
    assert.equal(container.querySelector('[role="status"]').textContent, intakeCopy[locale].initializing);
    assert.equal(container.textContent.includes(intakeCopy[locale].unavailableTitle), false);
    assert.equal(container.querySelector("form").getAttribute("aria-busy"), "true");
    assert.ok(container.querySelector("noscript"));
    await act(async () => { root = hydrateRoot(container, element); });
    assert.ok(container.querySelector('[type="submit"]'));
    assert.equal(container.textContent.includes(intakeCopy[locale].initializing), false);
    assert.equal(container.textContent.includes(intakeCopy[locale].unavailableTitle), false);
    assert.equal(container.querySelector("form").getAttribute("aria-busy"), "false");
    await act(async () => root.unmount());
    root = null;
  }
});

test("form exposes one submit, manual international contact and explicit unchecked consent", async () => {
  await mount();
  assert.equal(container.querySelectorAll('[type="submit"]').length, 1);
  assert.equal(container.querySelector('[name="phone"]').value, "+963");
  assert.equal(container.querySelector('[name="phone"]').dir, "ltr");
  assert.equal(container.querySelector('[name="consent"]').checked, false);
  assert.equal(container.querySelector('[name="plan"]'), null);
  assert.equal(container.querySelector('a[href*="wa.me"]'), null);
  assert.ok(container.textContent.includes(intakeCopy.ar.privacy));
  assert.equal(container.querySelector(".intake-consent span").textContent, intakeCopy.ar.consent);
  assert.equal(container.textContent.includes(intakeCopy.ar.consentWithPlan), false);
});

test("validation focuses the translated error and does not submit or erase fields", async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return reply(201); };
  await mount();
  await input("name", "QA retained");
  await submit();
  assert.equal(calls, 0);
  assert.equal(container.querySelector('[name="name"]').value, "QA retained");
  assert.equal(document.activeElement.getAttribute("role"), "alert");
  assert.equal(container.querySelector('[name="consent"]').getAttribute("aria-invalid"), "true");
});

test("pending locks double clicks; validated response alone shows a reference and clears inputs", async () => {
  let resolveRequest;
  const calls = [];
  globalThis.fetch = (_, options) => { calls.push(options); return new Promise((resolve) => { resolveRequest = resolve; }); };
  await mount();
  await fill();
  await submit();
  await waitFor(() => calls.length === 1);
  assert.equal(container.querySelector('[type="submit"]').disabled, true);
  assert.equal(container.querySelector("form").getAttribute("aria-busy"), "true");
  await submit();
  assert.equal(calls.length, 1);
  assert.equal(container.querySelector(".intake-reference"), null);
  await act(async () => resolveRequest(reply(201)));
  await waitFor(() => Boolean(container.querySelector(".intake-reference")));
  assert.equal(container.querySelector(".intake-reference").textContent, receipt.data.reference_id);
  assert.equal(document.activeElement.getAttribute("role"), "status");
  await act(async () => container.querySelector('button[type="button"]').click());
  assert.equal(container.querySelector('[name="name"]').value, "");
  assert.equal(container.querySelector('[name="consent"]').checked, false);
});

test("lost-response retry retains payload and key; edited input generates a new key", async () => {
  const calls = [];
  globalThis.fetch = async (_, options) => { calls.push(options); throw new TypeError("Lost response"); };
  await mount();
  await fill();
  await submit();
  await waitFor(() => Boolean(container.querySelector('[role="alert"]')));
  assert.equal(container.querySelector('[name="name"]').value, "QA fictional");
  assert.equal(container.querySelector('[name="consent"]').checked, true);
  await submit();
  await waitFor(() => calls.length === 2 && !container.querySelector('[type="submit"]').disabled);
  assert.equal(calls[0].headers["Idempotency-Key"], calls[1].headers["Idempotency-Key"]);
  assert.equal(calls[0].body, calls[1].body);
  await input("area_sqm", "121");
  await submit();
  await waitFor(() => calls.length === 3 && !container.querySelector('[type="submit"]').disabled);
  assert.notEqual(calls[1].headers["Idempotency-Key"], calls[2].headers["Idempotency-Key"]);
  assert.equal(dom.window.localStorage.length, 0);
  assert.equal(dom.window.sessionStorage.length, 0);
});

test("English PDF gate and server validation preserve form without rendering server messages", async () => {
  globalThis.fetch = async () => reply(422, { errors: { phone: ["PRIVATE-SERVER-TEXT"], plan: ["PRIVATE-PLAN-TEXT"] } });
  await mount({ locale: "en", environment: { ...localEnv, VITE_GOLD_INTAKE_PDF_ENABLED: "true" } });
  assert.ok(container.querySelector('[name="plan"]'));
  assert.ok(container.textContent.includes(intakeCopy.en.planHint));
  assert.equal(container.querySelector(".intake-consent span").textContent, intakeCopy.en.consentWithPlan);
  await fill();
  await submit();
  await waitFor(() => Boolean(container.querySelector('[role="alert"]')));
  assert.equal(container.querySelector('[name="phone"]').value, "+963999000000");
  assert.ok(container.textContent.includes(intakeCopy.en.fields.phone));
  assert.equal(container.textContent.includes("PRIVATE"), false);
});

test("offline disables submission and reconnect recovers without clearing values", async () => {
  await mount();
  await input("name", "QA offline");
  Object.defineProperty(dom.window.navigator, "onLine", { configurable: true, value: false });
  await act(async () => dom.window.dispatchEvent(new dom.window.Event("offline")));
  assert.equal(container.querySelector('[type="submit"]').disabled, true);
  assert.ok(container.textContent.includes(intakeCopy.ar.offline));
  Object.defineProperty(dom.window.navigator, "onLine", { configurable: true, value: true });
  await act(async () => dom.window.dispatchEvent(new dom.window.Event("online")));
  assert.equal(container.querySelector('[type="submit"]').disabled, false);
  assert.equal(container.querySelector('[name="name"]').value, "QA offline");
});

test("production retry obtains a fresh challenge with the same idempotency key", async () => {
  dom.reconfigure({ url: "https://www.example.invalid/en/contact/" });
  const tokens = [];
  const requests = [];
  const requestToken = async (options) => { tokens.push(options); return `fresh-${tokens.length}`; };
  globalThis.fetch = async (_, options) => { requests.push(options); return requests.length === 1 ? reply(503, {}) : reply(200); };
  await mount({ locale: "en", requestToken, environment: { VITE_GOLD_ERP_INTAKE_URL: "https://erp.example.invalid/api/public/v1/quote-requests", VITE_GOLD_TURNSTILE_SITE_KEY: "approved-public-site-key" } });
  await fill();
  await submit();
  await waitFor(() => Boolean(container.querySelector('[role="alert"]')));
  await submit();
  await waitFor(() => Boolean(container.querySelector(".intake-reference")));
  assert.equal(tokens.length, 2);
  assert.equal(requests[0].headers["Idempotency-Key"], requests[1].headers["Idempotency-Key"]);
  assert.notEqual(JSON.parse(requests[0].body).turnstile_token, JSON.parse(requests[1].body).turnstile_token);
});

test("Turnstile adapter executes quote_request explicitly and removes each fresh widget", async () => {
  const widgets = [];
  const removed = [];
  dom.window.turnstile = {
    render(_element, options) { widgets.push(options); return widgets.length - 1; },
    execute(id) { queueMicrotask(() => widgets[id].callback(`token-${id}`)); },
    remove(id) { removed.push(id); },
  };
  for (let index = 0; index < 2; index++) assert.equal(await getTurnstileToken({ container, siteKey: "public", locale: "ar" }), `token-${index}`);
  assert.deepEqual(removed, [0, 1]);
  assert.equal(widgets[0].action, "quote_request");
  assert.equal(widgets[0].execution, "execute");
  assert.equal(widgets[0]["response-field"], false);
});

test("challenge failure allows safe retry; a pending challenge is removed on abort", async () => {
  const removed = [];
  let options;
  dom.window.turnstile = {
    render(_element, config) { options = config; return "qa-widget"; },
    execute() { queueMicrotask(() => options["error-callback"]()); },
    remove(id) { removed.push(id); },
  };
  await assert.rejects(getTurnstileToken({ container, siteKey: "public", locale: "en" }), { code: "challenge" });
  assert.deepEqual(removed, ["qa-widget"]);
  dom.window.turnstile.execute = () => {};
  const controller = new AbortController();
  const pending = getTurnstileToken({ container, siteKey: "public", locale: "ar", signal: controller.signal });
  await Promise.resolve();
  controller.abort();
  await assert.rejects(pending, { code: "challenge" });
  assert.deepEqual(removed, ["qa-widget", "qa-widget"]);
});
