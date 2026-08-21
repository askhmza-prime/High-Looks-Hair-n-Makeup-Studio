/* ══════════════════════════════════════════════════
   RD'S MAKEUP STUDIO — gallery.js
   Filter tabs + Image/Video Lightbox
   Click, zoom, prev/next, keyboard, touch swipe
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
  const lbImg = document.getElementById('lbImg');
  const lbLabel = document.getElementById('lbLabel');
  const lbDesc = document.getElementById('lbDesc');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const backdrop = lightbox.querySelector('.lb-backdrop');
  const lbImgWrap = lightbox.querySelector('.lb-img-wrap');


  /*
     Every gallery cell that has data-src can now
     become part of the lightbox.

     This includes:
       - Images
       - Videos
  */

  const lbCells = Array.from(
    document.querySelectorAll('.gallery-cell[data-src]')
  );

  let currentIndex = 0;
  let isOpen = false;
  let activeVideo = null;


  /* ── OPEN LIGHTBOX ─────────────────────────────── */

  function openLightbox(index) {

    currentIndex = index;

    renderLightbox();

    lightbox.classList.add('lb-open');

    document.body.style.overflow = 'hidden';

    isOpen = true;

    lbClose.focus();
  }


  /* ── CLOSE LIGHTBOX ────────────────────────────── */

  function closeLightbox() {

    /*
       Stop video completely when closing.
    */

    if (activeVideo) {

      activeVideo.pause();

      activeVideo.currentTime = 0;

      activeVideo.remove();

      activeVideo = null;
    }


    /*
       Clear image.
    */

    lbImg.src = '';

    lbImg.style.display = 'none';


    /*
       Close UI.
    */

    lightbox.classList.remove('lb-open');

    document.body.style.overflow = '';

    isOpen = false;
  }


  /* ── RENDER CURRENT MEDIA ──────────────────────── */

  function renderLightbox() {

    const cell = lbCells[currentIndex];

    if (!cell) return;


    const src = cell.dataset.src || '';

    const label = cell.dataset.label || '';

    const desc = cell.dataset.desc || '';

    const type = cell.dataset.type || 'image';


    /*
       Stop previous video.
    */

    if (activeVideo) {

      activeVideo.pause();

      activeVideo.currentTime = 0;

      activeVideo.remove();

      activeVideo = null;
    }


    /*
       Hide image by default.
    */

    lbImg.style.display = 'none';

    lbImg.src = '';


    /* ── VIDEO ───────────────────────────────────── */

    if (type === 'video') {

      const video = document.createElement('video');

      video.className = 'lb-video';

      video.src = src;

      video.controls = true;

      video.playsInline = true;

      video.preload = 'metadata';

      video.setAttribute('playsinline', '');

      video.setAttribute('webkit-playsinline', '');

      video.setAttribute(
        'aria-label',
        label || 'Gallery video'
      );


      /*
         Prevent lightbox swipe gestures from
         interfering with video controls.
      */

      video.addEventListener('touchstart', (e) => {
        e.stopPropagation();
      }, { passive: true });


      video.addEventListener('touchend', (e) => {
        e.stopPropagation();
      }, { passive: true });


      lbImgWrap.appendChild(video);

      activeVideo = video;


      /*
         Fade video in.
      */

      video.style.opacity = '0';

      requestAnimationFrame(() => {

        video.style.transition =
          'opacity 0.25s ease';

        video.style.opacity = '1';

      });


      /*
         Clicking the large video itself should NOT
         close the lightbox.
      */

      video.addEventListener('click', (e) => {
        e.stopPropagation();
      });


    }


    /* ── IMAGE ───────────────────────────────────── */

    else {

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

    lbLabel.textContent = label;

    lbDesc.textContent = desc;

    lbCounter.textContent =
      `${currentIndex + 1} / ${lbCells.length}`;


    /* ── ARROW VISIBILITY ────────────────────────── */

    lbPrev.style.opacity =
      currentIndex === 0 ? '0.3' : '1';

    lbNext.style.opacity =
      currentIndex === lbCells.length - 1
        ? '0.3'
        : '1';
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

    if (currentIndex < lbCells.length - 1) {

      currentIndex++;

      renderLightbox();
    }
  }


  /* ── OPEN GALLERY ITEMS ────────────────────────── */

  cells.forEach(cell => {

    if (!cell.dataset.src) return;

    const idx = lbCells.indexOf(cell);


    /*
       ─────────────────────────────────────────────
       VIDEO THUMBNAIL DIRECT OPEN
       ─────────────────────────────────────────────

       The native <video> element can capture the
       first tap on mobile before the gallery cell's
       normal click event fires.

       pointerdown fires early enough to make ANY tap
       on the small video immediately open the
       lightbox.

       Once inside the lightbox, the newly-created
       large video keeps its normal controls.
    */

    const thumbnailVideo = cell.querySelector('video');

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


    /*
       Clicking the gallery card.
    */

    cell.addEventListener('click', (e) => {

      /*
         Don't trigger lightbox from the small
         zoom button twice.
      */

      if (e.target.closest('.gc-zoom')) {
        return;
      }


      /*
         If clicking directly on the small video,
         open the large video lightbox.
      */

      if (e.target.closest('video')) {

        e.preventDefault();

        e.stopPropagation();

        openLightbox(idx);

        return;
      }


      openLightbox(idx);
    });


    /* ── ZOOM BUTTON ─────────────────────────────── */

    const zoomBtn =
      cell.querySelector('.gc-zoom');

    if (zoomBtn) {

      zoomBtn.addEventListener('click', (e) => {

        e.preventDefault();

        e.stopPropagation();

        openLightbox(idx);
      });
    }

  });


  /* ── LIGHTBOX CONTROLS ────────────────────────── */

  lbClose.addEventListener(
    'click',
    closeLightbox
  );


  backdrop.addEventListener(
    'click',
    closeLightbox
  );


  lbPrev.addEventListener(
    'click',
    (e) => {
      e.stopPropagation();
      showPrev();
    }
  );


  lbNext.addEventListener(
    'click',
    (e) => {
      e.stopPropagation();
      showNext();
    }
  );


  /* ── KEYBOARD ──────────────────────────────────── */

  document.addEventListener('keydown', (e) => {

    if (!isOpen) return;


    if (e.key === 'Escape') {

      closeLightbox();

      return;
    }


    if (e.key === 'ArrowLeft') {

      showPrev();

      return;
    }


    if (e.key === 'ArrowRight') {

      showNext();

      return;
    }
  });


  /* ── TOUCH SWIPE ───────────────────────────────── */

  let touchStartX = 0;
  let touchStartY = 0;


  lightbox.addEventListener(
    'touchstart',
    (e) => {

      /*
         Don't start gallery swipe when interacting
         with video controls.
      */

      if (e.target.closest('video')) {
        return;
      }

      touchStartX = e.touches[0].clientX;

      touchStartY = e.touches[0].clientY;

    },
    { passive: true }
  );


  lightbox.addEventListener(
    'touchend',
    (e) => {

      if (e.target.closest('video')) {
        return;
      }

      const diffX =
        touchStartX -
        e.changedTouches[0].clientX;

      const diffY =
        touchStartY -
        e.changedTouches[0].clientY;


      /*
         Only treat mostly-horizontal movement
         as a gallery swipe.
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
