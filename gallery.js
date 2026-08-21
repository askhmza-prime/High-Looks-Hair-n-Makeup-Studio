/* ══════════════════════════════════════════════════
   RD'S MAKEUP STUDIO — gallery.js
   Gallery + Services Image/Video Lightbox
   Filter tabs, zoom, prev/next, keyboard, touch
══════════════════════════════════════════════════ */

(function () {

  /* ── FILTER TABS ────────────────────────────────── */

  const filterBtns = document.querySelectorAll('.filter-btn');
  const cells = document.querySelectorAll('.gallery-cell[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cells.forEach((cell, i) => {

        const match =
          filter === 'all' ||
          cell.dataset.cat === filter;

        cell.classList.toggle('gc-hidden', !match);

        if (match) {

          cell.style.opacity = '0';
          cell.style.transform = 'translateY(16px)';

          setTimeout(() => {

            cell.style.transition =
              'opacity 0.35s ease, transform 0.35s ease';

            cell.style.opacity = '1';
            cell.style.transform = 'translateY(0)';

          }, i * 55);
        }
      });
    });
  });


  /* ── LIGHTBOX ELEMENTS ─────────────────────────── */

  const lightbox = document.getElementById('lightbox');

  /*
     If this page doesn't have a lightbox,
     safely stop here.
  */
  if (!lightbox) return;

  const lbImg = document.getElementById('lbImg');
  const lbLabel = document.getElementById('lbLabel');
  const lbDesc = document.getElementById('lbDesc');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  const backdrop =
    lightbox.querySelector('.lb-backdrop');

  const lbImgWrap =
    lightbox.querySelector('.lb-img-wrap');


  /* ── LIGHTBOX MEDIA ───────────────────────────── */

  /*
     Gallery images/videos AND Services images
     can now use the same lightbox.
  */

  const lbCells = Array.from(
    document.querySelectorAll(
      '.gallery-cell[data-src], .svc-img-slot[data-src]'
    )
  );


  let currentIndex = 0;
  let isOpen = false;
  let activeVideo = null;


  /* ── OPEN LIGHTBOX ─────────────────────────────── */

  function openLightbox(index) {

    if (!lbCells[index]) return;

    currentIndex = index;

    renderLightbox();

    lightbox.classList.add('lb-open');

    lightbox.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

    isOpen = true;

    if (lbClose) {
      lbClose.focus();
    }
  }


  /* ── CLOSE LIGHTBOX ────────────────────────────── */

  function closeLightbox() {

    /* Stop active video */

    if (activeVideo) {

      activeVideo.pause();

      activeVideo.currentTime = 0;

      activeVideo.remove();

      activeVideo = null;
    }


    /* Clear image */

    if (lbImg) {

      lbImg.src = '';

      lbImg.style.display = 'none';
    }


    /* Close UI */

    lightbox.classList.remove('lb-open');

    lightbox.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    isOpen = false;
  }


  /* ── RENDER CURRENT MEDIA ──────────────────────── */

  function renderLightbox() {

    const cell = lbCells[currentIndex];

    if (!cell) return;


    const src =
      cell.dataset.src || '';

    const label =
      cell.dataset.label || '';

    const desc =
      cell.dataset.desc || '';

    const type =
      cell.dataset.type || 'image';


    /* Stop previous video */

    if (activeVideo) {

      activeVideo.pause();

      activeVideo.currentTime = 0;

      activeVideo.remove();

      activeVideo = null;
    }


    /* Hide image by default */

    if (lbImg) {

      lbImg.style.display = 'none';

      lbImg.src = '';
    }


    /* ══════════════════════════════════════════════
       VIDEO
    ══════════════════════════════════════════════ */

    if (type === 'video') {

      const video =
        document.createElement('video');

      video.className = 'lb-video';

      video.src = src;

      video.controls = true;

      video.playsInline = true;

      video.preload = 'metadata';

      video.setAttribute(
        'playsinline',
        ''
      );

      video.setAttribute(
        'webkit-playsinline',
        ''
      );

      video.setAttribute(
        'aria-label',
        label || 'Gallery video'
      );


      /*
         Don't let gallery swipe interfere
         with the video's controls.
      */

      video.addEventListener(
        'touchstart',
        (e) => {
          e.stopPropagation();
        },
        { passive: true }
      );


      video.addEventListener(
        'touchend',
        (e) => {
          e.stopPropagation();
        },
        { passive: true }
      );


      /*
         Prevent clicks inside the large video
         from closing the lightbox.
      */

      video.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        }
      );


      lbImgWrap.appendChild(video);

      activeVideo = video;


      /* Fade video in */

      video.style.opacity = '0';

      requestAnimationFrame(() => {

        video.style.transition =
          'opacity 0.25s ease';

        video.style.opacity = '1';

      });

    }


    /* ══════════════════════════════════════════════
       IMAGE
    ══════════════════════════════════════════════ */

    else {

      if (!lbImg) return;

      lbImg.style.display = 'block';

      lbImg.style.opacity = '0';

      lbImg.src = src;

      lbImg.alt = label;


      lbImg.onload = () => {

        lbImg.style.transition =
          'opacity 0.25s ease';

        lbImg.style.opacity = '1';

      };
    }


    /* ── CAPTION ─────────────────────────────────── */

    if (lbLabel) {
      lbLabel.textContent = label;
    }

    if (lbDesc) {
      lbDesc.textContent = desc;
    }

    if (lbCounter) {

      lbCounter.textContent =
        `${currentIndex + 1} / ${lbCells.length}`;
    }


    /* ── ARROW VISIBILITY ────────────────────────── */

    if (lbPrev) {

      lbPrev.style.opacity =
        currentIndex === 0
          ? '0.3'
          : '1';
    }

    if (lbNext) {

      lbNext.style.opacity =
        currentIndex === lbCells.length - 1
          ? '0.3'
          : '1';
    }
  }


  /* ── PREVIOUS ──────────────────────────────────── */

  function showPrev() {

    if (currentIndex > 0) {

      currentIndex--;

      renderLightbox();
    }
  }


  /* ── NEXT ──────────────────────────────────────── */

  function showNext() {

    if (
      currentIndex <
      lbCells.length - 1
    ) {

      currentIndex++;

      renderLightbox();
    }
  }


  /* ── OPEN GALLERY + SERVICES ITEMS ─────────────── */

  lbCells.forEach((cell, idx) => {

    /*
       Services images are .svc-img-slot.
       Gallery items are .gallery-cell.
    */

    const isServiceImage =
      cell.classList.contains('svc-img-slot');


    /* ── Services image ─────────────────────────── */

    if (isServiceImage) {

      cell.addEventListener(
        'click',
        (e) => {

          e.preventDefault();

          openLightbox(idx);
        }
      );


      /*
         Keyboard support:
         Enter or Space opens image.
      */

      cell.addEventListener(
        'keydown',
        (e) => {

          if (
            e.key === 'Enter' ||
            e.key === ' '
          ) {

            e.preventDefault();

            openLightbox(idx);
          }
        }
      );

      return;
    }


    /* ── Gallery item ───────────────────────────── */

    cell.addEventListener(
      'click',
      (e) => {

        /*
           Don't trigger lightbox twice from
           the small zoom button.
        */

        if (
          e.target.closest('.gc-zoom')
        ) {
          return;
        }


        /*
           Small gallery video:
           tapping anywhere immediately opens
           the large video lightbox.
        */

        if (
          e.target.closest('video')
        ) {

          e.preventDefault();

          e.stopPropagation();

          openLightbox(idx);

          return;
        }


        openLightbox(idx);
      }
    );


    /* ── Gallery video direct touch ──────────────── */

    const thumbnailVideo =
      cell.querySelector('video');


    if (thumbnailVideo) {

      thumbnailVideo.addEventListener(
        'pointerdown',
        (e) => {

          e.preventDefault();

          e.stopPropagation();

          openLightbox(idx);
        }
      );
    }


    /* ── Zoom button ────────────────────────────── */

    const zoomBtn =
      cell.querySelector('.gc-zoom');


    if (zoomBtn) {

      zoomBtn.addEventListener(
        'click',
        (e) => {

          e.preventDefault();

          e.stopPropagation();

          openLightbox(idx);
        }
      );
    }

  });


  /* ── LIGHTBOX CONTROLS ────────────────────────── */

  if (lbClose) {

    lbClose.addEventListener(
      'click',
      closeLightbox
    );
  }


  if (backdrop) {

    backdrop.addEventListener(
      'click',
      closeLightbox
    );
  }


  if (lbPrev) {

    lbPrev.addEventListener(
      'click',
      (e) => {

        e.stopPropagation();

        showPrev();
      }
    );
  }


  if (lbNext) {

    lbNext.addEventListener(
      'click',
      (e) => {

        e.stopPropagation();

        showNext();
      }
    );
  }


  /* ── KEYBOARD ──────────────────────────────────── */

  document.addEventListener(
    'keydown',
    (e) => {

      if (!isOpen) return;


      /* Escape */

      if (e.key === 'Escape') {

        closeLightbox();

        return;
      }


      /* Previous */

      if (e.key === 'ArrowLeft') {

        showPrev();

        return;
      }


      /* Next */

      if (e.key === 'ArrowRight') {

        showNext();

        return;
      }
    }
  );


  /* ── TOUCH SWIPE ───────────────────────────────── */

  let touchStartX = 0;
  let touchStartY = 0;


  lightbox.addEventListener(
    'touchstart',
    (e) => {

      /*
         Don't start gallery swipe when
         interacting with a video.
      */

      if (
        e.target.closest('video')
      ) {
        return;
      }


      if (!e.touches.length) return;

      touchStartX =
        e.touches[0].clientX;

      touchStartY =
        e.touches[0].clientY;

    },
    { passive: true }
  );


  lightbox.addEventListener(
    'touchend',
    (e) => {

      if (
        e.target.closest('video')
      ) {
        return;
      }


      if (!e.changedTouches.length) return;


      const diffX =
        touchStartX -
        e.changedTouches[0].clientX;

      const diffY =
        touchStartY -
        e.changedTouches[0].clientY;


      /*
         Only horizontal movement counts
         as gallery navigation.
      */

      if (
        Math.abs(diffX) > 50 &&
        Math.abs(diffX) > Math.abs(diffY)
      ) {

        if (diffX > 0) {

          showNext();

        } else {

          showPrev();
        }
      }

    },
    { passive: true }
  );


})();
