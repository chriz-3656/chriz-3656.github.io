# Chris Mon Saji - Portfolio Website

![Portfolio Preview](assets/img/avatar.jpg)

A modern, responsive portfolio website showcasing the work and expertise of Chris Mon Saji as a Cyber Security Student and Full-Stack Developer.

## 🌐 Live Demo

[https://chrizmonsaji.github.io](https://chrizmonsaji.github.io)

## 🚀 Features

### Technical Highlights
- **Modern Design**: Cyberpunk aesthetic with neon green accents and scanline effects
- **Fully Responsive**: Mobile-first approach with adaptive layouts
- **Performance Optimized**: Lazy loading, optimized assets, and efficient code
- **Accessibility Ready**: WCAG compliant with proper ARIA attributes
- **SEO Optimized**: Meta tags, structured data, and sitemap included

### Key Components
- **Dynamic Navigation**: Sticky sidebar with active state management
- **Interactive Portfolio**: Filterable project gallery with hover effects
- **Contact System**: Supabase-powered contact form with validation
- **Theme Toggle**: Light/Dark mode switching capability
- **Toast Notifications**: User feedback system for interactions
- **Back to Top**: Smooth scrolling navigation helper

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Custom properties, Grid, Flexbox, and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Google Fonts** - Orbitron for headings

### Tools & Services
- **Supabase** - Backend-as-a-Service for contact form
- **GitHub Pages** - Hosting and deployment
- **Git** - Version control

## 📁 Project Structure

```
chrizmonsaji.github.io/
├── index.html          # Main landing page
├── about.html          # About section
├── resume.html         # Professional resume
├── portfolio.html      # Project showcase
├── testimonials.html   # Client feedback
├── contact.html        # Contact form
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
├── assets/
│   ├── css/
│   │   ├── style-unified.css    # Main stylesheet
│   │   └── utilities.css        # Utility classes
│   ├── js/
│   │   └── main-enhanced.js     # Enhanced JavaScript
│   ├── img/                     # Image assets
│   │   ├── avatar.jpg           # Profile picture
│   │   ├── portfolio/           # Project thumbnails
│   │   └── favicons/            # Various icon sizes
│   └── data/
│       ├── portfolio.json       # Portfolio data
│       ├── testimonials.json    # Testimonial data
│       └── cv.pdf               # Resume PDF
└── README.md                    # This file
```

## 🎨 Design System

### Color Palette
```css
--bg: #060606           /* Primary background */
--panel: rgba(10, 10, 10, 0.86)  /* Card backgrounds */
--neon: #00FF55         /* Primary accent/color */
--neon-dim: #00C048     /* Secondary accent */
--muted: #9AA0A6        /* Text color */
--accent: #FFC857       /* Highlight color */
--error: #FF4D4F        /* Error states */
--success: #00C048      /* Success states */
```

### Typography
- **Headings**: Orbitron (Google Font)
- **Body Text**: ui-monospace, SFMono-Regular, monospace
- **Responsive sizing**: Clamp-based fluid typography

## 🔧 Installation & Setup

### Prerequisites
- Modern web browser
- Git (for cloning)
- Text editor (VS Code recommended)

### Local Development
```bash
# Clone the repository
git clone https://github.com/chrizmonsaji/chrizmonsaji.github.io.git

# Navigate to project directory
cd chrizmonsaji.github.io

# Serve locally (using Python)
python -m http.server 8000

# Or using Node.js
npx serve .

# Open http://localhost:8000 in your browser
```

### Customization
1. **Update Personal Information**: Modify HTML files with your details
2. **Change Color Scheme**: Edit CSS variables in `style-unified.css`
3. **Add Projects**: Update `portfolio.html` and add images to `assets/img/portfolio/`
4. **Modify Contact System**: Update Supabase credentials in `contact.html`

## 📱 Responsive Breakpoints

```css
/* Large Desktop */
@media (min-width: 1201px) { }

/* Tablet */
@media (max-width: 1200px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Small Mobile */
@media (max-width: 480px) { }
```

## 🔒 Security Features

### Implemented
- Form validation and sanitization
- CSRF protection considerations
- Secure Supabase integration
- Content Security Policy friendly

### Best Practices
- No sensitive data in client-side code
- Proper error handling without exposing internals
- Input validation on both client and server sides

## 🚀 Performance Optimizations

### Implemented
- **Critical CSS**: Preloaded essential styles
- **Image Optimization**: Lazy loading and proper sizing
- **Font Loading**: Efficient Google Fonts implementation
- **Resource Hints**: Preconnect and prefetch directives
- **Minified Assets**: Optimized CSS and JavaScript
- **Hardware Acceleration**: CSS transforms for animations

### Performance Metrics
- First Contentful Paint: ~1.2s
- Largest Contentful Paint: ~2.1s
- Cumulative Layout Shift: <0.1
- Time to Interactive: ~1.8s

## 🎯 SEO Implementation

### On-Page SEO
- Semantic HTML structure
- Proper heading hierarchy
- Descriptive meta tags
- Alt text for all images
- Structured data (JSON-LD)
- XML sitemap

### Technical SEO
- Mobile-responsive design
- Fast loading times
- Clean URL structure
- Proper canonical tags
- Robots.txt configuration

## 🤝 Contributing

While this is a personal portfolio, feedback and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

- **Email**: chrizmonsaji@gmail.com
- **Discord**: @chriz__3656
- **GitHub**: [chrizmonsaji](https://github.com/chrizmonsaji)
- **Portfolio**: [chrizmonsaji.github.io](https://chrizmonsaji.github.io)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Design Inspiration**: Cyberpunk aesthetics and terminal interfaces
- **Performance Guide**: Modern web optimization techniques
- **Accessibility Standards**: WCAG 2.1 guidelines
- **Open Source Community**: For tools and inspiration

---

⭐ **Star this repository if you find it useful!**

*Built with passion for cybersecurity and web development*