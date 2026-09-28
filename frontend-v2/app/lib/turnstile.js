import { IntakeError } from "./quote-intake.js";

let scriptPromise;
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    const timer = setTimeout(fail, 15000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      scriptPromise = null;
      reject(new IntakeError("challenge"));
    }
    script.onerror = fail;
    script.onload = () => {
      if (!window.turnstile) return fail();
      clearTimeout(timer);
      resolve(window.turnstile);
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Explicit execution on submit. Every retry renders a fresh challenge/token.
export async function getTurnstileToken({ container, siteKey, locale, signal }) {
  const turnstile = await loadTurnstile();
  if (signal?.aborted) throw new IntakeError("challenge");
  return new Promise((resolve, reject) => {
    let widgetId;
    let settled = false;
    const timer = setTimeout(() => finish(new IntakeError("challenge")), 120000);
    const abort = () => finish(new IntakeError("challenge"));
    function finish(error, token) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      if (widgetId !== undefined) turnstile.remove(widgetId);
      if (error) reject(error); else resolve(token);
    }
    signal?.addEventListener("abort", abort, { once: true });
    try {
      widgetId = turnstile.render(container, {
        sitekey: siteKey,
        action: "quote_request",
        language: locale,
        theme: "light",
        size: "compact",
        execution: "execute",
        appearance: "execute",
        retry: "never",
        "refresh-expired": "never",
        "response-field": false,
        callback: (token) => finish(null, token),
        "error-callback": () => { finish(new IntakeError("challenge")); return true; },
        "expired-callback": () => finish(new IntakeError("challenge")),
        "timeout-callback": () => finish(new IntakeError("challenge")),
        "unsupported-callback": () => finish(new IntakeError("challenge")),
      });
      turnstile.execute(widgetId);
    } catch {
      finish(new IntakeError("challenge"));
    }
  });
}
