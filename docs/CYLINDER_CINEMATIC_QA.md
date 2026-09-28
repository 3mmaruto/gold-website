# Cylinder cinematic refresh — QA, 2026-09-28

Scope: website cylinder route only, Arabic and English. ERP, Lab, visitor identity and intake activation are unchanged. Publication is user-authorized through a reviewed PR.

## Accepted locally

- Four new studio images; technical tables still limited to the documented 120/200 L models. Larger capacities remain a list only.
- Three annotated illustrations with six readable HTML notes. Desktop text sits outside the image; narrow layouts put it below the image with dedicated leader paths.
- Corrected a generated cutaway's extra ports/waterline before selection. Corrected the jacket leader target, normalized SVG drawing behaviour and isolated numeric ranges from Arabic units during visual review.
- Production static build passed; all 25 routes returned HTTP 200 locally. Cylinder integration checker verified bilingual metadata, model scope, privacy boundaries and 180 referenced local image assets.
- 5/5 cylinder tests passed (real React mount + SSR, observer lifecycle, reduced-motion/unsupported fallback, original dimensions, unit conversion/model scope).
- Existing guest-intake regression suite: 29/29 passed. Route type generation and `git diff --check` passed. Production dependency audit: zero vulnerabilities.
- Chrome review: Arabic 360/390/768/1440 px; English 390/768/1440 px. No page-level horizontal overflow in sampled states; no annotation/image overlap; four product images loaded. Header and language switch retained.
- Keyboard Enter opens the material details with visible focus. Emulated reduced motion leaves labels fully visible and disables their animation. No console warnings/errors observed in the local accepted flow.
- Viewports are desktop Chrome emulation, not a new physical-phone or screen-reader certification. No claim of full WCAG conformance.

Evidence is kept outside Git in the local `outputs/cylinder-cinematic-20260928` folder. Representative files: `before.png`, `local-ar-360.png`, `local-en-390.png`, `local-ar-768.png`, `local-en-768.png`, `local-en-1440.png`, `local-ar-1440-final.png`.

## Release checks

PR CI, main deployment and live Chrome verification must be checked after commit; local success alone is not a deployment claim. Preserve the disabled intake release setting. Recovery is a normal revert of this scoped PR to restore the previous cylinder page, without changing ERP or cloud configuration.

Asset provenance and final prompts: [CYLINDER_CINEMATIC_MEDIA.md](CYLINDER_CINEMATIC_MEDIA.md).
