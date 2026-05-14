(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    // Helper to safely run initialization functions
    function safeInit(fn, name) {
      try {
        fn();
      } catch (e) {
        console.error("Error in " + name + ":", e);
        // Fallback: If reveal fails, make sure content is visible
        if (name === 'initReveal') {
          document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        }
      }
    }

    safeInit(initTheme, 'initTheme');
    safeInit(initReveal, 'initReveal');
    safeInit(initPortfolioFilter, 'initPortfolioFilter');
    safeInit(initGithubStats, 'initGithubStats');
    safeInit(initTerminal, 'initTerminal');
    safeInit(initContactForm, 'initContactForm');
    safeInit(initMobileMenu, 'initMobileMenu');
    safeInit(initGithubStatus, 'initGithubStatus');
  });

  async function initGithubStatus() {
    const wrap = document.getElementById('githubStatus');
    if (!wrap) return;

    const dot = wrap.querySelector('.status-dot');
    const text = wrap.querySelector('.status-text');

    try {
      const res = await fetch('https://www.githubstatus.com/api/v2/status.json');
      const data = await res.json();
      
      if (data.status.indicator === 'none') {
        dot.classList.add('status-online');
        text.textContent = 'SYSTEMS OPERATIONAL';
      } else {
        dot.classList.add('status-offline');
        text.textContent = 'SYSTEMS DEGRADED';
      }
    } catch (e) {
      text.textContent = 'TELEMETRY OFFLINE';
    }
  }

  const MOON_SVG = '<svg viewBox="0 0 24 24" width="32" height="32"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>';
  const SUN_SVG = '<svg viewBox="0 0 24 24" width="32" height="32"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 11h2m16 0h2M12 2V4m0 16v2m-7.07-17.07l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    if (localStorage.getItem('chriz_theme') === 'dark') {
      document.body.classList.add('dark');
      toggle.innerHTML = SUN_SVG;
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      toggle.innerHTML = isDark ? SUN_SVG : MOON_SVG;
      localStorage.setItem('chriz_theme', isDark ? 'dark' : 'light');
    });
  }

  function initMobileMenu() {
    const menuBtn = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const closeBtn = document.getElementById('navMenuClose');
    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
      navMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }

    // Close menu on link click
    navMenu.querySelectorAll('.nav-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // Fallback if IntersectionObserver is missing
    if (!("IntersectionObserver" in window)) {
      items.forEach(function(item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px" // Using simplest possible value for maximum compatibility
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  function initPortfolioFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-category]");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        var filter = button.getAttribute("data-filter");
        buttons.forEach(function(other) {
          other.classList.remove("active");
        });
        button.classList.add("active");

        cards.forEach(function(card) {
          var matches = filter === "all" || card.getAttribute("data-category") === filter;
          card.style.display = matches ? "block" : "none";
        });
      });
    });
  }

  async function initGithubStats() {
    var reposValue = document.querySelector("[data-github-card='repos'] h2");
    var starsValue = document.querySelector("[data-github-card='stars'] h2");
    if (!reposValue && !starsValue) return;

    try {
      var res = await fetch("https://api.github.com/users/chriz-3656/repos?per_page=100");
      if (!res.ok) return;
      var repos = await res.json();
      var totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      if (reposValue) reposValue.textContent = repos.length + "+";
      if (starsValue) starsValue.textContent = totalStars;
    } catch (e) {
      console.warn("Stats error", e);
    }
  }

  function initTerminal() {
    var root = document.querySelector("[data-terminal-root]");
    var out = root ? root.querySelector("[data-terminal-output]") : null;
    var form = root ? root.querySelector("[data-terminal-form]") : null;
    var inp = form ? form.querySelector("input") : null;
    if (!out || !form || !inp) return;

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var cmd = inp.value.trim().toLowerCase();
      inp.value = "";
      var l = document.createElement("div");
      l.textContent = "> " + cmd;
      out.appendChild(l);

      if (cmd === "help") {
        var h = document.createElement("div");
        h.textContent = "Available: whoami, projects, contact, clear";
        out.appendChild(h);
      } else if (cmd === "clear") {
        out.innerHTML = "";
      }
      out.scrollTop = out.scrollHeight;
    });
  }

  async function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    // supabase logic preserved in background if needed
  }

})();
