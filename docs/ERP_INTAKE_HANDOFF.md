# Guest website intake → Gold ERP

## Scope and status

This local implementation replaces the contact form's email/WhatsApp submission
methods with one bilingual guest submission to **Gold ERP**. Direct phone, email
and footer WhatsApp contact remain available. Google sign-in is neither required
nor used. A visitor identity never grants employee access.

Implemented in the water-cylinder worktree, based on `cafc7e8`; the current local
preparation branch is `feat/launch-local-preparation-20260925`. The separate
`gold-website` working tree on `feat/shared-visitor-local` contains unfinished
visitor-auth work and has **not** been modified or integrated here. The integration
cycle must review both branches deliberately, preserving this anonymous intake
path and the existing water-cylinder work. Do not copy the dirty sibling wholesale
or treat the Lab-local database/preview as the ERP intake service.

## Release decision — 2026-09-28

The user explicitly approved publishing the cylinder pages and this contact UI
before activating backend intake. Publish with `GOLD_WEBSITE_RELEASE_INTAKE=disabled`,
empty endpoint/site key, and PDF intake disabled. The existing unavailable state
offers phone/email contact; footer WhatsApp remains a direct contact link. There
is no enabled submission button, fabricated reference, or optimistic success.

The future canonical ERP endpoint is
`https://erp.gold-group-hvac.com/api/public/v1/quote-requests`. It is **not enabled
by this website release**. Real Turnstile, exact origins, organization routing,
privacy/retention approval and end-to-end receipt/inbox/assignment checks remain
separate activation gates. No ERP source, account, cloud configuration or DNS is
changed by the website publication. See `WEBSITE_RELEASE_2026-09-28.md` for scoped
release evidence. Earlier dated checks below describe their original local state.

## Contract

`POST <configured ERP origin>/api/public/v1/quote-requests`

- JSON without a plan; multipart form data with a plan.
- Headers: `Accept: application/json`, `Accept-Language: ar|en`,
  `Idempotency-Key: <random UUID>`. The browser does not send employee cookies or
  an Authorization header (`credentials: omit`).
- Required fields: `name`, `phone`, `location`, `area_sqm`, `locale`,
  `form_version`, `privacy_notice_version`, `consent`.
- Optional fields: `description`, `source_page`, `utm_source`, `utm_medium`,
  `utm_campaign`, `plan`. Production requests also require `turnstile_token`.
- Name ≤255 characters, phone ≤32, location ≤500, description ≤3000;
  area >0 and ≤1,000,000 m². UTM limits: 100/100/150 respectively.
- `source_page` contains origin/path only, not arbitrary query parameters/hash.
- Phone starts with editable `+963`; international/local Syrian numbers remain
  possible. ERP performs normalization and authoritative validation.
- One optional PDF ≤15 MiB, nonempty. The frontend checks extension/MIME/size;
  these checks **do not replace** ERP signature validation, private storage,
  attachment access controls, quarantine/scanning and the server feature gate.
- Consent is unchecked initially and covers processing this request, not
  marketing. Notice version: `quote-request-2026-09-23`; form version:
  `website-intake-v1`. Approve the notice, retention and contact process before
  public activation. Change the notice version when its purpose/text changes.

Success is accepted only for HTTP `201` (new) or `200` (idempotent replay), with
JSON of the following shape:

```json
{
  "data": {
    "reference_id": "GQR-0123456789ABCDEF",
    "status": "received",
    "received_at": "2026-09-23T10:00:00Z"
  }
}
```

The example reference is fictional. A reference is shown only after validating
this response; it is not a public retrieval credential and creates no public GET
link. No preview of internal assignment, employee identity or customer data is
returned to the visitor.

## Failure/retry behavior

- Required-field and server validation errors retain every entered value/file.
  Known fields receive localized messages; raw server messages are not rendered.
- Pending requests lock the form and guard duplicate clicks synchronously.
- Network loss, timeout, malformed response or server failure never shows success.
  The page asks the visitor to keep it open and retry with the same data.
- Exact same payload and file bytes reuse the UUID, including after a lost
  response. File identity uses SHA-256, not just its filename/size. A user edit or
  explicit new request gets a new UUID. The Turnstile token is not part of this
  identity; each retry gets a fresh token.
- The attempt tracker and inputs live in page memory only, not localStorage,
  sessionStorage, analytics or a frontend queue. Closing/reloading the page loses
  this retry identity; no cross-session deduplication is promised.
- 422 validation, 413 file size, 429 rate limiting, challenge failures and
  idempotency conflicts have distinct translated states. A conflict disables
  repeating that attempt and directs the visitor to official contact channels.
- Offline disables submit while retaining the open page's input. There is no
  offline business mutation or optimistic success.

## Public configuration and fail-closed defaults

See `frontend-v2/.env.example`. All `VITE_*` values are publicly bundled; no
Turnstile secret, API token, employee credential or private service key belongs
there. Local `.env*` files are ignored except the placeholder example.

