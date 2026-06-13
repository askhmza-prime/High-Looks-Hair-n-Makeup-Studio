/* ══════════════════════════════════════════════════
   RD'S MAKEUP STUDIO — gallery.js
   Filter tabs + Lightbox (click, zoom, prev/next, keyboard)
══════════════════════════════════════════════════ */

(function () {

  /* ── FILTER TABS ────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cells      = document.querySelectorAll('.gallery-cell[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cells.forEach((cell, i) => {
        const match = filter === 'all' || cell.dataset.cat === filter;
        cell.classList.toggle('gc-hidden', !match);

        if (match) {
          cell.style.opacity = '0';
          cell.style.transform = 'translateY(16px)';
          setTimeout(() => {
            cell.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            cell.style.opacity    = '1';
            cell.style.transform  = 'translateY(0)';
          }, i * 55);
        }
      });
    });
  });


  /* ── LIGHTBOX ────────────────────────────────────── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbLabel   = document.getElementById('lbLabel');
  const lbDesc    = document.getElementById('lbDesc');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const backdrop  = lightbox.querySelector('.lb-backdrop');

  // Only cells with data-src are lightbox-able
  const lbCells = Array.from(document.querySelectorAll('.gallery-cell[data-src]'));
  let currentIndex = 0;
  let isOpen = false;

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    lbImg.src = '';
    document.body.style.overflow = '';
    isOpen = false;
  }

  function renderLightbox() {
    const cell  = lbCells[currentIndex];
    const src   = cell.dataset.src;
    const label = cell.dataset.label || '';
    const desc  = cell.dataset.desc  || '';

    // Fade transition
    lbImg.style.opacity = '0';
    lbImg.src = src;
    lbImg.onload = () => {
      lbImg.style.transition = 'opacity 0.25s ease';
      lbImg.style.opacity    = '1';
    };

    lbLabel.textContent   = label;
    lbDesc.textContent    = desc;
    lbCounter.textContent = `${currentIndex + 1} / ${lbCells.length}`;

    // Arrow visibility
    lbPrev.style.opacity = currentIndex === 0                  ? '0.3' : '1';
    lbNext.style.opacity = currentIndex === lbCells.length - 1 ? '0.3' : '1';
  }

  function showPrev() {
    if (currentIndex > 0) { currentIndex--; renderLightbox(); }
  }
  function showNext() {
    if (currentIndex < lbCells.length - 1) { currentIndex++; renderLightbox(); }
  }

  // Open on cell click OR zoom button click
  cells.forEach(cell => {
    if (!cell.dataset.src) return;
    const idx = lbCells.indexOf(cell);

    cell.addEventListener('click', (e) => {
      // Don't open if clicking the zoom button (handled separately)
      if (e.target.classList.contains('gc-zoom')) return;
      openLightbox(idx);
    });

    const zoomBtn = cell.querySelector('.gc-zoom');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(idx);
      });
    }
  });

  // Controls
  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  }, { passive: true });

})();
