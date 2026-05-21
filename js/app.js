/* ============================================================
   app.js — Main orchestrator
   Boots Lenis smooth scroll, runs the preloader sequence,
   then initialises every portfolio module in the correct order.
   ============================================================ */

window.PortfolioApp = (function () {
  'use strict';

  var lenis;

  /* ==========================================================
     Boot
     ========================================================== */

  function init() {
    initLenis();
    initPreloader();
  }

  /* ---- Lenis smooth scroll ---- */

  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('[PortfolioApp] Lenis not loaded — falling back to native scroll.');
      return;
    }

    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      smoothWheel: true
    });

    // Expose globally so navigation can use lenis.scrollTo
    window.lenisInstance = lenis;

    // Bridge Lenis ↔ GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---- Preloader sequence ---- */

  function initPreloader() {
    var preloader = document.querySelector('.preloader');
    var counter   = document.querySelector('.counter-number');

    // If there's no preloader in the DOM, skip straight to modules
    if (!preloader) {
      initModules();
      return;
    }

    if (typeof gsap === 'undefined') {
      // Fallback: just hide preloader and go
      preloader.style.display = 'none';
      initModules();
      return;
    }

    // Animate 0 → 100 counter
    var count = { val: 0 };
    gsap.to(count, {
      val: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: function () {
        if (counter) counter.textContent = Math.floor(count.val);
      },
      onComplete: function () {
        // Trigger CSS clip-path / opacity exit
        preloader.classList.add('loaded');

        // After the CSS transition finishes (~1 s), remove from flow
        setTimeout(function () {
          preloader.style.display = 'none';
          initModules();
        }, 1000);
      }
    });
  }

  /* ==========================================================
     Module Initialisation (runs AFTER preloader)
     ========================================================== */

  function initModules() {
    /* --- Text splitting --- */

    // Hero name → character-level spans for cascade animation
    document.querySelectorAll('.hero-name .name-line').forEach(function (line) {
      if (!line.querySelector('.char')) {
        PortfolioEffects.splitTextToChars(line);
      }
    });

    // About heading → word-level spans for stagger reveal
    var aboutHeading = document.querySelector('.about-heading');
    if (aboutHeading && !aboutHeading.querySelector('.word')) {
      PortfolioEffects.splitTextToWords(aboutHeading);
    }

    /* --- Core modules --- */

    if (window.PortfolioCursor)     PortfolioCursor.init();
    if (window.PortfolioNav)        PortfolioNav.init();
    if (window.PortfolioAnimations) PortfolioAnimations.init();

    /* --- Hero mouse-move parallax --- */

    setupHeroParallax();

    /* --- Magnetic hover on buttons & contact links --- */

    if (window.PortfolioEffects && !PortfolioEffects.isTouchDevice()) {
      document.querySelectorAll(
        '.btn-primary, .btn-outline, .contact-link'
      ).forEach(function (el) {
        PortfolioEffects.createMagneticEffect(el, 0.2);
      });
    }

    /* --- Final ScrollTrigger recalc after everything renders --- */

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  /* ---- Hero mouse-move parallax (desktop only) ---- */

  function setupHeroParallax() {
    if (window.PortfolioEffects && PortfolioEffects.isTouchDevice()) return;

    var hero        = document.querySelector('#hero');
    var portrait    = document.querySelector('.portrait-frame');
    var decoratives = document.querySelectorAll(
      '.hero-deco-line, .hero-deco-dot, .hero-float-text'
    );

    if (!hero) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;   // −0.5 … +0.5
      var y = (e.clientY - rect.top)  / rect.height - 0.5;

      if (portrait) {
        gsap.to(portrait, {
          x: x * 15,
          y: y * 15,
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      decoratives.forEach(function (el, i) {
        var speed = 8 + i * 4;
        gsap.to(el, {
          x: x * speed,
          y: y * speed,
          duration: 1,
          ease: 'power2.out'
        });
      });
    }, { passive: true });
  }

  /* ==========================================================
     DOM-ready bootstrap
     ========================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---- Public API ---- */

  return {
    init: init
  };
})();
