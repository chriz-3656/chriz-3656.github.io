(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    function safeInit(fn, name) {
      try { fn(); }
      catch (e) { console.error("Error in " + name + ":", e); }
    }

    safeInit(initGithubStats, 'initGithubStats');
    safeInit(initLiveClock, 'initLiveClock');
    safeInit(initSpotifyMarquee, 'initSpotifyMarquee');
    safeInit(initParallax, 'initParallax');
    safeInit(injectDoodles, 'injectDoodles');
    safeInit(initDynamicProjects, 'initDynamicProjects');
    safeInit(initMobileMenu, 'initMobileMenu');
  });

  async function initGithubStats() {
    const username = 'chriz-3656';
    try {
      const userRes = await fetch('https://api.github.com/users/' + username);
      if (userRes.ok) {
        const userData = await userRes.json();
        const reposElements = document.querySelectorAll('.about-module .about-label');
        reposElements.forEach(el => {
          if (el.textContent === 'REPOSITORIES') {
            el.nextElementSibling.textContent = userData.public_repos || '41';
          }
        });
      }

      const eventsRes = await fetch('https://api.github.com/users/' + username + '/events');
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        let recentCommits = 0;
        eventsData.forEach(event => {
          if (event.type === 'PushEvent') {
            recentCommits += event.payload.commits.length;
          }
        });
        
        const commitsElements = document.querySelectorAll('.about-module .about-label');
        commitsElements.forEach(el => {
          if (el.textContent === 'COMMITS (30D)') {
            el.nextElementSibling.textContent = recentCommits > 0 ? recentCommits : 'ACTIVE';
          }
        });
      }
    } catch (e) {
      console.log('Using static github data');
    }
  }

  function initLiveClock() {
    const clockElements = document.querySelectorAll('.live-clock');
    if (clockElements.length === 0) return;

    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      
      clockElements.forEach(el => {
        el.textContent = timeString;
      });
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  function initSpotifyMarquee() {
    const marquee = document.getElementById('spotify-marquee');
    if (!marquee) return;
    
    const trackName = "SYNTHETIC_HORIZONS.mp3";
    const artist = "SYSTEM_AUDIO";
    marquee.textContent = `NOW PLAYING: ${trackName} // ARTIST: ${artist} // STATUS: STREAMING // `;
  }

  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
      let scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        let speed = el.dataset.speed || 0.2;
        el.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * (speed * 0.5)}deg)`;
      });
    });
  }

  function injectDoodles() {
    const doodles = [
      { text: "システム起動", top: "10%", left: "5%", speed: -0.3, size: "3rem" },
      { text: "サイバー", top: "40%", right: "8%", speed: 0.4, size: "4rem" },
      { text: "+ + +", top: "25%", right: "15%", speed: -0.15, size: "2rem" },
      { text: "Δ", top: "60%", left: "12%", speed: -0.25, size: "5rem" },
      { text: "セキュリティ", top: "75%", right: "10%", speed: 0.3, size: "3rem" },
      { text: "// NULL", top: "85%", left: "8%", speed: 0.2, size: "2.5rem" },
      { text: "O", top: "15%", left: "40%", speed: 0.5, size: "8rem" }
    ];

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';
    container.style.overflow = 'hidden';

    doodles.forEach(d => {
      const el = document.createElement('div');
      el.className = 'parallax parallax-doodle';
      el.textContent = d.text;
      el.dataset.speed = d.speed;
      
      if (d.top) el.style.top = d.top;
      if (d.left) el.style.left = d.left;
      if (d.right) el.style.right = d.right;
      el.style.fontSize = d.size;
      
      container.appendChild(el);
    });

    document.body.appendChild(container);
  }


  async function initDynamicProjects() {
    const grid = document.getElementById('dynamic-projects-grid');
    if (!grid) return;

    const username = 'chriz-3656';
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error("API error");
      const repos = await res.json();
      
      grid.innerHTML = ''; // Clear loader
      
      let count = 1;
      repos.forEach(r => {
        if (r.archived) return;
        
        const desc = r.description || "No description provided.";
        const lang = r.language || "Unknown";
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <div class="project-id">ID: ${String(count).padStart(2, '0')}</div>
          <h3 class="project-title">${r.name}</h3>
          <p class="project-desc">${desc}</p>
          <div class="project-meta">
            <span>${lang}</span>
            <span>STATUS: ACTIVE</span>
          </div>
          <a href="${r.html_url}" class="btn" style="text-align: center;" target="_blank">VIEW REPO</a>
        `;
        
        grid.appendChild(card);
        count++;
      });
      
    } catch (e) {
      grid.innerHTML = '<div class="lcd-text" style="grid-column: 1 / -1; text-align: center; color: red;">[SYS_ERR: FAILED TO FETCH REPOSITORIES]</div>';
      console.error(e);
    }
  }


  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const navModule = document.querySelector('.nav-module');
    
    if (btn && navModule) {
      btn.addEventListener('click', () => {
        navModule.classList.toggle('nav-open');
        if (navModule.classList.contains('nav-open')) {
          btn.textContent = '[ CLOSE ]';
        } else {
          btn.textContent = '[ MENU ]';
        }
      });
    }
  }

})();
