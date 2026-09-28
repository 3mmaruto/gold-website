import assert from "node:assert/strict";
import { test } from "node:test";
import { validateBuildConfig } from "../scripts/validate-build-config.mjs";

// Fictional hostnames are never contacted; these tests validate configuration only.
const enabled = {
  GOLD_WEBSITE_RELEASE: "true",
  GOLD_WEBSITE_RELEASE_INTAKE: "enabled",
  GOLD_WEBSITE_PUBLIC_ORIGIN: "https://website.gold-fixture.net",
  VITE_GOLD_ERP_INTAKE_URL: "https://erp.gold-fixture.net/api/public/v1/quote-requests",
  VITE_GOLD_TURNSTILE_SITE_KEY: "non-secret-fixture-site-key",
};
const disabled = { GOLD_WEBSITE_RELEASE: "true", GOLD_WEBSITE_RELEASE_INTAKE: "disabled" };

test("preview builds remain usable without release resources", () => {
  assert.deepEqual(validateBuildConfig({}), { mode: "preview" });
  assert.deepEqual(validateBuildConfig({ VITE_GOLD_INTAKE_LOCAL_ONLY: "true" }), { mode: "preview" });
});

test("published intake state must be deliberate, not silently inferred from missing variables", () => {
  for (const mode of [undefined, "", "on", "true"]) {
    assert.throws(() => validateBuildConfig({ ...disabled, GOLD_WEBSITE_RELEASE_INTAKE: mode }), /GOLD_WEBSITE_RELEASE_INTAKE/);
  }
  assert.deepEqual(validateBuildConfig(disabled), { mode: "disabled" });
  assert.deepEqual(validateBuildConfig(enabled), { mode: "enabled" });
});

test("published disabled form cannot retain stale enabled configuration", () => {
  for (const changes of [
    { VITE_GOLD_ERP_INTAKE_URL: enabled.VITE_GOLD_ERP_INTAKE_URL },
    { VITE_GOLD_TURNSTILE_SITE_KEY: enabled.VITE_GOLD_TURNSTILE_SITE_KEY },
    { VITE_GOLD_INTAKE_PDF_ENABLED: "true" },
  ]) assert.throws(() => validateBuildConfig({ ...disabled, ...changes }), /Disabled release intake/);
});

test("local bypass and mistyped boolean flags never publish", () => {
  for (const env of [enabled, disabled]) {
    assert.throws(() => validateBuildConfig({ ...env, VITE_GOLD_INTAKE_LOCAL_ONLY: "true" }), /cannot be enabled/);
  }
  for (const key of ["GOLD_WEBSITE_RELEASE", "VITE_GOLD_INTAKE_LOCAL_ONLY", "VITE_GOLD_INTAKE_PDF_ENABLED"]) {
    for (const val of ["yes", "TRUE", "1"]) assert.throws(() => validateBuildConfig({ ...enabled, [key]: val }), /exactly true or false/);
  }
});

test("enabled release requires real public HTTPS origins, exact path and non-test challenge", () => {
  for (const key of ["GOLD_WEBSITE_PUBLIC_ORIGIN", "VITE_GOLD_ERP_INTAKE_URL", "VITE_GOLD_TURNSTILE_SITE_KEY"]) {
    assert.throws(() => validateBuildConfig({ ...enabled, [key]: "" }), new RegExp(key));
  }
  for (const siteKey of ["1x00000000000000000000AA", "2x00000000000000000000AB", "3x00000000000000000000FF", "bad key"]) {
    assert.throws(() => validateBuildConfig({ ...enabled, VITE_GOLD_TURNSTILE_SITE_KEY: siteKey }), /SITE_KEY/);
  }
  for (const url of [
    "http://erp.gold-fixture.net/api/public/v1/quote-requests",
    "https://localhost/api/public/v1/quote-requests",
    "https://127.0.0.1/api/public/v1/quote-requests",
    "https://192.168.1.2/api/public/v1/quote-requests",
    "https://[::1]/api/public/v1/quote-requests",
    "https://erp.example.invalid/api/public/v1/quote-requests",
    "https://erp.example.com/api/public/v1/quote-requests",
    "https://erp.gold-fixture.net:8000/api/public/v1/quote-requests",
    "https://erp.gold-fixture.net/lab/api/quote-requests",
    "https://erp.gold-fixture.net/api/public/v1/quote-requests/",
    "https://erp.gold-fixture.net/api/public/v1/quote-requests?key=private-fixture",
    "https://erp.gold-fixture.net/api/public/v1/quote-requests#fragment",
    "https://user:private-fixture@erp.gold-fixture.net/api/public/v1/quote-requests",
  ]) {
    assert.throws(() => validateBuildConfig({ ...enabled, VITE_GOLD_ERP_INTAKE_URL: url }), /VITE_GOLD_ERP_INTAKE_URL/);
  }
  for (const origin of ["http://website.gold-fixture.net", "https://website.gold-fixture.net/ar/", "https://website.gold-fixture.net?x=1"]) {
    assert.throws(() => validateBuildConfig({ ...enabled, GOLD_WEBSITE_PUBLIC_ORIGIN: origin }), /GOLD_WEBSITE_PUBLIC_ORIGIN/);
  }
});

test("validation failures report names, never supplied private-looking values", () => {
  try { validateBuildConfig({ ...enabled, VITE_GOLD_ERP_INTAKE_URL: "https://user:DO-NOT-ECHO@erp.gold-fixture.net/wrong" }); }
  catch (error) { assert.equal(error.message.includes("DO-NOT-ECHO"), false); return; }
  assert.fail("invalid URL was accepted");
});
