import assert from "node:assert/strict";
import { test } from "node:test";
import { webcrypto } from "node:crypto";
import { buildIntakePayload, createAttemptTracker, INTAKE_PATH, MAX_PLAN_BYTES, resolveIntakeConfig, sourceMetadata, submitIntake, validateIntake } from "../app/lib/quote-intake.js";

const localEnv = { VITE_GOLD_ERP_INTAKE_URL: `http://127.0.0.1:8000${INTAKE_PATH}`, VITE_GOLD_INTAKE_LOCAL_ONLY: "true" };
const local = resolveIntakeConfig(localEnv, "http://127.0.0.1:4173");
const production = resolveIntakeConfig({ VITE_GOLD_ERP_INTAKE_URL: `https://erp.example.invalid${INTAKE_PATH}`, VITE_GOLD_TURNSTILE_SITE_KEY: "approved-public-site-key" }, "https://www.example.invalid");
const values = { name: "QA fictional", phone: "+963999000000", location: "QA location", area_sqm: "120", description: "Test only", consent: true };
const payload = buildIntakePayload(values, "ar");
const key = "36e74553-5ff5-42b1-902d-9cb8f3dd17b6";
const received = { data: { reference_id: "GQR-0123456789ABCDEF", status: "received", received_at: "2026-09-23T10:00:00Z" } };
const response = (status, body = received, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
const send = (fetcher, changes = {}) => submitIntake({ config: local, payload, key, fetcher, ...changes });

test("configuration is disabled by default and accepts only exact ERP route", () => {
  assert.equal(resolveIntakeConfig().enabled, false);
  assert.equal(local.enabled, true);
  assert.equal(local.allowPlan, false);
  assert.equal(local.localWithoutChallenge, true);
  for (const suffix of ["/lab", "/api/public/v1/quote-requests/", `${INTAKE_PATH}?token=oops`, `${INTAKE_PATH}#fragment`]) {
    assert.equal(resolveIntakeConfig({ ...localEnv, VITE_GOLD_ERP_INTAKE_URL: `http://127.0.0.1:8000${suffix}` }, "http://127.0.0.1:4173").enabled, false);
  }
  assert.equal(resolveIntakeConfig({ ...localEnv, VITE_GOLD_ERP_INTAKE_URL: `http://user:password@127.0.0.1:8000${INTAKE_PATH}` }, "http://127.0.0.1:4173").enabled, false);
});

test("HTTP bypass requires explicit opt-in and BOTH hosts to be loopback", () => {
  for (const origin of ["http://192.168.1.2", "https://www.example.invalid"]) assert.equal(resolveIntakeConfig(localEnv, origin).enabled, false);
  assert.equal(resolveIntakeConfig({ ...localEnv, VITE_GOLD_INTAKE_LOCAL_ONLY: "false" }, "http://localhost:4173").enabled, false);
  assert.equal(resolveIntakeConfig({ ...localEnv, VITE_GOLD_ERP_INTAKE_URL: `http://192.168.1.2:8000${INTAKE_PATH}` }, "http://localhost:4173").enabled, false);
});

test("public operation requires HTTPS website/API and a non-test site key", () => {
  assert.equal(production.enabled, true);
  assert.equal(production.localWithoutChallenge, false);
  const base = { VITE_GOLD_ERP_INTAKE_URL: `https://erp.example.invalid${INTAKE_PATH}`, VITE_GOLD_TURNSTILE_SITE_KEY: "approved-public-site-key" };
  assert.equal(resolveIntakeConfig(base, "http://www.example.invalid").enabled, false);
  assert.equal(resolveIntakeConfig({ ...base, VITE_GOLD_TURNSTILE_SITE_KEY: "" }, "https://www.example.invalid").enabled, false);
  assert.equal(resolveIntakeConfig({ ...base, VITE_GOLD_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" }, "https://www.example.invalid").enabled, false);
  assert.equal(resolveIntakeConfig({ ...base, VITE_GOLD_ERP_INTAKE_URL: `http://erp.example.invalid${INTAKE_PATH}` }, "https://www.example.invalid").enabled, false);
});

test("source metadata excludes query PII/hash and bounds only approved UTM fields", () => {
  const result = sourceMetadata(`https://www.example.invalid/ar/contact/?name=PRIVATE&utm_source=${"a".repeat(150)}&utm_medium=email&utm_campaign=${"b".repeat(200)}&utm_term=SECRET#private`);
  assert.equal(result.source_page, "https://www.example.invalid/ar/contact/");
  assert.equal(result.utm_source.length, 100);
  assert.equal(result.utm_campaign.length, 150);
  assert.equal(result.utm_medium, "email");
  assert.equal(JSON.stringify(result).includes("PRIVATE"), false);
  assert.equal("utm_term" in result, false);
});

test("payload has explicit consent/version/locale and supports international contacts", () => {
  assert.deepEqual(validateIntake(payload, null, false), {});
  assert.equal(buildIntakePayload(values, "en").locale, "en");
  assert.ok(payload.form_version && payload.privacy_notice_version);
  for (const phone of ["0096199900000", "+44 7700 900000", "٠٩٩٩٠٠٠٠٠٠"]) assert.equal(validateIntake({ ...payload, phone }, null, false).phone, undefined);
  assert.ok(validateIntake({ ...payload, phone: "+963", consent: false, area_sqm: "0" }, null, false).phone);
  assert.ok(validateIntake({ ...payload, consent: false }, null, false).consent);
});

test("optional PDF gate, size, type and empty-file validation", () => {
  const file = new File(["%PDF-1.7 fictional QA"], "qa.pdf", { type: "application/pdf" });
  assert.deepEqual(validateIntake(payload, file, true), {});
  assert.ok(validateIntake(payload, file, false).plan);
  for (const plan of [{ name: "qa.pdf", type: "application/pdf", size: MAX_PLAN_BYTES + 1 }, { name: "qa.pdf", type: "application/pdf", size: 0 }, { name: "qa.exe", type: "application/pdf", size: 10 }, { name: "qa.pdf", type: "image/jpeg", size: 10 }]) assert.ok(validateIntake(payload, plan, true).plan);
});

test("retry keys are stable for identical payload/file bytes, renewed for edits or new request", async () => {
  const tracker = createAttemptTracker(webcrypto);
  const file = new File(["one"], "qa.pdf", { type: "application/pdf" });
  const first = await tracker.keyFor(payload, file);
  assert.match(first, /^[0-9a-f-]{36}$/);
  assert.equal(await tracker.keyFor({ ...payload }, new File(["one"], "qa.pdf", { type: "application/pdf" })), first);
  const differentBytes = await tracker.keyFor(payload, new File(["two"], "qa.pdf", { type: "application/pdf" }));
  assert.notEqual(differentBytes, first);
  const edited = await tracker.keyFor({ ...payload, area_sqm: "121" }, file);
  assert.notEqual(edited, differentBytes);
  tracker.reset();
  assert.notEqual(await tracker.keyFor({ ...payload, area_sqm: "121" }, file), edited);
});

test("JSON POST does not depend on visitor auth/cookies and validates 201/200 reference", async () => {
  for (const status of [201, 200]) {
    const result = await send(async (url, options) => {
      assert.equal(url, local.endpoint);
      assert.equal(options.method, "POST");
      assert.equal(options.credentials, "omit");
      assert.equal(options.redirect, "error");
      assert.equal(options.headers["Idempotency-Key"], key);
      assert.equal(options.headers.Authorization, undefined);
      assert.deepEqual(JSON.parse(options.body), payload);
      return response(status);
    });
    assert.equal(result.reference, received.data.reference_id);
  }
});

test("PDF uses multipart without forcing a Content-Type boundary", async () => {
  const file = new File(["%PDF-1.7 fictional"], "qa.pdf", { type: "application/pdf" });
  await send(async (_, options) => {
    assert.ok(options.body instanceof FormData);
    assert.equal(options.headers["Content-Type"], undefined);
    assert.equal(options.body.get("consent"), "1");
    assert.equal(options.body.get("plan").name, "qa.pdf");
    assert.equal(options.body.get("turnstile_token"), "fresh-token");
    return response(201);
  }, { config: { ...production, allowPlan: true }, plan: file, token: "fresh-token" });
});

test("missing configuration/challenge prevents any request", async () => {
  let count = 0;
  const fetcher = async () => { count++; return response(201); };
  await assert.rejects(send(fetcher, { config: resolveIntakeConfig() }), { code: "unavailable" });
  await assert.rejects(send(fetcher, { config: production }), { code: "unavailable" });
  assert.equal(count, 0);
});

test("malformed/HTML/unconfirmed successes never show a reference", async () => {
  for (const body of [{}, { data: { ...received.data, status: "queued" } }, { data: { ...received.data, reference_id: "123" } }, { data: { ...received.data, received_at: "not-a-date" } }]) await assert.rejects(send(async () => response(201, body)), { code: "unconfirmed" });
  await assert.rejects(send(async () => new Response("<html>login</html>", { status: 200, headers: { "Content-Type": "text/html" } })), { code: "unconfirmed" });
  await assert.rejects(send(async () => new Response("{", { status: 201, headers: { "Content-Type": "application/json" } })), { code: "unconfirmed" });
});

test("failure mappings preserve retry semantics without displaying server text", async () => {
  await assert.rejects(send(async () => { throw new TypeError("network"); }), { code: "unconfirmed" });
  for (const [status, code] of [[429, "rate_limit"], [409, "conflict"], [403, "challenge"], [503, "unconfirmed"], [404, "unavailable"], [413, "validation"]]) await assert.rejects(send(async () => response(status, {})), { code });
  await assert.rejects(send(async () => response(422, { errors: { name: ["<unsafe>"], private_server_field: ["secret"] } })), (error) => error.code === "validation" && error.fields.name === "name" && Object.keys(error.fields).length === 1);
  await assert.rejects(send(async () => response(422, { errors: { idempotency_key: ["conflict"] } })), { code: "conflict" });
});
