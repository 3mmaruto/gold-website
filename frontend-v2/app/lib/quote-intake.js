export const INTAKE_PATH = "/api/public/v1/quote-requests";
export const MAX_PLAN_BYTES = 15 * 1024 * 1024;
export const FORM_VERSION = "website-intake-v1";
export const PRIVACY_NOTICE_VERSION = "quote-request-2026-09-23";
const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);
const FIELDS = new Set(["name", "phone", "location", "area_sqm", "description", "consent", "plan", "turnstile_token", "idempotency_key"]);

// Public build-time configuration only. This is never an authentication secret.
export function resolveIntakeConfig(env = {}, pageOrigin = "") {
  const disabled = { enabled: false, endpoint: "", siteKey: "", allowPlan: false, localWithoutChallenge: false };
  if (!env.VITE_GOLD_ERP_INTAKE_URL || !pageOrigin) return disabled;
  try {
    const endpoint = new URL(env.VITE_GOLD_ERP_INTAKE_URL);
    const page = new URL(pageOrigin);
    if (endpoint.pathname !== INTAKE_PATH || endpoint.search || endpoint.hash || endpoint.username || endpoint.password) return disabled;
    const localWithoutChallenge = env.VITE_GOLD_INTAKE_LOCAL_ONLY === "true"
      && LOOPBACK.has(endpoint.hostname) && LOOPBACK.has(page.hostname)
      && ["http:", "https:"].includes(endpoint.protocol)
      && ["http:", "https:"].includes(page.protocol);
    const siteKey = String(env.VITE_GOLD_TURNSTILE_SITE_KEY || "").trim();
    if (!localWithoutChallenge && (endpoint.protocol !== "https:" || page.protocol !== "https:" || !siteKey || /^[123]x0{6}/.test(siteKey))) return disabled;
    return {
      enabled: true,
      endpoint: endpoint.href,
      siteKey,
      allowPlan: env.VITE_GOLD_INTAKE_PDF_ENABLED === "true",
      localWithoutChallenge,
    };
  } catch {
    return disabled;
  }
}

export function sourceMetadata(href) {
  try {
    const page = new URL(href);
    const result = { source_page: `${page.origin}${page.pathname}`.slice(0, 2048) };
    for (const [key, limit] of [["utm_source", 100], ["utm_medium", 100], ["utm_campaign", 150]]) {
      const value = page.searchParams.get(key)?.trim();
      if (value) result[key] = value.slice(0, limit);
    }
    return result;
  } catch {
    return {};
  }
}

export function buildIntakePayload(values, locale, metadata = {}) {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    location: values.location.trim(),
    area_sqm: values.area_sqm.trim(),
    description: values.description.trim(),
    locale: locale === "ar" ? "ar" : "en",
    form_version: FORM_VERSION,
    privacy_notice_version: PRIVACY_NOTICE_VERSION,
    consent: values.consent,
    ...metadata,
  };
}

export function validateIntake(payload, plan, allowPlan) {
  const errors = {};
  if (!payload.name || payload.name.length > 255) errors.name = "name";
  if (!/^\+?[0-9٠-٩۰-۹][0-9٠-٩۰-۹\s().-]{5,30}$/u.test(payload.phone)) errors.phone = "phone";
  if (!payload.location || payload.location.length > 500) errors.location = "location";
  if (!payload.area_sqm || !Number.isFinite(Number(payload.area_sqm)) || Number(payload.area_sqm) <= 0 || Number(payload.area_sqm) > 1000000) errors.area_sqm = "area_sqm";
  if (payload.description.length > 3000) errors.description = "description";
  if (!payload.consent) errors.consent = "consent";
  if (plan && (!allowPlan || plan.size === 0 || plan.size > MAX_PLAN_BYTES || !/\.pdf$/i.test(plan.name) || (plan.type && plan.type !== "application/pdf"))) errors.plan = "plan";
  return errors;
}

// Memory only: no customer input, request body, token or file is persisted in browser storage.
// Comparing the file digest (not just its name/size) keeps retry identity exact.
export function createAttemptTracker(cryptoApi = globalThis.crypto) {
  let previous = null;
  return {
    reset() { previous = null; },
    async keyFor(payload, plan) {
      if (!cryptoApi?.randomUUID || !cryptoApi?.subtle) throw new IntakeError("unavailable");
      let digest = null;
      if (plan) {
        const bytes = await cryptoApi.subtle.digest("SHA-256", await plan.arrayBuffer());
        digest = Array.from(new Uint8Array(bytes), (value) => value.toString(16).padStart(2, "0")).join("");
      }
      const fingerprint = JSON.stringify([payload, digest]);
      if (!previous || previous.fingerprint !== fingerprint) previous = { fingerprint, key: cryptoApi.randomUUID() };
      return previous.key;
    },
  };
}

export class IntakeError extends Error {
  constructor(code, fields = {}) {
    super(code);
    this.name = "IntakeError";
    this.code = code;
    this.fields = fields;
  }
}

export async function submitIntake({ config, payload, plan, key, token, signal, fetcher = globalThis.fetch }) {
  if (!config.enabled || (!config.localWithoutChallenge && !token)) throw new IntakeError("unavailable");
  if (plan && !config.allowPlan) throw new IntakeError("validation", { plan: "plan" });
  const headers = { Accept: "application/json", "Accept-Language": payload.locale, "Idempotency-Key": key };
  let body;
  if (plan) {
    body = new FormData();
    for (const [field, value] of Object.entries(payload)) body.append(field, value === true ? "1" : String(value));
    body.append("plan", plan);
    if (token) body.append("turnstile_token", token);
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({ ...payload, ...(token ? { turnstile_token: token } : {}) });
  }
  let response;
  try {
    response = await fetcher(config.endpoint, { method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error", headers, body, signal });
  } catch {
    throw new IntakeError("unconfirmed");
  }
  let result = null;
  if ((response.headers.get("content-type") || "").includes("application/json")) {
    try { result = await response.json(); } catch { /* A malformed success is never accepted. */ }
  }
  if (response.status === 422) {
    const fields = {};
    for (const field of Object.keys(result?.errors || {})) if (FIELDS.has(field)) fields[field] = field;
    throw new IntakeError(fields.idempotency_key ? "conflict" : "validation", fields);
  }
  if (response.status === 429) throw new IntakeError("rate_limit");
  if (response.status === 409) throw new IntakeError("conflict");
  if (response.status === 413) throw new IntakeError("validation", { plan: "plan" });
  if (response.status === 403) throw new IntakeError("challenge");
  if (![200, 201].includes(response.status)) throw new IntakeError(response.status >= 500 ? "unconfirmed" : "unavailable");
  const data = result?.data;
  if (data?.status !== "received" || !/^GQR-[A-F0-9]{16}$/.test(data?.reference_id || "") || typeof data.received_at !== "string" || Number.isNaN(Date.parse(data.received_at))) throw new IntakeError("unconfirmed");
  return { reference: data.reference_id, receivedAt: data.received_at };
}
