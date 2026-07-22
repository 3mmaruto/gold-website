# Codex execution prompt — Round 5

Work inside:

`C:\Users\Alrefai\OneDrive\Desktop\gold_group\gold-website`

Continue on the existing local branch:

`improve/content-visual-navigation`

Do not discard or overwrite the uncommitted Round 4 work. Do not commit, push, merge, open a PR, deploy or modify Cloudflare.

First read `AGENTS.md` and every required context file. Then read:

`docs/ROUND5_CATALOG_CAPACITY_FILTER_HANDOFF.md`

Implement the complete Round 5 handoff:

- Change the homepage proof cell to the approved compact bilingual `8–50 kW` copy. This is an explicit current business decision and supersedes the Round 4 homepage wording. Keep existing verified model lists on the product cards unchanged.
- Fix the catalog category-switch bug: the URL, active state and data already update, but newly mounted cards remain at `opacity: 0` because of the generic reveal observer. Make dynamic catalog cards visible immediately without requiring refresh.
- Add the normalized bilingual `pipes-accessories` category.
- Add the high-quality hydronic accessories product using:
  `frontend-v2/public/media/products/generated/gold-hydronic-accessories-v1.png`
- Add the flexible corrugated stainless-steel pipes product using:
  `frontend-v2/public/media/products/generated/gold-corrugated-stainless-pipes-v1.png`
- Treat 15, 20 and 25 mm as pipe diameters, not wall thicknesses.
- Generate responsive 480/768/1200 WebP and AVIF variants while preserving the PNG originals.
- Keep pagination hidden because the catalog has eight entries and does not exceed the existing threshold.
- Preserve localized routes, metadata, canonical URLs, hreflang, Open Graph, JSON-LD, sitemap, robots, RTL and accessibility.

Verification is required:

- Run image optimization, React Router type generation and the production build with the compatible bundled Node runtime if needed.
- Test Arabic and English category changes without refresh and after direct refresh.
- Test `?category=pipes-accessories` and searches for both new products, including the diameter values.
- Test 390, 768, 1440 and 1920 px.
- Confirm both new cards load optimized AVIF/WebP, the homepage proof is aligned, pagination stays hidden, and console/network are clean.

Finish with a concise report of changed files, generated image variants, build/browser results and any decision still requiring approval. Stop before commit, push or deployment so the user can review locally.
