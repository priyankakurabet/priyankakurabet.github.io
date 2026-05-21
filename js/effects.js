/* ============================================================
   effects.js — Utility functions for the portfolio
   Provides: lerp, clamp, getMousePos, isTouchDevice,
             splitTextToChars, splitTextToWords,
             createMagneticEffect, createParallax
   ============================================================ */

window.PortfolioEffects = (function () {
  'use strict';

  /* ---- Math helpers ---- */

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /* ---- Event helpers ---- */

  function getMousePos(e) {
    return {
      x: e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0),
      y: e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)
    };
  }

  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  /* ---- Text splitting ---- */

  /**
   * Wraps every character of `element`'s textContent in a <span class="char">.
   * Spaces are rendered as &nbsp; so they remain visible.
   * Returns an array of the created <span> elements.
   */
  function splitTextToChars(element) {
    if (!element) return [];

    var text = element.textContent;
    element.textContent = '';          // clear original content
    element.setAttribute('aria-label', text); // accessibility

    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'char';
      span.style.display = 'inline-block';
      span.innerHTML = text[i] === ' ' ? '&nbsp;' : text[i];
      element.appendChild(span);
      chars.push(span);
    }
    return chars;
  }

  /**
   * Wraps every word of `element`'s textContent in a <span class="word">.
   * A trailing space is appended after each word (except the last).
   * Returns an array of the created <span> elements.
   */
  function splitTextToWords(element) {
    if (!element) return [];

    var text = element.textContent.trim();
    element.textContent = '';
    element.setAttribute('aria-label', text);

    var words = text.split(/\s+/);
    var spans = [];

    words.forEach(function (word, idx) {
      var span = document.createElement('span');
      span.className = 'word';
      span.style.display = 'inline-block';
      span.textContent = word;
      element.appendChild(span);
      spans.push(span);

      // add a plain space node between words
      if (idx < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });

    return spans;
  }

  /* ---- Magnetic hover effect ---- */

  /**
   * Makes `element` subtly follow the cursor when hovering nearby.
   * `strength` controls how much the element translates (0–1 range recommended).
   */
  function createMagneticEffect(element, strength) {
    if (!element) return;
    strength = typeof strength === 'number' ? strength : 0.3;

    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var raf = null;
    var isAnimating = false;

    function tick() {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      element.style.transform =
        'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px)';

      // keep running until close enough to target
      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        isAnimating = false;
      }
    }

    function startLoop() {
      if (!isAnimating) {
        isAnimating = true;
        raf = requestAnimationFrame(tick);
      }
    }

    element.addEventListener('mousemove', function (e) {
      var rect = element.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      var deltaX = e.clientX - centerX;
      var deltaY = e.clientY - centerY;

      targetX = deltaX * strength;
      targetY = deltaY * strength;
      startLoop();
    });

    element.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      startLoop();
    });
  }

  /* ---- Parallax helper ---- */

  /**
   * Returns a config object useful for wiring up parallax with ScrollTrigger
   * or manual mouse‑move handlers.
   */
  function createParallax(element, speed) {
    speed = typeof speed === 'number' ? speed : 0.5;

    return {
      element: element,
      speed: speed,
      /**
       * Call with a normalised progress value (0‑1) to apply Y offset.
       */
      update: function (progress) {
        if (!element) return;
        var offset = (progress - 0.5) * speed * 100;
        element.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
      }
    };
  }

  /* ---- Public API ---- */

  return {
    lerp: lerp,
    clamp: clamp,
    getMousePos: getMousePos,
    isTouchDevice: isTouchDevice,
    splitTextToChars: splitTextToChars,
    splitTextToWords: splitTextToWords,
    createMagneticEffect: createMagneticEffect,
    createParallax: createParallax
  };
})();
