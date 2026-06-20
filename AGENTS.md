# Repository Guidelines

## Project Structure & Module Organization

This repository is a framework-free, multi-page portfolio deployed through GitHub Pages. Top-level HTML files define individual routes: `index.html`, `about.html`, `portfolio.html`, `terminal.html`, `contact.html`, and related pages. Shared resources live under `assets/`:

- `assets/css/style-unified.css` is the editable stylesheet; the `.min.css` file is its generated production copy.
- `assets/js/main-enhanced.js` contains shared ES6+ behavior; keep its minified counterpart synchronized when JavaScript changes.
- `assets/img/`, `assets/font/`, and `assets/data/` contain images, fonts, and the downloadable CV.
- `robots.txt` and `sitemap.xml` control search-engine discovery.

There is currently no dedicated test directory.

## Build, Test, and Development Commands

Install the single build dependency with `npm install`. Useful commands are:

- `python3 -m http.server 8000` — serve the site locally at `http://localhost:8000`.
- `npm run build:css` — regenerate `assets/css/style-unified.min.css` with CleanCSS.
- `npm test` — currently a placeholder that exits with an error; do not treat it as a validation suite.

GitHub Pages publishes changes from the main branch; no application bundle is required.

## Coding Style & Naming Conventions

Use semantic HTML5 and preserve the shared page shell, navigation, metadata, and accessibility attributes across pages. Follow existing two-space indentation in HTML, CSS, and JavaScript. Use kebab-case for CSS classes and asset filenames, camelCase for JavaScript variables/functions, and descriptive initializer names such as `initNavigation`. Keep JavaScript framework-free, component initialization guarded, and browser-compatible. Define reusable colors and spacing as CSS custom properties rather than duplicating literals.

## Testing Guidelines

Perform manual checks after every change. Visit all affected pages at desktop and mobile widths, test navigation, theme persistence, keyboard focus, forms, filters, and terminal interactions. Check the browser console for errors and verify image, font, and internal-link paths. When changing shared CSS or JavaScript, smoke-test at least `index.html`, `portfolio.html`, `terminal.html`, and `contact.html`.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit prefixes, especially `feat:`, `fix:`, and `chore:`. Write concise, imperative subjects, for example `fix: preserve terminal scroll position`. Keep commits focused. Pull requests should summarize user-visible changes, list manual verification performed, link relevant issues, and include before/after screenshots for visual or responsive updates. Never commit secrets or private Supabase credentials; browser-exposed configuration must be intentionally public and restricted.
