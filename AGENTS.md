# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

Framework-free, multi-page portfolio website deployed via GitHub Pages. Static HTML pages with shared CSS/JS assets, no build pipeline beyond CSS minification.

## Development Commands

```bash
# Install dependencies (only clean-css-cli needed)
npm install

# Local development server
python3 -m http.server 8000
# or
npx serve .

# Minify CSS after editing style-unified.css
npm run build:css
```

GitHub Pages auto-deploys from main branch. No bundler, no transpilation.

## Architecture

### File Structure
- **HTML Pages**: `index.html`, `about.html`, `portfolio.html`, `terminal.html`, `contact.html`, `resume.html`, `blog.html`, `reference.html`, `testimonials.html`
- **`assets/css/style-unified.css`**: Single unified stylesheet (edit this, then run `npm run build:css`)
- **`assets/js/main-enhanced.js`**: All JavaScript in one IIFE-wrapped file
- **`assets/data/`**: Static JSON data and CV PDF

### CSS Design System

Colors are defined as CSS custom properties in `:root` (light) and `.dark` (dark theme):

```css
:root {
  --bg: #eef6d8;      /* Primary background */
  --card: #f6ffe6;    /* Card backgrounds */
  --text: #132010;    /* Primary text */
  --muted: #52614b;   /* Secondary text */
  --green2: #B7D759;  /* Primary accent */
  --green4: #689929;  /* Secondary accent */
}
```

**Always use CSS variables instead of hardcoding colors.** Responsive breakpoints: `1201px`, `1200px`, `768px`, `480px`.

### JavaScript Patterns

All JS is wrapped in an IIFE with `DOMContentLoaded`:

```javascript
(function() {
  "use strict";
  document.addEventListener("DOMContentLoaded", function() {
    safeInit(initTheme, 'initTheme');
    safeInit(initPortfolioFilter, 'initPortfolioFilter');
    // Add new init functions here
  });
  // Function definitions follow
})();
```

**`safeInit()` pattern**: All feature initialization is wrapped in try/catch to prevent one component's failure from breaking the page:

```javascript
function safeInit(fn, name) {
  try { fn(); }
  catch (e) { console.error("Error in " + name + ":", e); }
}
```

**DOM targeting**: Use `data-*` attributes for JS hooks, not class selectors:

```javascript
// Correct
document.querySelector('[data-terminal-root]');
document.getElementById('themeToggle');

// Avoid - use classes for styling only
document.querySelector('.terminal-root');
```

**Key init functions**: `initTheme`, `initReveal`, `initPortfolioFilter`, `initTerminal`, `initContactForm`, `initMobileMenu`, `initGithubStatus`, `initGrimoireData`

### localStorage Keys

- `chriz_theme`: `'light'` or `'dark'` - persisted theme preference

### HTML Page Template

Every page follows this structure:
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`)
- `.container` wrapper for consistent max-width/padding
- Open Graph meta tags for social sharing
- Link to `style-unified.min.css` and `main-enhanced.js`
- Structured data (JSON-LD) where applicable

### Adding a New Page

1. Create `newpage.html` with semantic structure and meta tags
2. Link shared CSS/JS assets
3. Add page-specific init function to `main-enhanced.js`
4. Register with `safeInit()` in the DOMContentLoaded handler
5. Add navigation link to the nav menu in all existing pages

### External Integrations

- **Supabase**: Contact form backend (`contact.html`) - browser-exposed config is intentionally public
- **GitHub API**: Stats fetched client-side in `initGithubStats()` and `initGrimoireData()`
- **GitHub Status API**: System status indicator via `initGithubStatus()`

## Commit Convention

Use Conventional Commits: `feat:`, `fix:`, `chore:` prefixes with imperative subjects (e.g., `fix: preserve terminal scroll position`).

## Manual Testing

No automated test suite exists. After changes, verify:
- All pages load at desktop and mobile widths
- Theme toggle persists across page loads
- Terminal commands work (`terminal.html`)
- Portfolio filter buttons work (`portfolio.html`)
- Contact form submits (`contact.html`)
- Browser console is error-free
