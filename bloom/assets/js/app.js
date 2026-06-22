/* ==========================================================================
   Pagewright · Aurora - app.js
   Tiny, dependency-free progressive enhancement. ~2 KB. Safe to read & edit.
   Handles: theme toggle, mobile menu, announcement dismiss, scroll reveal.
   The FAQ uses native <details name="faq"> so it needs no JS.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Theme toggle ----------------------------------------------------- */
  var sun = document.querySelector('[data-icon-sun]');
  var moon = document.querySelector('[data-icon-moon]');

  function syncThemeIcon() {
    var dark = root.classList.contains('dark');
    if (sun) sun.classList.toggle('hidden', !dark);   // show sun in dark mode (click -> light)
    if (moon) moon.classList.toggle('hidden', dark);  // show moon in light mode (click -> dark)
  }
  syncThemeIcon();

  var themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.classList.toggle('dark');
      try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
      syncThemeIcon();
    });
  }

  /* ---- Mobile menu ------------------------------------------------------ */
  var menuBtn = document.querySelector('[data-mobile-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    // Close after tapping a link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Announcement dismiss (remembers the choice) ---------------------- */
  var announce = document.querySelector('[data-announce]');
  var announceClose = document.querySelector('[data-announce-close]');
  if (announce) {
    try { if (localStorage.getItem('announce-dismissed') === '1') announce.remove(); } catch (e) {}
  }
  if (announceClose && announce) {
    announceClose.addEventListener('click', function () {
      announce.remove();
      try { localStorage.setItem('announce-dismissed', '1'); } catch (e) {}
    });
  }

  /* ---- Scroll reveal ----------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
