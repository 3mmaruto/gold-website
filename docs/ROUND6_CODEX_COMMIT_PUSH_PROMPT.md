# Codex execution prompt — Round 6 finalization

Work inside:

`C:\Users\Alrefai\OneDrive\Desktop\gold_group\gold-website`

Stay on:

`improve/content-visual-navigation`

The user has approved the current local Round 4 and Round 5 result. You are authorized in this task to complete the protected publishing workflow: create commits, push the feature branch, open a pull request into `main`, merge it after successful checks, wait for the automatic GitHub Pages deployment, and verify the live result. Do not modify Cloudflare.

First read `AGENTS.md` and all required context files. Then read:

`docs/ROUND6_CATALOG_COPY_COMMIT_HANDOFF.md`

Complete these final changes:

1. Replace the Arabic accessories highlight `دقة القلاوظ والتوصيلات` with `دقة التصنيع وإحكام التوصيلات`.
2. Use the matching English highlight `Manufacturing precision and secure connections`.
3. Verify that `frontend-v2/public/catalog/catalog.pdf` is the new approved 24-page catalog and that its SHA-256 is `F951540202FF94C9E8D31F384B44186620ABEF1398B956788A0ED84D488328F3`.
4. Keep every download link on the stable `/catalog/catalog.pdf` URL.

Run the complete final verification using the compatible bundled Node runtime where needed:

- image optimization;
- React Router type generation;
- production build;
- `git diff --check`;
- all 13 pre-rendered routes;
- Round 4 header/solutions behavior;
- Round 5 filters, search, new products and responsive behavior;
- Chrome console/network checks;
- the local PDF URL must return HTTP 200, `application/pdf`, the new file size, and the built PDF must have the same SHA-256 as the public source.

Then inspect the full diff and create clean commits grouped by concern. Prefer this structure when it matches the actual diff:

1. `feat: improve bilingual solutions and navigation`
2. `feat: expand the product catalog and fix filtering`
3. `chore: update the downloadable catalog and copy`

Include the Round 4/5/6 handoff and execution documents because they are the project's shared implementation memory. Never add the raw files from the sibling `../gold/` directory.

First push:

`improve/content-visual-navigation` -> `origin/improve/content-visual-navigation`

Use a normal push; never force-push or rewrite history. After pushing, confirm:

- local HEAD equals `origin/improve/content-visual-navigation`;
- the worktree is clean;
- the remote branch exists and contains all created commits.

Then:

1. Open a ready-for-review pull request from `improve/content-visual-navigation` into `main` using the connected GitHub app, or `gh` only if required.
2. Use a clear title such as `Improve bilingual content, navigation and product catalog` and include the implementation summary, filter root cause, catalog update and complete verification results in the PR body.
3. Confirm the PR base/head are exactly `main` <- `improve/content-visual-navigation` and that the PR contains only the intended Round 4/5/6 work.
4. Wait for all available and required PR checks. If checks fail or GitHub reports a merge conflict, do not merge until the problem is resolved and verification passes.
5. When the PR is mergeable and checks are successful (or no PR checks are configured and the already completed local verification remains successful), merge it with a normal merge commit. Do not squash, rebase, force-push or rewrite history.
6. Do not delete the feature branch.
7. Wait for the GitHub Pages workflow triggered from `main` to finish successfully. Inspect its result and verify the live Arabic and English pages, the two new products, category filtering, the new PDF response and a clean console/network. Do not change Cloudflare.
8. Fetch `origin`, switch local `main`, and update it only with `git pull --ff-only origin main`.
9. Confirm local `main` equals `origin/main`, the worktree is clean, and the feature branch remains available locally and remotely.
10. Stop only the local preview server belonging to this workspace and verify port 4173 is closed.

Report:

- changed files;
- build/browser/PDF results;
- commit hashes and messages;
- the remote branch URL and PR URL;
- the PR merge commit and successful deployment run;
- clean/synchronized repository status;
- confirmation that localhost was stopped.

Do not force-push, rewrite history, bypass failing checks, or change Cloudflare.
