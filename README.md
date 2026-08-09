# Gold Group bilingual website

Production marketing website for GOLD / Gold Group, built with React Router framework mode and statically pre-rendered for GitHub Pages.

Current stable release: `v1.0.0` (2026-08-09). The release establishes the first formally versioned production baseline for future maintenance and content expansion.

## Application

The only production application is `frontend-v2/`. It provides 23 pre-rendered routes: the language entry page plus 11 Arabic RTL and 11 English LTR pages. These include the corporate pages, solution guides, product catalog, four model-specific product profiles, localized metadata, canonical and `hreflang` links, JSON-LD, responsive AVIF/WebP media, `sitemap.xml`, and `robots.txt`.

The root `/` is the language-selection and `x-default` page. Localized pages live under `/ar/` and `/en/`.

## Local development

Node.js 22.22.0 or newer is required.

```powershell
cd frontend-v2
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/`.

## Production checks

```powershell
cd frontend-v2
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173
```

The static deploy artifact is generated at `frontend-v2/build/client/`. The GitHub Pages workflow runs from `main` and deploys that directory.

## Project context

Read `AGENTS.md` first. Architecture, verified claims, content, SEO decisions, and deployment notes are maintained under `docs/`.