| Variable | Default / rule |
| --- | --- |
| `VITE_GOLD_ERP_INTAKE_URL` | Empty → form unavailable with normal contact links. Exact path above, no URL credentials/query/hash. |
| `VITE_GOLD_TURNSTILE_SITE_KEY` | Empty → public form unavailable. Public site key only; known dummy test keys rejected for public mode. |
| `VITE_GOLD_INTAKE_PDF_ENABLED` | `false`; enable only alongside the independently approved ERP PDF gate. |
| `VITE_GOLD_INTAKE_LOCAL_ONLY` | `false`; explicit challenge bypass works only when **both** page and API use loopback hosts. |

Public operation requires HTTPS for both page and endpoint plus a configured
site key. Missing/invalid configuration never redirects to Lab, WhatsApp form
submission, or a pretend success. LAN HTTP is deliberately not enabled by the
local bypass.

For a supervised local stack only, pass public build/runtime values:

```text
VITE_GOLD_ERP_INTAKE_URL=http://127.0.0.1:8000/api/public/v1/quote-requests
VITE_GOLD_INTAKE_LOCAL_ONLY=true
VITE_GOLD_INTAKE_PDF_ENABLED=false
```

Open the website via `http://127.0.0.1:<chosen local port>`. ERP must separately
allow that **exact origin** and be explicitly configured for its safe local test
challenge mode. Frontend settings do not bypass backend verification. Use only
fictional contacts and approved test PDFs. Rebuild when Vite configuration changes;
these values are compile-time, not server-side environment lookup.

## Turnstile, CORS and CSP deployment gates

- Official explicit client API:
  `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`.
  Load on first submission, action **`quote_request`**, language `ar`/`en`, compact
  challenge, explicit execution. Fresh widget/token per retry, removed afterward.
  No extra vendor wrapper and no token logging.
- ERP must verify Siteverify success, exact expected hostname and action
  `quote_request`; never trust frontend success alone. A valid token is not an
  employee session or authorization credential.
- Exact CORS origin allowlist, no wildcard credentials. Permit POST/OPTIONS and
  `Accept`, `Accept-Language`, `Content-Type`, `Idempotency-Key`. Responses must not
  be cached with customer data. The browser does not require response-header
  exposure to recognize replay because the response body is authoritative.
- Add the chosen ERP origin to the site's CSP `connect-src`. Permit
  `https://challenges.cloudflare.com` in `script-src` and `frame-src`; maintain
  the site's other legitimate policy needs. Verify the deployed policy, preflight,
  proxy body size and private PDF/quarantine behavior before enabling intake.
- The future public privacy notice and operational retention/deletion procedure
  must agree with the form notice; a technical implementation is not legal approval.

Official references:

