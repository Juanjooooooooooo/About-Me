/* ─────────────────────────────────────────────────────────────────
   script.js – Interactive behavior for the About Me portfolio
───────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Navbar: shrink on scroll & active link highlight ───────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  function onScroll () {
    // Scrolled shadow
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Highlight active nav link based on current section in view
    let currentId = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 120) {
        currentId = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger menu ──────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navList   = document.querySelector('.nav-links');

  hamburger.addEventListener('click', function () {
    const open = navList.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is clicked
  navList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navList.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Smooth scroll for anchor links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Intersection Observer helper ──────────────────────────── */
  function createObserver (callback, options) {
    return new IntersectionObserver(callback, Object.assign({
      threshold: 0.2
    }, options));
  }

  /* ── Animated counting numbers ─────────────────────────────── */
  function animateCounter (el) {
    const target  = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms
    const start   = performance.now();

    function update (now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statCards = document.querySelectorAll('.stat-card');
  const counterObs = createObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        counterObs.unobserve(entry.target);
      }
    });
  });
  statCards.forEach(function (card) { counterObs.observe(card); });

  /* ── Animated skill bars ────────────────────────────────────── */
  const skillSection = document.getElementById('skills');
  const skillBars    = document.querySelectorAll('.skill-fill');

  const skillObs = createObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        skillBars.forEach(function (bar) {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (skillSection) skillObs.observe(skillSection);

  /* ── Timeline reveal on scroll ──────────────────────────────── */
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObs = createObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timelineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(function (item) { timelineObs.observe(item); });

  /* ── Generic fade-in for section headings ───────────────────── */
  const fadeTitles = document.querySelectorAll('.section-title');

  const fadeObs = createObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.7s ease both';
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fadeTitles.forEach(function (t) { fadeObs.observe(t); });
}());
