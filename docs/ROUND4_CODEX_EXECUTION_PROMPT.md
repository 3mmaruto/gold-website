# Codex execution prompt — Round 4

Work inside:

`C:\Users\Alrefai\OneDrive\Desktop\gold_group\gold-website`

The production site is already live from `main`. This is a new local improvement batch. Do not commit, push, merge, deploy or modify Cloudflare.

First:

1. Read `AGENTS.md` completely and every context file it requires.
2. Read `docs/ROUND4_CONTENT_VISUAL_NAV_HANDOFF.md` completely.
3. Inspect `git status`, the current branch, `origin/main` and `origin/redesign/static-frontend-upgrade`.
4. Confirm that the current tree matches `origin/main` apart from the uncommitted Round 4 handoff file and the two approved PNG assets.
5. Create and work on a new local branch named `improve/content-visual-navigation` from the current commit, preserving the uncommitted Round 4 files. If that branch already exists, inspect it and continue only if its state is consistent. Do not rewrite history.

Implement the complete Round 4 handoff in `frontend-v2/`:

- Correct the heat-pump distribution wording in Arabic and English. Remove `المشعات`, `radiators` and any implication of electric-resistance heating.
- Add the bilingual full-inverter energy-management section with the exact approved copy and a restrained non-numerical modulation visual.
- Add the bilingual underfloor-planning process section and use:
  `frontend-v2/public/media/solutions/gold-underfloor-planning-v1.png`
- Replace catalog card 01's primary R290 image with:
  `frontend-v2/public/media/products/generated/gold-heat-pump-r290-80c-dual-fan-v2.png`
- Keep card 01 as one full standalone image without an inset or collage.
- Never use the raw file named `heat pumb 80 degre.jpeg` as an R290 product; it visibly carries R32/Mitsubishi markings.
- Replace the homepage `8-22 kW` proof item with the approved verified-capacity wording. Do not list 32 or 50 kW as currently available or add them to product structured data.
- Refactor the header into the approved scalable information architecture: Home, accessible Solutions dropdown, Products, About, Contact and language switch. Use an accordion for Solutions inside the mobile menu.
- Keep all child destinations as crawlable links and preserve full RTL behavior.
- Fix the invisible no-results state on direct product query navigation. Prefer removing the generic reveal animation from the conditional empty state.
- Extend image optimization to scan `public/media/solutions` and produce 480/768/1200 WebP and AVIF variants for both new PNGs without deleting originals.
- Keep visible bilingual copy in the JSON content/data layer. Render optional solution blocks through the shared solution route.
- Preserve all 13 pre-rendered routes, localized metadata, canonical URLs, reciprocal hreflang, Open Graph, JSON-LD, sitemap and robots.

Verification is required:

- Run image optimization, type generation and the production build.
- Inspect the local production preview in a real browser.
- Test Arabic and English at 390, 768, 1440 and 1920 px.
- Test the desktop Solutions dropdown and mobile accordion with pointer, touch and keyboard, including `Escape`, outside click, focus order and active child state.
- Test direct navigation and refresh with `?q=`, `?category=` and a no-results query in both languages.
- Confirm the no-results box is visible, card 01 uses the new R290 image, the console/network are clean, and no horizontal overflow appears.

Finish by reporting:

- changed files;
- content and design decisions implemented;
- image variants generated;
- build and browser results;
- any remaining decisions that need user approval.

Stop before commit, push, PR, deployment or Cloudflare changes so the user can review the local result first.