- [Explicit Turnstile rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Widget configuration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)
- [Turnstile CSP](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)
- [Server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## Verification and integration checklist

- Local automated result (2026-09-23): **23/23 intake tests passed**, route-type
  generation passed, production build/prerender passed, full npm audit reported
  **0 vulnerabilities**, and `git diff --check` passed. No browser/physical-device
  acceptance is implied by these checks.
- Coordinating-task browser evidence (2026-09-23): real fictional AR and EN guest
  submissions returned 201. The AR request was independently confirmed in ERP as
  new/unassigned with one creation event; retry after a failed network/CORS attempt
  did not duplicate it. No false success appeared during the rejected attempt.
  Root checked 390/768/1440px with no overflow, Arabic RTL/English LTR and focus;
  EN offline retained the fields, disabled submit, then recovered on reconnect.
  No application console errors were observed in the accepted flow. This does
  not claim authenticated employee-screen or production Turnstile acceptance.
- Initial prerender now uses a neutral localized “preparing” state, with normal
  contact links in the no-JavaScript fallback. Configuration-unavailable wording
  appears only after hydration checks. Consent mentions a plan only when the PDF
  option is enabled. The SSR-to-hydrated transition is covered in both languages.
- Existing `.github/workflows/pages.yml` now runs the intake tests and route-type
  generation before the static build/artifact step. The 2026-09-25 preparation
  adds pull-request verification, restricts artifact upload/deployment to `main`,
  scopes Pages/OIDC write permissions to deployment, and injects public repository
  variables into the build. No workflow has been triggered by this local work.
- Pre-existing build advisories were addressed with scoped compatible updates:
  `sharp` 0.35.3 → 0.35.4, `browserslist` 4.28.4 → 4.29.0, and
  `baseline-browser-mapping` 2.10.38 → 2.11.25. These are compatible minor/patch
  security resolutions; no framework major version changed.
  The build regenerated AVIF encoder metadata; only those generated binary diffs
  were restored to keep this intake change free of unrelated product images.
- `npm run test:intake`: executable configuration/transport/idempotency tests plus
  actual React DOM mounted form tests using jsdom (Vite middleware transform; no
  test HTTP listener). Covers AR/EN copy, consent, no-auth path, disabled config,
  international phone, PDF gate, validation, retry identity, pending double click,
  lost response, fresh challenge, success reference, malformed success, offline.
- `npm run typecheck` is the existing React Router **route-type generation**
  script, not a claim of full TypeScript checking of this JavaScript codebase.
- `npm run build`, `npm audit`, and `git diff --check` are additional gates.
  This repo has no existing lint script; do not claim a lint gate ran.
- Coordinating-task browser QA: 390/768/1440px, AR RTL and EN LTR, keyboard/focus,
  no horizontal overflow, missing configuration, submit/retry/error, real local
  guest request → ERP admin inbox → assignment. Manager must see only assigned
  requests. Direct footer WhatsApp must still work without form data.
- PDF-enabled QA separately verifies a fictional PDF arrives privately in ERP;
  disabled gate must omit the picker and server must reject direct bypasses.
- Public/staging gate still needs a real allowed hostname + Turnstile challenge,
  HTTPS/CSP/CORS, current privacy approval, security/retention readiness. No cloud
  resources or DNS changes are authorized by this handoff.
- Never retain real contact screenshots, authenticated HAR files, cookies/session
  headers, challenge tokens or private uploaded plans as repository test evidence.

## Files

The contact route delegates to `QuoteRequestForm.jsx`. `quote-intake.js` owns
config, validation, transport and in-memory retry identity; `turnstile.js` owns
the official challenge adapter; `intake-copy.js` owns complete AR/EN messages.
`quote-intake.css` is scoped to this form and preserves the existing gold/navy
brand. No visitor-auth or Lab code is imported.

## 2026-09-25 release-configuration gate

The earlier browser checks above remain historical local evidence; they do not
validate a future hostname, Google integration or production Turnstile site key.
Visitor Google sign-in and Gold Lab remain independent of anonymous intake and
are excluded from this release. Their unfinished local work is not publish input.

The existing publish-on-`main` behavior is preserved. Pull requests now verify
without deploying; manual dispatch on a feature branch cannot deploy either.
`vite.config.js` validates release configuration before the static build. Pages
sets `GOLD_WEBSITE_RELEASE=true` only for an eligible `main` publication.

Repository **Variables**, not Secrets, must be explicitly approved and set:

| Variable | Release requirement |
| --- | --- |
| `GOLD_WEBSITE_RELEASE_INTAKE` | `enabled` for the backend-aware launch. Missing is a hard failure. `disabled` is only for an explicitly approved content-only release/rollback. |
| `GOLD_WEBSITE_PUBLIC_ORIGIN` | Exact approved HTTPS website origin when enabled. |
| `VITE_GOLD_ERP_INTAKE_URL` | Exact ERP public intake HTTPS URL; never the Lab-local preview. |
| `VITE_GOLD_TURNSTILE_SITE_KEY` | Approved non-test public key for the allowed website hostname. |
| `VITE_GOLD_INTAKE_PDF_ENABLED` | Defaults `false`; match the independently accepted ERP attachment policy. |

The workflow fixes `VITE_GOLD_INTAKE_LOCAL_ONLY=false`. The guard rejects local
bypass, malformed flags, HTTP, IP/loopback/placeholder hosts, non-default ports,
wrong API paths, URL credentials/query/fragment, missing keys and known dummy
Turnstile keys. Disabled release mode also rejects stale endpoint/key/PDF values,
so a cached enabled configuration cannot override an intentional disabled state.
Local preview builds remain possible without cloud configuration.

This is a **configuration gate**, not an endpoint reachability check or proof of
domain ownership, privacy approval or a working Turnstile challenge. A syntactically
valid site key can still be wrong. Before enabling intake, use approved HTTPS hosts and
fictional data to verify POST/preflight/CSP, receipt reference, one ERP new/unassigned
record, retry without duplication, assignment authorization and both locales.
Do not change repository variables or invoke the workflow without the release
owner's approval. No resource names, region or infrastructure sizes are chosen here.

Local verification on 2026-09-25, using bundled Node **24.19.0** (the machine's
default 22.20.0 is below this project's declared minimum):

- `npm run test:intake`: **29/29 passed**, including six release-config tests and
  the existing real React DOM form tests.
- `npm run typecheck`: route-type generation passed; no full TypeScript claim.
- `npm run build`: passed; **25 localized/landing HTML routes** plus SPA fallback.
- `node scripts/check-water-cylinders.mjs --built`: passed, including 166 local
  image assets and bilingual schema/specification/privacy checks.
- `npm audit` and `npm audit --omit=dev`: **0 vulnerabilities** at verification.
- Actual `react-router build` with release mode enabled but no explicit intake
  decision failed at configuration loading as intended, before producing a new
  publishable build. This is a negative test, not a build regression.
- `git diff --check`: passed. Build-regenerated AVIF binary changes were reverted
  only for previously clean assets, leaving the cylinder/intake work intact.
- No lint script exists in this repository. No services, browser, cloud settings,
  GitHub workflow, remote change, commit or deployment were started by this pass.
  A successful local build does not mean the production host contract is approved.
