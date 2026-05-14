# Copilot Instructions for chriz-3656.github.io

This is a static multi-page portfolio website with no build pipeline or testing framework. All content is frontend-only, deployed via GitHub Pages.

## Quick Reference

**Local Development:**
- Python: `python -m http.server 8000`
- Node.js: `npx serve .`
- No npm scripts configured; no linting, building, or testing infrastructure

**Deployment:**
- Push to main branch → automatically deployed to `https://chriz-3656.github.io`
- GitHub Pages handles all hosting

## Architecture

### Core Files
- **`assets/css/style-unified.css`** - The single, unified stylesheet driving the entire design system
- **`assets/js/main-enhanced.js`** - All JavaScript logic; no modules, all functions in one file
- **HTML Pages** - Independent multi-page structure (`index.html`, `about.html`, `portfolio.html`, etc.)

### Key Design System
The CSS uses a root-level custom properties design system defined in `style-unified.css`:
```css
:root {
  --bg: #060606;           /* Primary background */
  --panel: rgba(10, 10, 10, 0.86);
  --neon: #00FF55;         /* Primary accent (cyberpunk green) */
  --neon-dim: #00C048;     /* Secondary accent */
  --muted: #9AA0A6;        /* Text */
  --accent: #FFC857;       /* Highlight */
  --error: #FF4D4F;        /* Error states */
  --success: #00C048;      /* Success states */
}
```
**Always use CSS variables instead of hardcoding colors.** The design is built on this system.

### Responsive Design
Breakpoints are at: `1201px`, `1200px`, `768px`, `480px`. Use mobile-first CSS media queries with these breakpoints.

## JavaScript Conventions

### Structure
All JavaScript is wrapped in an IIFE (Immediately Invoked Function Expression):
```javascript
(function() {
  "use strict";
  document.addEventListener("DOMContentLoaded", function() {
    // Initialization functions called here
  });
  // Function definitions follow
})();
```

### DOM Targeting
Use `data-*` attributes for JavaScript hooks, NOT class selectors:
```javascript
// ✓ Good
document.querySelector('[data-nav-toggle]');
document.getElementById('themeToggle');

// ✗ Avoid
document.querySelector('.nav-toggle'); // Use for styling only
```

### Modular Initialization Pattern
The main script initializes features using a `safeInit()` pattern:
```javascript
function safeInit(fn, name) {
  try {
    fn();
  } catch (e) {
    console.error("Error in " + name + ":", e);
  }
}

// In DOMContentLoaded:
safeInit(initTheme, 'initTheme');
safeInit(initPortfolioFilter, 'initPortfolioFilter');
```

Key initialization functions (add new ones following this pattern):
- `initTheme()` - Theme toggle (light/dark) with localStorage persistence
- `initReveal()` - Reveal animations on scroll
- `initPortfolioFilter()` - Client-side project filtering by category
- `initTerminal()` - Terminal emulator interface
- `initContactForm()` - Supabase form submission
- `initMobileMenu()` - Mobile navigation toggle
- `initGithubStatus()` - Fetch GitHub status indicator

### Common Patterns

**localStorage Usage:**
```javascript
// Reading
localStorage.getItem('chriz_theme'); // Returns 'light' or 'dark'

// Writing
localStorage.setItem('chriz_theme', 'dark');
```

**classList Manipulation:**
```javascript
element.classList.add('is-open');
element.classList.toggle('dark');
element.classList.contains('is-visible');
```

**Event Listeners:**
```javascript
button.addEventListener('click', () => {
  // Handle click
});
```

## HTML Conventions

### Semantic Structure
Use proper semantic HTML tags:
```html
<header>           <!-- Page header -->
<main>             <!-- Main content -->
<section>          <!-- Content sections -->
<article>          <!-- Content articles -->
<footer>           <!-- Page footer -->
```

### Shell Container Pattern
Wrap page content in a `.site-shell` div for consistent width and padding:
```html
<main class="site-shell">
  <section>...</section>
</main>
```

### SEO & Meta Tags
Every page includes:
- `<title>` tag
- Open Graph meta tags: `og:title`, `og:description`, `og:image`, `og:url`
- Standard meta tags: `description`, `viewport`, `charset`
- Structured data where relevant

Ensure all new pages follow this pattern.

## Supabase Integration

The contact form in `contact.html` uses Supabase for backend handling. When modifying the contact form:
1. Do NOT hardcode credentials in HTML
2. Ensure form validation happens before submission
3. Handle both success and error responses
4. Display user feedback via toast notifications

## Performance Considerations

The site prioritizes performance:
- **No frameworks** - Vanilla JS only
- **Lazy loading** - Images use lazy loading attributes
- **Minified assets** - Both CSS and JS have `.min` versions
- **Efficient fonts** - Custom Japan Ramen font; Google Fonts via efficient loading
- **CSS animations** - Use GPU-accelerated transforms where possible

When adding new features, keep bundle size in mind. Test locally to ensure the site loads quickly.

## Common Workflows

### Adding a New Page
1. Create `newpage.html` with proper semantic structure
2. Include all necessary meta tags and Open Graph tags
3. Link to `assets/css/style-unified.css` and `assets/js/main-enhanced.js`
4. Add any page-specific initialization function to the IIFE in `main-enhanced.js`
5. Call new init function with `safeInit()` in the DOMContentLoaded handler

### Modifying the Design
1. Update CSS variables in `:root` in `style-unified.css`
2. All colors, fonts, and spacing should reference these variables
3. Test across breakpoints using browser DevTools

### Adding Interactivity
1. Create a new initialization function in `main-enhanced.js`
2. Use `data-*` attributes for DOM targeting
3. Register the function with `safeInit()` in DOMContentLoaded
4. Handle errors gracefully

### Updating Assets
- Images go in `assets/img/` (use webp where possible for performance)
- Fonts go in `assets/font/`
- Data (portfolios, testimonials) goes in `assets/data/`

## External Dependencies

- **Google Fonts** - Inter, Zen Kaku Gothic New (loaded via `<link>`)
- **Supabase** - For contact form backend
- **GitHub Status API** - Fetched in `initGithubStatus()` to show system status

All external resources use resource hints (`preconnect`, `prefetch`) to optimize loading.

## Debugging Tips

- Check browser console for initialization errors (each init function logs errors)
- Use browser DevTools to inspect localStorage: `localStorage.getItem('chriz_theme')`
- Test theme toggle by opening DevTools console and running: `document.body.classList.toggle('dark')`
- Verify Supabase connection in contact form by checking Network tab in DevTools
