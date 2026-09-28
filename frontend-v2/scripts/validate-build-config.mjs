import { isIP } from "node:net";
import { resolveIntakeConfig, INTAKE_PATH } from "../app/lib/quote-intake.js";

const FLAGS = ["GOLD_WEBSITE_RELEASE", "VITE_GOLD_INTAKE_LOCAL_ONLY", "VITE_GOLD_INTAKE_PDF_ENABLED"];
const value = (env, key) => String(env[key] ?? "").trim();

function requirePublicHttpsUrl(input, label, path) {
  let url;
  try { url = new URL(input); } catch { throw new Error(`${label} must be an approved absolute HTTPS URL.`); }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash
    || url.pathname !== path || url.port || isIP(hostname) || !hostname.includes(".")
    || /\.(localhost|local|internal|test|invalid|example)$/i.test(hostname)
    || /(^|\.)example\.(com|net|org)$/i.test(hostname)) {
    throw new Error(`${label} must use an approved public HTTPS hostname, default port and exact path; no credentials, query or fragment.`);
  }
  return url;
}

// A build gate, not proof that a backend/site key exists or production is approved.
// Only variable names are reported: never echo values from the build environment.
export function validateBuildConfig(env = {}) {
  for (const key of FLAGS) {
    if (value(env, key) && !["true", "false"].includes(value(env, key))) {
      throw new Error(`${key} must be exactly true or false.`);
    }
  }
  if (value(env, "GOLD_WEBSITE_RELEASE") !== "true") return { mode: "preview" };

  const mode = value(env, "GOLD_WEBSITE_RELEASE_INTAKE");
  if (!["enabled", "disabled"].includes(mode)) {
    throw new Error("GOLD_WEBSITE_RELEASE_INTAKE must explicitly be enabled or disabled before publishing.");
  }
  if (value(env, "VITE_GOLD_INTAKE_LOCAL_ONLY") === "true") {
    throw new Error("VITE_GOLD_INTAKE_LOCAL_ONLY cannot be enabled in a published build.");
  }
  const endpoint = value(env, "VITE_GOLD_ERP_INTAKE_URL");
  const siteKey = value(env, "VITE_GOLD_TURNSTILE_SITE_KEY");
  if (mode === "disabled") {
    if (endpoint || siteKey || value(env, "VITE_GOLD_INTAKE_PDF_ENABLED") === "true") {
      throw new Error("Disabled release intake requires empty endpoint/site key and disabled PDF intake. Remove stale configuration or explicitly enable intake.");
    }
    return { mode };
  }

  const origin = requirePublicHttpsUrl(value(env, "GOLD_WEBSITE_PUBLIC_ORIGIN"), "GOLD_WEBSITE_PUBLIC_ORIGIN", "/");
  requirePublicHttpsUrl(endpoint, "VITE_GOLD_ERP_INTAKE_URL", INTAKE_PATH);
  if (!siteKey || /\s/.test(siteKey) || /^[123]x0{6}/.test(siteKey)) {
    throw new Error("VITE_GOLD_TURNSTILE_SITE_KEY must be an approved non-test public site key.");
  }
  const resolved = resolveIntakeConfig(env, origin.origin);
  if (!resolved.enabled || resolved.localWithoutChallenge) {
    throw new Error("The public intake configuration does not resolve to a challenge-protected form.");
  }
  return { mode };
}
