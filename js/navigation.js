/* ============================================================
   navigation.js — Navigation behaviour
   Hide-on-scroll, active-section tracking via ScrollTrigger,
   mobile overlay menu, smooth-scroll with Lenis, and magnetic
   nav links.
   ============================================================ */

window.PortfolioNav = (function () {
  'use strict';

  var nav, links, menuBtn, overlay, overlayLinks;
  var lastScrollY = 0;
  var isMenuOpen = false;

  /* ---- Initialisation ---- */

  function init() {
    nav          = document.querySelector('.nav-main');
    links        = document.querySelectorAll('.nav-links a');
    menuBtn      = document.querySelector('.nav-menu-btn');
    overlay      = document.querySelector('.nav-overlay');
    overlayLinks = document.querySelectorAll('.nav-overlay a');

    if (!nav) return;

    setupScrollBehavior();
    setupActiveTracking();
    setupMobileMenu();
    setupSmoothScroll();
    setupMagneticNavLinks();
  }

  /* ---- Hide / show nav on scroll direction ---- */

  function setupScrollBehavior() {
    window.addEventListener('scroll', function () {
      var currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 100) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }

      // Add background when scrolled past hero
      if (currentY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScrollY = currentY;
    }, { passive: true });
  }

  /* ---- Active section tracking via ScrollTrigger ---- */

  function setupActiveTracking() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var sections = document.querySelectorAll('section[id]');
    sections.forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: function ()     { setActive(section.id); },
        onEnterBack: function () { setActive(section.id); }
      });
    });
  }

  function setActive(sectionId) {
    links.forEach(function (link) {
      var isActive = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('active', isActive);
    });
  }

  /* ---- Mobile menu ---- */

  function setupMobileMenu() {
    if (!menuBtn || !overlay) return;

    menuBtn.addEventListener('click', toggleMenu);

    overlayLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isMenuOpen = true;
    menuBtn.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Stagger-animate overlay links for a cinematic feel
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        overlayLinks,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }
  }

  function closeMenu() {
    isMenuOpen = false;
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';

    if (typeof gsap !== 'undefined') {
      gsap.to(overlayLinks, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: 'power2.in',
        onComplete: function () {
          overlay.classList.remove('open');
        }
      });
    } else {
      overlay.classList.remove('open');
    }
  }

  /* ---- Smooth scroll (Lenis-aware) ---- */

  function setupSmoothScroll() {
    var allLinks = [];
    links.forEach(function (l) { allLinks.push(l); });
    overlayLinks.forEach(function (l) { allLinks.push(l); });

    allLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        var targetId =
          link.getAttribute('data-section') ||
          (link.getAttribute('href') ? link.getAttribute('href').replace('#', '') : null);

        if (!targetId) return;

        var target = document.getElementById(targetId);
        if (!target) return;

        // Prefer Lenis for buttery scroll; fall back to native
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(target, {
            offset: -80,
            duration: 1.2
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ---- Magnetic nav links (desktop only) ---- */

  function setupMagneticNavLinks() {
    if (!window.PortfolioEffects || PortfolioEffects.isTouchDevice()) return;

    links.forEach(function (link) {
      PortfolioEffects.createMagneticEffect(link, 0.25);
    });
  }

  /* ---- Public API ---- */

  return {
    init: init
  };
})();
