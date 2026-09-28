# Website release — 2026-09-28

## Approved boundary

The user authorized a website-only push, pull request, merge and publication using
the existing GitHub Pages workflow, even while public request intake is unavailable.
No ERP Git remote/source push, ERP deployment/configuration/data changes, DNS or
cloud changes form part of this release. The ERP is a separate staff application.

Baseline: `0059f79930af67788fc02316233703d3bc8b74c2` (`main`). Product page commit:
`cafc7e8f02e5d5218ad877687452ad35593a5a20`. Release branch:
`feat/launch-local-preparation-20260925`.

Included:

- Bilingual hot-water cylinder pages, navigation, catalog details, optimized
  approved images, scoped specifications, sitemap and metadata.
- Current anonymous request form implementation, explicit disabled state, safe
  error/retry handling, contract and mounted React tests.
- Compatible build dependency security updates and existing Pages CI extended
  with PR verification and explicit release configuration checks.

Excluded: unfinished visitor Google sign-in, Lab integration/planning files,
retired Lab routes, private supplier PDFs, customer quotations, local environment
files, personal data and credentials. The dirty visitor-auth checkout is preserved
separately; it must not be merged wholesale into this release.

## Public behavior for this release

`GOLD_WEBSITE_RELEASE_INTAKE=disabled` is the explicitly approved public repository
variable. Endpoint and site key are empty, PDF intake is false, and local bypass
is fixed false by CI. No service is contacted by the disabled form. The contact
page shows a translated submission-unavailable notice with phone/email links;
direct WhatsApp contact remains in the footer. No false receipt or success is shown.

Activation later requires a new validated build with the approved endpoint and
public challenge key, plus the separate backend configuration and real receipt /
admin inbox / assignment acceptance in `ERP_INTAKE_HANDOFF.md`. This release does
not claim production intake, Google authentication or ERP PDF workflow acceptance.

## Verification

Local checks used Node 24.19.0 and the locked dependency set:

- Clean dependency install: passed; full npm audit reports zero vulnerabilities.
- Intake suite: 29/29 passed, including mounted React AR/EN disabled states,
  no network call or false receipt on attempted disabled submission, error/retry,
  duplicate-click protection, and published configuration rejection cases.
- Route-type generation: passed (the existing script is not a full TypeScript
  compiler check; no lint script exists in this JavaScript repository).
- Production build with explicit disabled release configuration: passed,
  25 prerendered routes. Cylinder integration checker passed for all 25 pages,
  166 local image assets, bilingual schema/specifications and retired-route checks.
- Public-source/diff review: no new raw PDFs, customer files, employee data,
  secrets or visitor-auth/Lab runtime included. Only the approved product imagery
  is added. Encoder-only regeneration of previously clean AVIFs is not staged.
- Chrome production-preview checks: AR RTL / EN LTR at 390, 768 and 1440 CSS px;
  no document horizontal overflow in tested cylinder/contact views. Disabled
  notice, phone/email contact and direct footer WhatsApp remained present.
  No application console errors were observed. Catalog `IPX4` search returns
  the cylinder; detail navigation, drawing anchor and equivalent-page language
  switch work. A keyboard focus ring was observed. No live form was submitted.

Screenshots are retained outside Git in the workspace's
`outputs/website-release-20260928/` folder. This is desktop responsive emulation,
not a new physical-device test or full accessibility certification. GitHub PR and
main-deployment results are reported in the handoff after CI; local success alone
is not a deployment claim.

## Recovery

If the website release fails after merge, revert the reviewed release merge through
a new PR and use the same Pages workflow to republish the prior website. No force
push, ERP rollback, DNS change or data deletion is needed. If only intake activation
fails later, rebuild with the explicit disabled configuration (empty endpoint/key,
PDF false) to restore the existing honest contact state.
