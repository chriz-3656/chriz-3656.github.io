(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    initIntro();
    initNavigation();
    initReveal();
    initPortfolioFilter();
    initGithubStats();
    initTerminal();
    initContactForm();
  });

  function initIntro() {
    var intro = document.querySelector("[data-intro]");
    if (!intro) {
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intro.classList.add("is-hidden");
      return;
    }

    if (window.localStorage && localStorage.getItem("chriz_intro_seen") === "1") {
      intro.classList.add("is-hidden");
      return;
    }

    window.setTimeout(function() {
      intro.classList.add("is-hidden");
      if (window.localStorage) {
        localStorage.setItem("chriz_intro_seen", "1");
      }
    }, 2200);
  }

  function initNavigation() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(function(link) {
      var href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    var header = document.querySelector(".site-header");
    var mobileMedia = window.matchMedia ? window.matchMedia("(max-width: 960px)") : null;
    if (!toggle || !nav || !header) {
      return;
    }

    function closeNav() {
      header.classList.remove("is-open");
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }

    function openNav() {
      header.classList.add("is-open");
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
    }

    toggle.addEventListener("click", function() {
      var open = !header.classList.contains("is-open");
      if (open) {
        openNav();
      } else {
        closeNav();
      }
    });

    nav.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function() {
        closeNav();
      });
    });

    document.addEventListener("click", function(event) {
      if ((mobileMedia && !mobileMedia.matches) || !header.classList.contains("is-open")) {
        return;
      }

      var insideHeader = header.contains(event.target);
      var insideToggle = toggle.contains(event.target);
      if (!insideHeader && !insideToggle) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    if (mobileMedia && mobileMedia.addEventListener) {
      mobileMedia.addEventListener("change", function(event) {
        if (!event.matches) {
          closeNav();
        }
      });
    } else {
      window.addEventListener("resize", function() {
        if (window.innerWidth > 960) {
          closeNav();
        }
      });
    }
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) {
      return;
    }

    items.forEach(function(item, index) {
      item.style.transitionDelay = Math.min(index * 35, 180) + "ms";
    });

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
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  function initPortfolioFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-category]");
    if (!buttons.length || !cards.length) {
      return;
    }

    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        var filter = button.getAttribute("data-filter");

        buttons.forEach(function(other) {
          other.classList.remove("active");
        });
        button.classList.add("active");

        cards.forEach(function(card) {
          var matches = filter === "all" || card.getAttribute("data-category") === filter;
          card.hidden = !matches;
        });
      });
    });
  }

  async function initGithubStats() {
    var cards = document.querySelector("[data-github-card]");
    if (!cards) {
      return;
    }

    var reposValue = document.querySelector("[data-github-card='repos'] [data-github-value]");
    var starsValue = document.querySelector("[data-github-card='stars'] [data-github-value]");
    var languagesWrap = document.querySelector("[data-github-languages]");
    var activityWrap = document.querySelector("[data-github-activity]");

    try {
      var userResponse = await fetch("https://api.github.com/users/chriz-3656");
      var reposResponse = await fetch("https://api.github.com/users/chriz-3656/repos?per_page=100&sort=updated");
      var eventsResponse = await fetch("https://api.github.com/users/chriz-3656/events/public?per_page=12");

      if (!userResponse.ok || !reposResponse.ok || !eventsResponse.ok) {
        throw new Error("GitHub API request failed");
      }

      var user = await userResponse.json();
      var repos = await reposResponse.json();
      var events = await eventsResponse.json();

      var totalStars = repos.reduce(function(sum, repo) {
        return sum + (repo.stargazers_count || 0);
      }, 0);

      var languageCounts = repos.reduce(function(map, repo) {
        if (repo.language) {
          map[repo.language] = (map[repo.language] || 0) + 1;
        }
        return map;
      }, {});

      var topLanguages = Object.keys(languageCounts)
        .sort(function(a, b) {
          return languageCounts[b] - languageCounts[a];
        })
        .slice(0, 6);

      if (reposValue) {
        reposValue.textContent = String(user.public_repos || repos.length || 0);
      }

      if (starsValue) {
        starsValue.textContent = String(totalStars);
      }

      if (languagesWrap) {
        languagesWrap.innerHTML = "";
        if (!topLanguages.length) {
          languagesWrap.innerHTML = "<span class='github-empty'>No language data available.</span>";
        } else {
          topLanguages.forEach(function(language) {
            var chip = document.createElement("span");
            chip.className = "chip";
            chip.textContent = language + " · " + languageCounts[language];
            languagesWrap.appendChild(chip);
          });
        }
      }

      if (activityWrap) {
        activityWrap.innerHTML = "";
        var pushEvents = events.filter(function(event) {
          return event.type === "PushEvent";
        }).slice(0, 4);

        if (!pushEvents.length) {
          activityWrap.innerHTML = "<div class='github-activity-item github-empty'>No recent public push events found.</div>";
        } else {
          pushEvents.forEach(function(event) {
            var item = document.createElement("div");
            item.className = "github-activity-item";
            var repoName = event.repo && event.repo.name ? event.repo.name.replace(/^chriz-3656\//, "") : "repository";
            var commits = event.payload && event.payload.commits ? event.payload.commits.length : 0;
            item.textContent = repoName + " · " + commits + " commit" + (commits === 1 ? "" : "s");
            activityWrap.appendChild(item);
          });
        }
      }
    } catch (error) {
      if (reposValue) {
        reposValue.textContent = "--";
      }
      if (starsValue) {
        starsValue.textContent = "--";
      }
      if (languagesWrap) {
        languagesWrap.innerHTML = "<span class='github-empty'>GitHub stats unavailable right now.</span>";
      }
      if (activityWrap) {
        activityWrap.innerHTML = "<div class='github-activity-item github-empty'>Recent GitHub activity is unavailable right now.</div>";
      }
    }
  }

  function initTerminal() {
    var root = document.querySelector("[data-terminal-root]");
    if (!root) {
      return;
    }

    var output = root.querySelector("[data-terminal-output]");
    var form = root.querySelector("[data-terminal-form]");
    var input = form ? form.querySelector("input[name='command']") : null;
    var chips = root.querySelectorAll("[data-terminal-chip]");
    if (!output || !form || !input) {
      return;
    }

    var history = [];
    var historyIndex = -1;
    var routes = {
      home: "index.html",
      about: "about.html",
      projects: "portfolio.html",
      portfolio: "portfolio.html",
      resume: "resume.html",
      highlights: "testimonials.html",
      contact: "contact.html",
      terminal: "terminal.html"
    };

    var commands = {
      help: function() {
        return [
          line("sys", "Available commands:"),
          line("cmd", "help, whoami, projects, skills, github, contact, socials, resume, clear"),
          line("cmd", "open <home|about|projects|resume|highlights|contact|terminal>"),
          line("tip", "Use arrow up/down for command history.")
        ];
      },
      whoami: function() {
        return [
          line("usr", "Chriz"),
          line("bio", "Cybersecurity & Cyber Forensics student from India."),
          line("bio", "Focused on Linux systems, automation, privacy research, AI experiments, and practical builds.")
        ];
      },
      projects: function() {
        return [
          line("wrk", "Featured repositories:"),
          line("01", "ATtiny85-USB-Brute-Force-PIN"),
          line("02", "GHOSTRACE"),
          line("03", "streamflix"),
          line("04", "CHATTrace"),
          line("05", "TiltGuard"),
          links("open", [
            { href: "portfolio.html", label: "Open projects page" },
            { href: "https://github.com/chriz-3656?tab=repositories", label: "GitHub repos", external: true }
          ])
        ];
      },
      skills: function() {
        return [
          line("skl", "Core areas: Cybersecurity, Digital Forensics, Linux Systems, Server Infrastructure, Automation, Web Development, AI Integration."),
          line("stk", "Stack: C, JavaScript, HTML, CSS, Linux administration, OSINT concepts, server configuration.")
        ];
      },
      github: function() {
        return [
          line("git", "Primary GitHub: github.com/chriz-3656"),
          links("url", [
            { href: "https://github.com/chriz-3656", label: "Open GitHub", external: true }
          ])
        ];
      },
      contact: function() {
        return [
          line("com", "Email: chrizmonsaji@gmail.com"),
          line("com", "Discord: chriz3656"),
          links("go", [
            { href: "contact.html", label: "Open contact page" },
            { href: "mailto:chrizmonsaji@gmail.com", label: "Send email", external: true }
          ])
        ];
      },
      socials: function() {
        return [
          line("soc", "Profiles loaded: GitHub, Discord, LinkedIn, Reddit, Instagram, Threads, Xbox."),
          links("url", [
            { href: "https://github.com/chriz-3656", label: "GitHub", external: true },
            { href: "https://www.instagram.com/chriz__3656/", label: "Instagram", external: true },
            { href: "https://www.linkedin.com/in/chris-mon-saji-/", label: "LinkedIn", external: true }
          ])
        ];
      },
      resume: function() {
        return [
          line("edu", "Diploma in Cyber Forensic and Cyber Security | 2025 - 2028"),
          links("go", [
            { href: "resume.html", label: "Open resume page" },
            { href: "assets/data/cv.pdf", label: "Download CV" }
          ])
        ];
      },
      banner: function() {
        return [
          line("art", "   _____ _          _      "),
          line("art", "  / ____| |        (_)     "),
          line("art", " | |    | |__  _ __ _ ______"),
          line("art", " | |    | '_ \\| '__| |_  /"),
          line("art", " | |____| | | | |  | |/ / "),
          line("art", "  \\_____|_| |_|_|  |_/___|")
        ];
      },
      clear: function() {
        output.innerHTML = "";
        return [];
      }
    };

    chips.forEach(function(chip) {
      chip.addEventListener("click", function() {
        runCommand(chip.getAttribute("data-terminal-chip") || "");
      });
    });

    form.addEventListener("submit", function(event) {
      event.preventDefault();
      runCommand(input.value);
    });

    input.addEventListener("keydown", function(event) {
      if (!history.length) {
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        historyIndex = Math.min(historyIndex + 1, history.length - 1);
        input.value = history[history.length - 1 - historyIndex];
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        historyIndex = Math.max(historyIndex - 1, -1);
        input.value = historyIndex === -1 ? "" : history[history.length - 1 - historyIndex];
      }
    });

    window.setTimeout(function() {
      input.focus();
    }, 50);

    function runCommand(rawValue) {
      var raw = String(rawValue || "").trim();
      if (!raw) {
        return;
      }

      appendLine("chriz@portfolio:~$", raw);
      history.push(raw);
      historyIndex = -1;
      input.value = "";

      var parts = raw.toLowerCase().split(/\s+/);
      var command = parts[0];
      var arg = parts.slice(1).join(" ");

      if (command === "open") {
        if (routes[arg]) {
          appendNodes([
            line("nav", "Opening " + arg + "...")
          ]);
          window.setTimeout(function() {
            window.location.href = routes[arg];
          }, 280);
        } else {
          appendNodes([line("err", "Unknown route. Try: open home, open projects, open contact")]);
        }
        scrollTerminal();
        return;
      }

      if (command === "github") {
        appendNodes(commands.github());
        scrollTerminal();
        return;
      }

      if (commands[command]) {
        appendNodes(commands[command]());
      } else {
        appendNodes([
          line("err", "Command not found: " + raw),
          line("tip", "Type help to see valid commands.")
        ]);
      }

      scrollTerminal();
    }

    function appendLine(meta, text) {
      appendNodes([line(meta, text)]);
    }

    function appendNodes(nodes) {
      nodes.forEach(function(node) {
        output.appendChild(node);
      });
    }

    function line(meta, text) {
      var row = document.createElement("div");
      row.className = "terminal-line";

      var metaEl = document.createElement("span");
      metaEl.className = "terminal-meta";
      metaEl.textContent = meta;

      var textEl = document.createElement("span");
      textEl.textContent = text;

      row.appendChild(metaEl);
      row.appendChild(textEl);
      return row;
    }

    function links(meta, items) {
      var row = document.createElement("div");
      row.className = "terminal-line";

      var metaEl = document.createElement("span");
      metaEl.className = "terminal-meta";
      metaEl.textContent = meta;

      var wrap = document.createElement("div");
      wrap.className = "terminal-links";

      items.forEach(function(item) {
        var link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.label;
        if (item.external) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        wrap.appendChild(link);
      });

      row.appendChild(metaEl);
      row.appendChild(wrap);
      return row;
    }

    function scrollTerminal() {
      output.scrollTop = output.scrollHeight;
    }
  }

  async function initContactForm() {
    var form = document.getElementById("contactForm");
    var feedback = document.getElementById("formFeedback");
    if (!form || !feedback) {
      return;
    }

    var submit = form.querySelector("button[type='submit']");
    var SUPABASE_URL = "https://fzijfyqjrgpwvbsvgtcf.supabase.co";
    var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWpmeXFqcmdwd3Zic3ZndGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTk2NjQsImV4cCI6MjA3NjQ3NTY2NH0.oWRCPA46ugAG4DfFW25gA-SrYbJNog0XuCvc8pSadNQ";

    var client;
    try {
      client = await loadSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
      setFeedback("The form service is unavailable right now. You can still email me directly.", "error");
      return;
    }

    form.addEventListener("submit", async function(event) {
      event.preventDefault();
      if (submit) {
        submit.disabled = true;
      }
      setFeedback("Sending...", "");

      var data = new FormData(form);
      var payload = {
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message")
      };

      try {
        var result = await client.from("contact_messages").insert([payload]);
        if (result.error) {
          throw result.error;
        }
        form.reset();
        setFeedback("Message sent. I will get back to you soon.", "success");
      } catch (error) {
        setFeedback("Something went wrong. Please try again or use email instead.", "error");
      } finally {
        if (submit) {
          submit.disabled = false;
        }
      }
    });

    function setFeedback(message, state) {
      feedback.textContent = message;
      feedback.className = "form-feedback" + (state ? " " + state : "");
    }
  }

  async function loadSupabaseClient(url, key) {
    if (!window.supabase) {
      await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js");
    }
    return window.supabase.createClient(url, key);
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var existing = document.querySelector("script[data-src='" + src + "']");
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.src = src;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }
})();
