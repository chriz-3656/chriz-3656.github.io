# GEMINI.md

## Project Overview
A modern, responsive portfolio website for **Chris Mon Saji**, a Cyber Security student and Full-Stack Developer. The site features a Cyberpunk/Terminal aesthetic with neon accents and interactive components. It is a static multi-page application built with performance and accessibility in mind.

### Core Technologies
- **Frontend**: HTML5, CSS3 (Vanilla), Vanilla JavaScript (ES6+)
- **Fonts**: Japan Ramen (Custom), Inter, Zen Kaku Gothic New (Google Fonts)
- **Backend/Services**: Supabase (Contact Form), GitHub Pages (Hosting)
- **Architecture**: Multi-page static site with clean URLs and shared assets

## Building and Running
As a static website, it does not require a complex build process.

### Local Development
- **Python**: `python -m http.server 8000`
- **Node.js**: `npx serve .`
- **Manual**: Open `index.html` directly in a browser (though some features like Supabase or absolute paths might require a server context).

### Build Scripts
- **Minify CSS**: `npm run build:css` (uses `clean-css-cli`)

### Deployment
- Hosted via **GitHub Pages**. Deployment is handled by pushing to the main branch.

## Development Conventions

### JavaScript (Vanilla ES6+)
- **Modular Initialization**: Scripts are wrapped in an IIFE and use a `DOMContentLoaded` listener to call specific initialization functions (e.g., `initNavigation`, `initTerminal`).
- **Safe Initialization**: Uses a `safeInit` helper to prevent errors in one component from breaking the entire page.
- **No Frameworks**: Strict adherence to Vanilla JS to maintain high performance and low overhead.
- **External APIs**: Integrates with GitHub Status API for real-time system status.

### CSS (Custom Properties & Modern Layouts)
- **Design System**: Driven by CSS variables defined in `:root` and `.dark` in `assets/css/style-unified.css`.
- **Layout**: Utilizes CSS Grid and Flexbox for responsive design.
- **Theming**: Supports Light and Dark modes using CSS variables and a body class toggle.
- **Aesthetic**: Cyberpunk-themed with scanlines, glow effects, and terminal-inspired typography.

### HTML Structure
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<section>`, and `<article>` tags.
- **Shell Pattern**: Pages use a `.container` (or similar) for consistent width and padding.
- **SEO & Social**: Extensive meta tags for SEO and Open Graph sharing.

## Directory Structure
- `index.html`: Main landing page (accessible at `/`).
- `about.html`: About section (accessible at `/about`).
- `portfolio.html`: Project gallery with category filtering (accessible at `/portfolio`).
- `blog.html`: Blog or news section (accessible at `/blog`).
- `terminal.html`: Interactive terminal-themed experience (accessible at `/terminal`).
- `resume.html`: Professional resume page (accessible at `/resume`).
- `contact.html`: Contact form integrated with Supabase (accessible at `/contact`).
- `reference.html`: Reference or links page (accessible at `/reference`).
- `testimonials.html`: Client or peer feedback (accessible at `/testimonials`).
- `assets/css/style-unified.css`: The primary, unified stylesheet.
- `assets/js/main-enhanced.js`: The main logic for interactive elements.
- `assets/img/`: Optimized images and favicons.
- `assets/data/`: Static data files like `cv.pdf`.

## Key Components
- **Theme Toggle**: Switch between light and dark modes with local storage persistence.
- **Reveal Animations**: Scroll-triggered animations for content entry.
- **Portfolio Filter**: Client-side filtering of project cards.
- **GitHub Status**: Real-time monitoring of GitHub's operational status.
- **Terminal Emulator**: A visual terminal interface found in `terminal.html`.
- **Supabase Integration**: Used in `contact.html` for handling form submissions.
