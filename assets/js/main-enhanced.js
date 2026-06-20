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
    safeInit(initSpotifyRefresh, 'initSpotifyRefresh');
    safeInit(initBackToTop, 'initBackToTop');
    safeInit(initActiveNavLink, 'initActiveNavLink');
  });

  function initSpotifyRefresh() {
    const spotifyImages = document.querySelectorAll("img[src*='spotify-github-profile.kittinanx.com']");
    if (!spotifyImages.length) return;

    setInterval(() => {
      spotifyImages.forEach(img => {
        let currentSrc = img.src;
        // Remove old timestamp if it exists
        currentSrc = currentSrc.replace(/&t=\d+/, '');
        // Append new timestamp
        img.src = currentSrc + '&t=' + new Date().getTime();
      });
    }, 15000); // Refresh every 15 seconds
  }

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

    // Trigger reveal for items already in view immediately
    function checkInitialView() {
      items.forEach(function(item) {
        var rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          item.classList.add("is-visible");
        }
      });
    }

    // Fallback if IntersectionObserver is missing
    if (!("IntersectionObserver" in window)) {
      checkInitialView();
      window.addEventListener("scroll", checkInitialView);
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
      threshold: 0.05,
      rootMargin: "50px"
    });

    items.forEach(function(item) {
      observer.observe(item);
    });

    // Handle dynamically added elements
    var dynamicObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element
            if (node.classList.contains('reveal')) {
              observer.observe(node);
            }
            node.querySelectorAll('.reveal').forEach(function(child) {
              observer.observe(child);
            });
          }
        });
      });
    });

    dynamicObserver.observe(document.body, { childList: true, subtree: true });

    // Safety timeout: ensure everything reveals after a few seconds if observer fails
    setTimeout(function() {
      items.forEach(function(item) {
        item.classList.add("is-visible");
      });
    }, 3000);
  }

  function initPortfolioFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-category]");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        var filter = button.getAttribute("data-filter");
        
        // Update active button
        buttons.forEach(function(other) {
          other.classList.remove("active");
        });
        button.classList.add("active");

        // Animate cards
        cards.forEach(function(card) {
          var matches = filter === "all" || card.getAttribute("data-category") === filter;
          
          if (matches) {
            card.style.display = "flex";
            card.classList.remove("filtering-out");
            card.classList.add("filtering-in");
            // Remove animation class after it completes
            setTimeout(function() {
              card.classList.remove("filtering-in");
            }, 400);
          } else {
            card.classList.add("filtering-out");
            setTimeout(function() {
              card.style.display = "none";
              card.classList.remove("filtering-out");
            }, 300);
          }
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

    const commands = {
      help: () => "Available: whoami, ls, cat <page>, neofetch, status, date, matrix, clear",
      whoami: () => "CHRIZ // CYBERSECURITY STUDENT & SYSTEMS DEVELOPER. [ACCESS_LEVEL: ADMIN]",
      ls: () => "about.md  portfolio.md  resume.md  contact.md  grimoire.md  skyrealm.md  teleportcore.md  spawnprotect.md  varthabot.md",
      date: () => new Date().toString(),
      status: async () => {
        try {
          const res = await fetch('https://www.githubstatus.com/api/v2/status.json');
          const data = await res.json();
          return `GITHUB STATUS: ${data.status.description.toUpperCase()}`;
        } catch (e) { return "TELEMETRY OFFLINE"; }
      },
      cat: (args) => {
        const page = args[0];
        if (!page) return "Usage: cat <filename>";
        const content = {
          "about.md": "Exploring forensics, ethical hacking, and secure architectures.",
          "portfolio.md": "Archive of technical builds and immersive systems.",
          "resume.md": "Diploma in Cyber Forensic and Cyber Security (2025-2028).",
          "contact.md": "Frequency: chrizmonsaji@gmail.com | Github: @chriz-3656",
          "grimoire.md": "Real-time GitHub telemetry and developer resource manual.",
          "skyrealm.md": "SkyRealm Minecraft Community: A thriving server network for Bedrock. [URL: skyrealm.fun]",
          "teleportcore.md": "Advanced movement utility script for Bedrock. Includes TPA, Warps, and RTP.",
          "spawnprotect.md": "Advanced region protection system with PvP control and interaction blocking.",
          "varthabot.md": "Multi-user news and utility Discord bot for SkyRealm. [URL: vartha.skyrealm.fun]"
        };
        return content[page] || `cat: ${page}: No such file or directory`;
      },
      neofetch: () => {
        return `
   <span style="color:var(--green2)">      .      </span>    <span style="color:var(--text)">USER:</span> chriz
   <span style="color:var(--green2)">     / \\     </span>    <span style="color:var(--text)">OS:</span> EndeavourOS / Mint
   <span style="color:var(--green2)">    /   \\    </span>    <span style="color:var(--text)">HOST:</span> Sky-Realm-Server
   <span style="color:var(--green2)">   /     \\   </span>    <span style="color:var(--text)">SHELL:</span> zsh
   <span style="color:var(--green2)">  /------- \\  </span>    <span style="color:var(--text)">LEVEL:</span> 3656
   <span style="color:var(--green2)"> /         \\ </span>    <span style="color:var(--text)">AESTHETIC:</span> Cyberpunk
        `;
      },
      sudo: () => "Permission denied: user 'chriz' is not in the sudoers file. This incident will be reported.",
      matrix: () => {
        startMatrixEffect(out);
        return "Initializing digital rain...";
      }
    };

    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      var fullCmd = inp.value.trim().toLowerCase();
      inp.value = "";
      if (!fullCmd) return;

      var parts = fullCmd.split(" ");
      var cmd = parts[0];
      var args = parts.slice(1);

      var line = document.createElement("div");
      line.innerHTML = `<span style="color:var(--green2)">$</span> ${fullCmd}`;
      out.appendChild(line);

      if (cmd === "clear") {
        out.innerHTML = "<div>CHRIZ PORTFOLIO v1.0.0</div><div>Type 'help' for commands.</div>";
      } else if (commands[cmd]) {
        const res = await commands[cmd](args);
        if (res) {
          var responseLine = document.createElement("div");
          responseLine.style.whiteSpace = "pre-wrap";
          responseLine.innerHTML = res;
          out.appendChild(responseLine);
        }
      } else {
        var err = document.createElement("div");
        err.textContent = `-bash: ${cmd}: command not found`;
        out.appendChild(err);
      }
      out.scrollTop = out.scrollHeight;
    });

    function startMatrixEffect(container) {
      const chars = "0101010101010101";
      let count = 0;
      const interval = setInterval(() => {
        const line = document.createElement("div");
        line.style.color = "var(--green2)";
        line.style.opacity = Math.random();
        let text = "";
        for(let i=0; i<30; i++) text += chars[Math.floor(Math.random()*chars.length)];
        line.textContent = text;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
        count++;
        if (count > 50) clearInterval(interval);
      }, 50);
    }
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
      
      // Force reveal of all newly added items
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      
    } catch (e) {
      console.error('Grimoire error:', e);
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
      
      if (e.message.includes('403') || e.message.includes('rate limit')) {
        document.getElementById('errorMessage').textContent = 'GitHub API rate limit exceeded. Please try again in an hour or check back later.';
      } else {
        document.getElementById('errorMessage').textContent = e.message;
      }
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
    if (!reposList) return;
    reposList.innerHTML = '';
    
    repos.slice(0, 12).forEach(repo => {
      const card = document.createElement('article');
      card.className = 'card project-card reveal';
      
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      
      card.innerHTML = `
        <div class="project-image" style="display:flex; align-items:center; justify-content:center;">${getLanguageIcon(repo.language)}</div>
        <div class="project-content">
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description'}</p>
          <div style="display: flex; gap: 10px; margin-top: 10px; font-size: 0.9rem; font-weight: 700; flex-wrap: wrap;">
            <img src="https://img.shields.io/badge/Stars-${stars}-00FF00?style=flat-square&logo=github&logoColor=black" alt="Stars">
            <img src="https://img.shields.io/badge/Forks-${forks}-00FF00?style=flat-square&logo=github&logoColor=black" alt="Forks">
          </div>
          <a href="${repo.html_url}" target="_blank" class="btn secondary" style="margin-top:15px; padding:10px 18px; font-size:0.9rem;">View Repo →</a>
        </div>
      `;
      
      reposList.appendChild(card);
    });
    
    const section = document.getElementById('reposSection');
    if (section) section.style.display = 'block';
  }

  async function displayLanguages(repos) {
    const langList = document.getElementById('languagesList');
    if (!langList) return;
    
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
    
    langList.innerHTML = '';
    
    sorted.forEach(([lang, bytes]) => {
      const card = document.createElement('div');
      card.className = 'stat reveal';
      card.innerHTML = `
        <div style="margin-bottom: 10px;">${getLanguageIcon(lang)}</div>
        <p>${lang}</p>
      `;
      langList.appendChild(card);
    });
    
    const section = document.getElementById('languagesSection');
    if (sorted.length > 0 && section) {
      section.style.display = 'block';
    }
  }

  function displayActivity(events) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
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
        <h3 style="display:flex; align-items:center;">${getEventIcon(event.type)} ${event.type.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
        <p>${event.repo.name}</p>
      `;
      
      activityList.appendChild(item);
    });
    
    if (uniqueEvents.length > 0) {
      document.getElementById('activitySection').style.display = 'block';
    }
  }

  function getLanguageIcon(lang) {
    if (!lang) lang = 'Code';
    const cleanLang = lang.replace(/\s+/g, '%20');
    const logoMap = {
      'JavaScript': 'javascript', 'Python': 'python', 'Java': 'java', 'C++': 'cplusplus',
      'TypeScript': 'typescript', 'Go': 'go', 'Rust': 'rust', 'HTML': 'html5',
      'CSS': 'css3', 'PHP': 'php', 'Ruby': 'ruby', 'Swift': 'swift',
      'Kotlin': 'kotlin', 'Shell': 'gnubash', 'SQL': 'mysql', 'Vue': 'vuedotjs',
      'React': 'react', 'Angular': 'angular', 'Dockerfile': 'docker', 'JSON': 'json'
    };
    const logo = logoMap[lang] || 'github';
    return `<img src="https://img.shields.io/badge/-${cleanLang}-121212?style=for-the-badge&logo=${logo}&logoColor=00FF00" alt="${lang}" style="height:32px; border: 2px solid #00FF00; border-radius: 6px;">`;
  }

  function getEventIcon(eventType) {
    const typeMap = {
      'PushEvent': { label: 'PUSH', logo: 'githubactions' },
      'CreateEvent': { label: 'CREATE', logo: 'github' },
      'DeleteEvent': { label: 'DELETE', logo: 'github' },
      'PullRequestEvent': { label: 'PR', logo: 'github' },
      'IssuesEvent': { label: 'ISSUE', logo: 'github' },
      'ForkEvent': { label: 'FORK', logo: 'github' },
      'WatchEvent': { label: 'STAR', logo: 'github' },
      'ReleaseEvent': { label: 'RELEASE', logo: 'github' }
    };
    const info = typeMap[eventType] || { label: 'EVENT', logo: 'github' };
    return `<img src="https://img.shields.io/badge/-${info.label.replace(/\s+/g, '%20')}-00FF00?style=flat-square&logo=${info.logo}&logoColor=black" alt="${info.label}" style="vertical-align: middle; margin-right: 8px;">`;
  }

  function initBackToTop() {
    // Create back-to-top button if it doesn't exist
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
      document.body.appendChild(btn);
    }

    // Show/hide based on scroll position
    function toggleVisibility() {
      if (window.scrollY > 400) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initActiveNavLink() {
    // Highlight current page in navigation
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const navLinks = document.querySelectorAll('.nav-link, .nav-menu-link');
    
    navLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      const linkPath = href.startsWith('/') ? href.replace(/\/$/, '') || '/' : '/' + href.replace(/\/$/, '');
      
      if (currentPath === linkPath || (currentPath === '/' && linkPath === '/')) {
        link.classList.add('active');
      }
    });
  }

})();
