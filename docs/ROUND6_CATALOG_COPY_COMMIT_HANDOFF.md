# Gold Group Round 6 — Copy polish, latest catalog and branch synchronization

## Approved changes

### Arabic accessories wording

Replace:

`دقة القلاوظ والتوصيلات`

with:

`دقة التصنيع وإحكام التوصيلات`

This is clearer for the Syrian audience and avoids a region-specific industrial term.

Use the matching English highlight:

`Manufacturing precision and secure connections`

### Downloadable PDF catalog

The user supplied the new source file:

`../gold/latest cataloge.pdf`

It has already been copied to the website's stable public download path:

`frontend-v2/public/catalog/catalog.pdf`

Verified properties of the new public file:

- 24 A4 pages.
- 69,039,462 bytes (about 65.84 MiB).
- optimized PDF with no encryption, forms or embedded JavaScript.
- SHA-256: `F951540202FF94C9E8D31F384B44186620ABEF1398B956788A0ED84D488328F3`
- visually reviewed as a complete 24-page contact sheet, including the cover, technical pages, accessories page and final contact page.

Keep the stable website URL:

`/catalog/catalog.pdf`

Do not commit the raw sibling source file from `../gold`; commit only the approved copy inside `frontend-v2/public/catalog/`.

The file is intentionally not loaded during normal page browsing. It is downloaded only when the user chooses a catalog link.

## Verification

- Confirm every catalog download link still points to `/catalog/catalog.pdf`.
- Run the production build and confirm the new 24-page PDF is copied to `build/client/catalog/catalog.pdf` with the same SHA-256.
- Open the local download URL in Chrome and confirm it returns HTTP 200 with `application/pdf` and the new file size.
- Recheck the Arabic and English accessories cards.
- Recheck Round 4 and Round 5 functionality already approved by the user.
- Confirm `git diff --check` and the production build succeed.

## Commit, PR, merge and deployment authorization

The user has visually approved the local Round 4 and Round 5 result and explicitly authorizes the complete protected publishing workflow for this batch: commits, feature-branch push, pull request, merge into `main`, and the automatic GitHub Pages deployment triggered from `main`.

Work only on:

`improve/content-visual-navigation`

Create intentional commits grouped by concern. A suitable structure is:

1. `feat: improve bilingual solutions and navigation`
2. `feat: expand the product catalog and fix filtering`
3. `chore: update the downloadable catalog and copy`

Inspect the actual diff and adjust grouping if necessary, but do not squash unrelated concerns into a misleading commit.

First push this branch to:

`origin/improve/content-visual-navigation`

Never push the feature-branch history directly over `main`, never force-push, and never rewrite shared history.

After the push:

- confirm the local branch and `origin/improve/content-visual-navigation` resolve to the same commit;
- open a ready-for-review PR from `improve/content-visual-navigation` into `main` with a complete summary and verification results;
- verify the PR is mergeable and wait for all available/required checks;
- if a check fails or a merge conflict exists, do not merge until the cause is resolved and checks pass;
- merge the PR with a normal merge commit so the intentional commits remain visible;
- do not delete the feature branch unless the user asks later;
- wait for the `main` GitHub Pages workflow to succeed and verify the live site serves the new result;
- fetch `origin`, update local `main` with a fast-forward-only pull, and confirm local `main` equals `origin/main`;
- confirm `git status` is clean;
- stop the local preview server that belongs to this workspace and verify port 4173 is no longer listening;
- report the created commit hashes, PR URL, merge commit, deployment run and final synchronized repository state.

Do not modify Cloudflare settings. The existing Cloudflare configuration should serve the newly deployed GitHub Pages build automatically.
