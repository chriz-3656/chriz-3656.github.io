(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    initIntro();
    initNavigation();
    initReveal();
    initPortfolioFilter();
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
      if (window.innerWidth > 960 || !header.classList.contains("is-open")) {
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

    window.addEventListener("resize", function() {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) {
      return;
    }

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
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
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
