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
    safeInit(initGrimoireData, 'initGrimoireData');
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

  async function initGrimoireData() {
    const username = 'chriz-3656';
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    
    try {
      // Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error('Failed to fetch user');
      const user = await userRes.json();
      
      // Fetch repositories
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars&order=desc`);
      if (!reposRes.ok) throw new Error('Failed to fetch repos');
      const repos = await reposRes.json();
      
      // Fetch recent events
      const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=30`);
      if (!eventsRes.ok) throw new Error('Failed to fetch events');
      const events = await eventsRes.json();
      
      // Hide loading, show data
      loadingState.style.display = 'none';
      
      // Display user profile
      displayUserProfile(user);
      
      // Display repositories
      displayRepositories(repos);
      
      // Display languages
      await displayLanguages(repos);
      
      // Display recent activity
      displayActivity(events);
      
    } catch (e) {
      console.error('Grimoire error:', e);
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
      document.getElementById('errorMessage').textContent = e.message;
    }
  }

  function displayUserProfile(user) {
    const section = document.getElementById('userProfileSection');
    document.getElementById('userRepos').textContent = user.public_repos;
    document.getElementById('userFollowers').textContent = user.followers;
    document.getElementById('userFollowing').textContent = user.following;
    document.getElementById('userGists').textContent = user.public_gists;
    section.style.display = 'block';
  }

  function displayRepositories(repos) {
    const reposList = document.getElementById('reposList');
    reposList.innerHTML = '';
    
    repos.slice(0, 12).forEach(repo => {
      const card = document.createElement('article');
      card.className = 'card project-card reveal';
      
      const lang = repo.language || 'CODE';
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      
      card.innerHTML = `
        <div class="project-image" style="font-size: 2rem;">${getLanguageEmoji(repo.language)}</div>
        <div class="project-content">
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description'}</p>
          <div style="display: flex; gap: 10px; margin-top: 10px; font-size: 0.9rem; font-weight: 700;">
            <span>⭐ ${stars}</span>
            <span>🍴 ${forks}</span>
            ${repo.language ? `<span>${repo.language}</span>` : ''}
          </div>
          <a href="${repo.html_url}" target="_blank" class="btn secondary" style="margin-top:15px; padding:10px 18px; font-size:0.9rem;">View Repo →</a>
        </div>
      `;
      
      reposList.appendChild(card);
    });
    
    document.getElementById('reposSection').style.display = 'block';
  }

  async function displayLanguages(repos) {
    const languageMap = {};
    
    for (const repo of repos.slice(0, 10)) {
      if (!repo.languages_url) continue;
      try {
        const langRes = await fetch(repo.languages_url);
        if (!langRes.ok) continue;
        const langs = await langRes.json();
        
        for (const [lang, bytes] of Object.entries(langs)) {
          languageMap[lang] = (languageMap[lang] || 0) + bytes;
        }
      } catch (e) {
        console.warn('Could not fetch languages for', repo.name);
      }
    }
    
    const sorted = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    
    const langList = document.getElementById('languagesList');
    langList.innerHTML = '';
    
    sorted.forEach(([lang, bytes]) => {
      const card = document.createElement('div');
      card.className = 'stat reveal';
      card.innerHTML = `
        <h2 style="font-size: 2rem;">${getLanguageEmoji(lang)}</h2>
        <p>${lang}</p>
      `;
      langList.appendChild(card);
    });
    
    if (sorted.length > 0) {
      document.getElementById('languagesSection').style.display = 'block';
    }
  }

  function displayActivity(events) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    const uniqueEvents = [];
    const seen = new Set();
    
    events.forEach(event => {
      const key = `${event.repo.name}-${event.type}`;
      if (!seen.has(key) && uniqueEvents.length < 10) {
        seen.add(key);
        uniqueEvents.push(event);
      }
    });
    
    uniqueEvents.forEach(event => {
      const item = document.createElement('div');
      item.className = 'timeline-item reveal';
      
      const date = new Date(event.created_at);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      item.innerHTML = `
        <small>${dateStr}</small>
        <h3>${getEventEmoji(event.type)} ${event.type.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
        <p>${event.repo.name}</p>
      `;
      
      activityList.appendChild(item);
    });
    
    if (uniqueEvents.length > 0) {
      document.getElementById('activitySection').style.display = 'block';
    }
  }

  function getLanguageEmoji(lang) {
    const emojiMap = {
      'JavaScript': '📜', 'Python': '🐍', 'Java': '☕', 'C++': '⚙️',
      'TypeScript': '📘', 'Go': '🐹', 'Rust': '🦀', 'HTML': '🌐',
      'CSS': '🎨', 'PHP': '🐘', 'Ruby': '💎', 'Swift': '🍎',
      'Kotlin': '🎯', 'Shell': '🔧', 'SQL': '🗄️', 'Vue': '💚',
      'React': '⚛️', 'Angular': '🅰️', 'Dockerfile': '🐳', 'JSON': '📦'
    };
    return emojiMap[lang] || '💻';
  }

  function getEventEmoji(eventType) {
    const emojiMap = {
      'PushEvent': '📤', 'CreateEvent': '✨', 'DeleteEvent': '🗑️',
      'PullRequestEvent': '📝', 'IssuesEvent': '⚠️', 'ForkEvent': '🍴',
      'WatchEvent': '👀', 'ReleaseEvent': '🎉'
    };
    return emojiMap[eventType] || '🔔';
  }

})();
