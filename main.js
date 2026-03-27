/* Hannah Barlag — main.js */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileClose = document.querySelector('.mobile-close');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  }
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
  }

  /* ---- Home hero click to navigate ---- */
  const homeHero = document.querySelector('.home-hero');
  if (homeHero) {
    homeHero.addEventListener('click', () => {
      window.location.href = 'fineart.html';
    });
  }

  /* ---- Lightbox ---- */
  const overlay = document.querySelector('.lb-overlay');
  if (!overlay) return;

  const lbImg    = overlay.querySelector('.lb-img');
  const lbCap    = overlay.querySelector('.lb-caption');
  const lbClose  = overlay.querySelector('.lb-close');
  const lbPrev   = overlay.querySelector('.lb-prev');
  const lbNext   = overlay.querySelector('.lb-next');

  let items = [];
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    if (lbCap) lbCap.textContent = item.alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  // Build items list from gallery
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    const fullSrc = el.dataset.full || el.querySelector('img').src;
    const alt = el.querySelector('img').alt || '';
    items.push({ src: fullSrc, alt });

    el.addEventListener('click', () => openLightbox(i));
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', showPrev);
  if (lbNext)  lbNext.addEventListener('click', showNext);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  /* ---- Touch swipe support for mobile ---- */
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Only swipe if vertical movement is less than horizontal (or similar)
    if (Math.abs(diffX) > swipeThreshold && diffX > diffY) {
      if (diffX > 0) {
        // Swiped left → show next
        showNext();
      } else {
        // Swiped right → show previous
        showPrev();
      }
    }
  }

  overlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    if (overlay.classList.contains('open')) {
      handleSwipe();
    }
  }, { passive: true });

  // Also attach to the image for better touch detection
  document.addEventListener('touchstart', (e) => {
    if (overlay.classList.contains('open')) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (overlay.classList.contains('open')) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  }, { passive: true });
})();
