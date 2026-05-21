/* ============================================================
   animations.js — Cinematic GSAP + ScrollTrigger animations
   Every section has meticulously timed, eased reveals that
   breathe and feel luxurious.
   ============================================================ */

window.PortfolioAnimations = (function () {
  'use strict';

  /* ---- Initialisation ---- */

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[PortfolioAnimations] GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    heroAnimations();
    workAnimations();
    aboutAnimations();
    skillsAnimations();
    contactAnimations();
  }

  /* ==========================================================
     HERO — entrance sequence after preloader
     ========================================================== */

  function heroAnimations() {
    var heroName   = document.querySelector('.hero-name');
    var subtitle   = document.querySelector('.hero-subtitle');
    var tagline    = document.querySelector('.hero-tagline');
    var cta        = document.querySelector('.hero-cta');
    var portrait   = document.querySelector('.portrait-frame');
    var decoratives = document.querySelectorAll(
      '.hero-deco-line, .hero-deco-dot, .hero-float-text'
    );

    // Master entrance timeline — starts after preloader (~1.8 s)
    var tl = gsap.timeline({ delay: 1.8 });

    // 1 ── Subtitle slides up with a gentle fade
    if (subtitle) {
      tl.from(subtitle, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // 2 ── First name-line characters cascade in
    var firstLineChars = document.querySelectorAll(
      '.hero-name .name-line:first-child .char'
    );
    if (firstLineChars.length) {
      tl.from(firstLineChars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power4.out'
      }, '-=0.3');
    }

    // 3 ── Second name-line characters
    var lastLineChars = document.querySelectorAll(
      '.hero-name .name-line:last-child .char'
    );
    if (lastLineChars.length) {
      tl.from(lastLineChars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power4.out'
      }, '-=0.5');
    }

    // 4 ── Tagline gently fades in
    if (tagline) {
      tl.from(tagline, {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4');
    }

    // 5 ── CTA buttons appear
    if (cta) {
      tl.from(cta, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3');
    }

    // 6 ── Portrait frame scales in with a subtle overshoot
    if (portrait) {
      tl.from(portrait, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.6');
    }

    // 7 ── Decorative elements pop in with playful bounce
    if (decoratives.length) {
      tl.from(decoratives, {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'back.out(1.7)'
      }, '-=0.4');
    }

    /* --- Hero scroll parallax --- */

    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        y: -80,
        opacity: 0.3,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    var heroPortrait = document.querySelector('.hero-portrait');
    if (heroPortrait) {
      gsap.to(heroPortrait, {
        y: -40,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  /* ==========================================================
     WORK — project cards with clip-path reveal
     ========================================================== */

  function workAnimations() {
    // Section header
    var workLabel = document.querySelector('#work .section-label');
    var workTitle = document.querySelector('#work .section-title');

    if (workLabel) {
      gsap.from(workLabel, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#work', start: 'top 80%' }
      });
    }

    if (workTitle) {
      gsap.from(workTitle, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#work', start: 'top 78%' }
      });
    }

    // Each project card — cinematic staggered reveal
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function (card) {
      var imageWrap   = card.querySelector('.project-image-wrap');
      var number      = card.querySelector('.project-number');
      var title       = card.querySelector('.project-title');
      var description = card.querySelector('.project-description');
      var tags        = card.querySelectorAll('.project-tag');
      var link        = card.querySelector('.project-link');

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 20%',
          toggleActions: 'play none none none'
        }
      });

      // Image container clip-path wipe
      if (imageWrap) {
        tl.from(imageWrap, {
          clipPath: 'inset(10% 10% 10% 10%)',
          scale: 1.1,
          duration: 1.2,
          ease: 'power3.out'
        });
        tl.set(imageWrap, { clipPath: 'inset(0% 0% 0% 0%)' });
      }

      // Big ghosted number
      if (number) {
        tl.from(number, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.8');
      }

      // Title
      if (title) {
        tl.from(title, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.6');
      }

      // Description
      if (description) {
        tl.from(description, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.4');
      }

      // Tags cascade
      if (tags.length) {
        tl.from(tags, {
          y: 15,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power3.out'
        }, '-=0.3');
      }

      // Case-study link
      if (link) {
        tl.from(link, {
          y: 10,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.out'
        }, '-=0.2');
      }
    });

    // Subtle parallax on project images while scrolling
    document.querySelectorAll('.project-image-wrap img').forEach(function (img) {
      var parentCard = img.closest('.project-card');
      if (!parentCard) return;

      gsap.to(img, {
        y: -30,
        scale: 1.02,
        scrollTrigger: {
          trigger: parentCard,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  /* ==========================================================
     ABOUT — word-by-word heading reveal + body + portrait
     ========================================================== */

  function aboutAnimations() {
    var aboutLabel    = document.querySelector('#about .section-label');
    var aboutHeading  = document.querySelector('.about-heading');
    var aboutBody     = document.querySelector('.about-body');
    var aboutPortrait = document.querySelector('.about-portrait');

    if (aboutLabel) {
      gsap.from(aboutLabel, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: { trigger: '#about', start: 'top 80%' }
      });
    }

    // Word-by-word cinematic reveal
    var words = document.querySelectorAll('.about-heading .word');
    if (words.length) {
      gsap.from(words, {
        y: 40,
        opacity: 0,
        rotateX: -15,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutHeading || '#about',
          start: 'top 80%'
        }
      });
    }

    if (aboutBody) {
      gsap.from(aboutBody, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: aboutBody, start: 'top 85%' }
      });
    }

    if (aboutPortrait) {
      gsap.from(aboutPortrait, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: aboutPortrait, start: 'top 90%' }
      });
    }
  }

  /* ==========================================================
     SKILLS — ecosystem items float in from alternating sides
     ========================================================== */

  function skillsAnimations() {
    var skillsLabel = document.querySelector('#skills .section-label');
    var skillsTitle = document.querySelector('#skills .section-title');

    if (skillsLabel) {
      gsap.from(skillsLabel, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: { trigger: '#skills', start: 'top 80%' }
      });
    }

    if (skillsTitle) {
      gsap.from(skillsTitle, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: '#skills', start: 'top 78%' }
      });
    }

    // Skill categories fade in
    var categories = document.querySelectorAll('.skill-category');
    categories.forEach(function (cat, ci) {
      gsap.from(cat, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: ci * 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.skills-ecosystem', start: 'top 82%' }
      });
    });

    // Individual skill items — staggered with alternating X offsets
    var items = document.querySelectorAll('.skill-item');
    items.forEach(function (item, i) {
      var xFrom = (i % 2 === 0 ? -1 : 1) * (30 + Math.random() * 30);
      var yFrom = 30 + Math.random() * 20;

      gsap.from(item, {
        x: xFrom,
        y: yFrom,
        opacity: 0,
        scale: 0.8,
        duration: 0.8 + Math.random() * 0.4,
        delay: i * 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.skills-ecosystem', start: 'top 80%' }
      });
    });
  }

  /* ==========================================================
     CONTACT — heading + body + links + footer
     ========================================================== */

  function contactAnimations() {
    var contactSection = document.querySelector('#contact');
    if (!contactSection) return;

    var heading = document.querySelector('.contact-heading');
    var body    = document.querySelector('.contact-body');
    var links   = document.querySelectorAll('.contact-link');
    var footer  = document.querySelector('.contact-footer');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%'
      }
    });

    if (heading) {
      tl.from(heading, {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out'
      });
    }

    if (body) {
      tl.from(body, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.5');
    }

    if (links.length) {
      tl.from(links, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.3');
    }

    if (footer) {
      tl.from(footer, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.2');
    }
  }

  /* ---- Public API ---- */

  return {
    init: init
  };
})();
