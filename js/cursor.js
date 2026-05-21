/* ============================================================
   cursor.js — Custom cursor system
   Renders a trailing dot + ring that smoothly follow the mouse.
   Reacts to data-cursor="pointer" and data-cursor="text".
   Disabled on touch devices.
   ============================================================ */

window.PortfolioCursor = (function () {
  'use strict';

  var cursor, dot, ring;
  var mouseX = 0, mouseY = 0;
  var dotX = 0, dotY = 0;
  var ringX = 0, ringY = 0;
  var rafId = null;
  var isVisible = false;

  /* ---- Initialisation ---- */

  function init() {
    // Skip entirely on touch devices
    if (window.PortfolioEffects && PortfolioEffects.isTouchDevice()) return;

    cursor = document.querySelector('.custom-cursor');
    dot    = document.querySelector('.cursor-dot');
    ring   = document.querySelector('.cursor-ring');

    if (!cursor || !dot || !ring) return;

    // Global mouse tracking
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseleave', hide);

    // Set up hover state listeners
    setupHoverTargets();

    // Start render loop
    animate();
  }

  /* ---- Mouse tracking ---- */

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) show();
  }

  /* ---- Render loop ---- */

  function animate() {
    // Dot trails tightly behind the cursor
    dotX = PortfolioEffects.lerp(dotX, mouseX, 0.2);
    dotY = PortfolioEffects.lerp(dotY, mouseY, 0.2);

    // Ring follows with a softer, more cinematic lag
    ringX = PortfolioEffects.lerp(ringX, mouseX, 0.08);
    ringY = PortfolioEffects.lerp(ringY, mouseY, 0.08);

    if (dot) {
      dot.style.transform =
        'translate(' + dotX.toFixed(1) + 'px, ' + dotY.toFixed(1) + 'px) translate(-50%, -50%)';
    }
    if (ring) {
      ring.style.transform =
        'translate(' + ringX.toFixed(1) + 'px, ' + ringY.toFixed(1) + 'px) translate(-50%, -50%)';
    }

    rafId = requestAnimationFrame(animate);
  }

  /* ---- Hover states ---- */

  function setupHoverTargets() {
    // Pointer-style expansion for interactive elements
    var pointerEls = document.querySelectorAll('[data-cursor="pointer"]');
    pointerEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });

    // Text-style morph for body text
    var textEls = document.querySelectorAll('[data-cursor="text"]');
    textEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('text'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('text'); });
    });
  }

  /* ---- Visibility ---- */

  function show() {
    if (cursor) cursor.style.opacity = '1';
    isVisible = true;
  }

  function hide() {
    if (cursor) cursor.style.opacity = '0';
    isVisible = false;
  }

  /* ---- Cleanup (optional, for SPA-style tear-down) ---- */

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseenter', show);
    document.removeEventListener('mouseleave', hide);
  }

  /* ---- Public API ---- */

  return {
    init: init,
    destroy: destroy
  };
})();
