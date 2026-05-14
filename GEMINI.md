# GEMINI.md

## Project Overview
A modern, responsive portfolio website for **Chris Mon Saji**, a Cyber Security student and Full-Stack Developer. The site features a Cyberpunk/Terminal aesthetic with neon accents and interactive components. It is a static multi-page application built with performance and accessibility in mind.

### Core Technologies
- **Frontend**: HTML5, CSS3 (Vanilla), Vanilla JavaScript (ES6+)
- **Fonts**: Japan Ramen (Custom), Inter, Zen Kaku Gothic New (Google Fonts)
- **Backend/Services**: Supabase (Contact Form), GitHub Pages (Hosting)
- **Architecture**: Multi-page static site with shared assets

## Building and Running
As a static website, it does not require a complex build process.

### Local Development
- **Python**: `python -m http.server 8000`
- **Node.js**: `npx serve .`
- **Manual**: Open `index.html` directly in a browser (though some features like Supabase or absolute paths might require a server context).

### Deployment
- Hosted via **GitHub Pages**. Deployment is handled by pushing to the main branch.

## Development Conventions

### JavaScript (Vanilla ES6+)
- **Modular Initialization**: Scripts are wrapped in an IIFE and use a `DOMContentLoaded` listener to call specific initialization functions (e.g., `initNavigation`, `initTerminal`).
- **DOM Targeting**: Use `data-` attributes for targeting elements in JavaScript (e.g., `[data-nav-toggle]`, `[data-intro]`) rather than styling classes.
- **No Frameworks**: Strict adherence to Vanilla JS to maintain high performance and low overhead.

### CSS (Custom Properties & Modern Layouts)
- **Design System**: Driven by CSS variables defined in `:root` in `assets/css/style-unified.css`.
- **Layout**: Utilizes CSS Grid and Flexbox for responsive design.
- **Naming**: Generally uses semantic class names (e.g., `.site-header`, `.nav-link`, `.project-card`).
- **Aesthetic**: Cyberpunk-themed with scanlines, glow effects (`--neon`), and terminal-inspired typography.

### HTML Structure
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<section>`, and `<article>` tags.
- **Shell Pattern**: Pages use a `.site-shell` container for consistent width and padding.
- **SEO & Social**: Extensive meta tags for SEO and Open Graph sharing.

## Directory Structure
- `index.html`: Main landing page.
- `portfolio.html`: Project gallery with category filtering.
- `terminal.html`: Interactive terminal-themed experience.
- `assets/css/style-unified.css`: The primary, unified stylesheet.
- `assets/js/main-enhanced.js`: The main logic for interactive elements.
- `assets/img/`: Optimized images and favicons.
- `assets/font/`: Local font assets.

## Key Components
- **Intro Splash**: A custom loading animation that shows once per session.
- **Navigation Toggle**: Mobile-responsive navigation menu with state management.
- **Portfolio Filter**: Client-side filtering of project cards based on categories.
- **Terminal Emulator**: A visual terminal interface found in `terminal.html`.
- **Supabase Integration**: Used in `contact.html` for handling form submissions without a custom backend.
