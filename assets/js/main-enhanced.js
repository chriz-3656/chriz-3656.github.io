// Enhanced Portfolio JavaScript with Modern Features and Better Error Handling
// IIFE to prevent global scope pollution
(function() {
    'use strict';

    // Global components registry
    const components = {
        toastContainer: null,
        backToTop: null
    };

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // Initialize UI components first
            initComponents();
            
            // Initialize all components
            initTypewriter();
            initNavigation();
            initPortfolioFilter();
            initTerminalWidget();
            initTooltips();
            initScrollEffects();
            initFormValidation();
            initLazyLoading();
            initThemeToggle();
            initBackToTop();
            
            // Initialize Supabase contact form if on contact page
            if (document.getElementById('contactForm')) {
                initSupabaseContactForm();
            }
            
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            showToast('Initialization error occurred', 'error');
        }
    });

    // Initialize UI Components
    function initComponents() {
        // Create toast container
        components.toastContainer = document.createElement('div');
        components.toastContainer.className = 'toast-container';
        document.body.appendChild(components.toastContainer);
        
        // Create back to top button
        components.backToTop = document.createElement('button');
        components.backToTop.className = 'back-to-top';
        components.backToTop.innerHTML = '↑';
        components.backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(components.backToTop);
    }

    // Toast notification system
    function showToast(message, type = 'info', duration = 5000) {
        if (!components.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        
        components.toastContainer.appendChild(toast);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.parentNode.removeChild(toast);
                        }
                    }, 300);
                }
            }, duration);
        }
        
        return toast;
    }

    // Enhanced Typewriter Effect for Terminal Text
    function initTypewriter() {
        const terminalText = document.getElementById('terminal-text');
        if (!terminalText) return;

        const texts = [
            'ready to handle your next project',
            'building secure applications',
            'exploring cybersecurity research',
            'developing innovative solutions'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const text = texts[textIndex];
            
            if (isDeleting) {
                currentText = text.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = text.substring(0, charIndex + 1);
                charIndex++;
            }

            terminalText.textContent = currentText;

            let typeSpeed = 100;
            if (isDeleting) typeSpeed = 50;

            if (!isDeleting && currentText === text) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }

    // Enhanced Navigation with Better Active State Management
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        if (!navLinks.length) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = (href === currentPath) || 
                           (currentPath === '' && href === 'index.html') ||
                           (currentPath === 'index.html' && href === 'index.html');
            
            if (isActive) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Enhanced Portfolio Filtering with Better UX
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (!filterBtns.length || !portfolioItems.length) return;

        // Add keyboard navigation support
        filterBtns.forEach((btn, index) => {
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextBtn = filterBtns[(index + 1) % filterBtns.length];
                    nextBtn.focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevBtn = filterBtns[(index - 1 + filterBtns.length) % filterBtns.length];
                    prevBtn.focus();
                }
            });
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button with animation
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                // Filter items with smooth transitions
                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const shouldShow = filter === 'all' || itemCategory === filter;
                    
                    if (shouldShow) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                showToast(`Showing ${filter} projects`, 'info', 2000);
            });
        });
    }

    // Enhanced Supabase Contact Form Handling
    async function initSupabaseContactForm() {
        const contactForm = document.getElementById('contactForm');
        const formFeedback = document.getElementById('formFeedback');
        
        if (!contactForm || !formFeedback) return;

        // Supabase configuration (consider moving to environment variables)
        const SUPABASE_URL = 'https://fzijfyqjrgpwvbsvgtcf.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWpmeXFqcmdwd3Zic3ZndGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTk2NjQsImV4cCI6MjA3NjQ3NTY2NH0.oWRCPA46ugAG4DfFW25gA-SrYbJNog0XuCvc8pSadNQ';

        let supabaseClient;
        
        try {
            // Dynamically load Supabase if not already loaded
            if (typeof window.supabase !== 'undefined') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } else {
                // Fallback: load from CDN
                await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js');
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            showToast('Service temporarily unavailable. Please try again later.', 'error');
            return;
        }

        function showFeedback(message, isSuccess) {
            const feedbackElement = document.createElement('div');
            feedbackElement.className = `form-response ${isSuccess ? 'success' : 'error'}`;
            feedbackElement.textContent = message;
            feedbackElement.setAttribute('role', 'alert');
            feedbackElement.setAttribute('aria-live', 'polite');
            
            // Remove existing feedback
            while (formFeedback.firstChild) {
                formFeedback.removeChild(formFeedback.firstChild);
            }
            
            formFeedback.appendChild(feedbackElement);
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide success messages
            if (isSuccess) {
                setTimeout(() => {
                    if (feedbackElement.parentNode) {
                        feedbackElement.parentNode.removeChild(feedbackElement);
                    }
                }, 5000);
            }
        }

        // Form submission handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();
            
            // Validate form data
            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable submit button during submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span><span>Sending...</span>';
            
            try {
                // Submit to Supabase
                const { data, error } = await supabaseClient
                    .from('contact_messages')
                    .insert([{ name, email, message }]);
                
                if (error) {
                    throw new Error(error.message);
                }
                
                showToast('Message sent successfully!', 'success');
                showFeedback('Thank you for your message! I\'ll get back to you soon.', true);
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showToast('Failed to send message. Please try again.', 'error');
                showFeedback('Sorry, there was an error sending your message. Please try again.', false);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Enhanced Terminal Widget with Interactive Features
    function initTerminalWidget() {
        const terminalWidgets = document.querySelectorAll('.terminal-widget');
        terminalWidgets.forEach(widget => {
            const terminalBody = widget.querySelector('.terminal-body');
            if (!terminalBody) return;
            
            // Add click interaction
            widget.addEventListener('click', function() {
                const newLine = document.createElement('div');
                newLine.className = 'terminal-line';
                newLine.textContent = '> command executed successfully';
                terminalBody.appendChild(newLine);
                
                // Auto-scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
                
                // Remove old lines to prevent overflow
                const lines = terminalBody.querySelectorAll('.terminal-line');
                if (lines.length > 10) {
                    lines[0].remove();
                }
                
                showToast('Terminal command executed', 'info', 1500);
            });
            
            // Add hover effect
            widget.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
            });
        });
    }

    // Enhanced Tooltips with Better Accessibility
    function initTooltips() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const label = link.querySelector('.nav-label');
            if (label && window.innerWidth <= 1200) {
                // Create tooltip for mobile/tablet
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = label.textContent;
                tooltip.setAttribute('role', 'tooltip');
                link.appendChild(tooltip);
                
                link.addEventListener('mouseenter', function() {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                });
                
                link.addEventListener('mouseleave', function() {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                });
            }
        });
    }

    // Enhanced Scroll Effects with Intersection Observer
    function initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }
            });
        }, observerOptions);

        // Observe elements that should fade in
        document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .hero-card, .section-title').forEach(el => {
            observer.observe(el);
        });
    }

    // Form Validation Enhancement
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                // Add real-time validation
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    // Clear error state on input
                    this.parentElement.classList.remove('has-error');
                });
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remove existing error messages
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Field-specific validation
        switch (fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
                
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                }
                break;
                
            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }
        
        if (!isValid) {
            field.parentElement.classList.add('has-error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.color = 'var(--error)';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '4px';
            field.parentElement.appendChild(errorElement);
        }
        
        return isValid;
    }

    // Lazy Loading Enhancement
    function initLazyLoading() {
        // Native lazy loading for images
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.3s ease';
            });
        });
        
        // Intersection Observer for custom lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Theme Toggle Feature
    function initThemeToggle() {
        // Check for saved theme preference or respect OS setting
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        setTheme(initialTheme);
        
        // Add theme toggle button (you can customize positioning)
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = '<span>🌙</span>';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--panel);
            border: 1px solid var(--neon);
            color: var(--neon);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 10000;
            transition: var(--transition);
            backdrop-filter: blur(10px);
        `;
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(`Switched to ${newTheme} theme`, 'info', 2000);
        });
        
        document.body.appendChild(themeToggle);
    }

    function setTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '<span>🌙</span>' : '<span>☀️</span>';
        }
    }

    // Back to Top Button
    function initBackToTop() {
        let isVisible = false;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300 && !isVisible) {
                components.backToTop.classList.add('visible');
                isVisible = true;
            } else if (scrollTop <= 300 && isVisible) {
                components.backToTop.classList.remove('visible');
                isVisible = false;
            }
        });
        
        components.backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Handle window resize for responsive adjustments
    window.addEventListener('resize', debounce(() => {
        initNavigation();
    }, 250));

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
            }, 0);
        });
    }

    // Expose showToast globally for other scripts
    window.showToast = showToast;

})();