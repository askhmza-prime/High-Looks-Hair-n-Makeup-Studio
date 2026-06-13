/* ═══════════════════════════════════════════════════
   HIGH LOOKS HAIR & MAKEUP STUDIO
   script.js — interactions, scroll effects, nav
═══════════════════════════════════════════════════ */

/* ── NAVBAR: scroll shadow + shrink ─────────────── */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load


/* ── HAMBURGER MENU ──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});


/* ── SCROLL REVEAL (IntersectionObserver) ────────── */
const revealTargets = document.querySelectorAll(
  '.service-card, .review-card, .about-grid, .contact-grid, .section-title, .section-eyebrow'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Inject base reveal styles dynamically
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .service-card,
  .review-card,
  .about-grid,
  .contact-grid,
  .section-title,
  .section-eyebrow {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .service-card.revealed,
  .review-card.revealed,
  .about-grid.revealed,
  .contact-grid.revealed,
  .section-title.revealed,
  .section-eyebrow.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  /* Stagger service cards */
  .service-card:nth-child(1) { transition-delay: 0s; }
  .service-card:nth-child(2) { transition-delay: 0.07s; }
  .service-card:nth-child(3) { transition-delay: 0.14s; }
  .service-card:nth-child(4) { transition-delay: 0.21s; }
  .service-card:nth-child(5) { transition-delay: 0.28s; }
  .service-card:nth-child(6) { transition-delay: 0.35s; }
  .service-card:nth-child(7) { transition-delay: 0.42s; }
  .service-card:nth-child(8) { transition-delay: 0.49s; }
  /* Stagger review cards */
  .review-card:nth-child(1) { transition-delay: 0s; }
  .review-card:nth-child(2) { transition-delay: 0.1s; }
  .review-card:nth-child(3) { transition-delay: 0.2s; }
`;
document.head.appendChild(revealStyle);

revealTargets.forEach(el => revealObserver.observe(el));


/* ── STAT COUNTER ANIMATION ──────────────────────── */
function animateCounter(el, target, suffix = '', duration = 1600) {
  const isFloat = target % 1 !== 0;
  const start   = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = isFloat
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const rawText = el.textContent.trim();
        const num     = parseFloat(rawText);
        const suffix  = rawText.includes('+') ? '+' : '';
        animateCounter(el, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


/* ── GALLERY ITEMS: hover parallax ──────────────── */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect   = item.getBoundingClientRect();
    const x      = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y      = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
    item.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.backgroundPosition = 'center center';
  });
});


/* ── ACTIVE NAV LINK (scroll spy) ────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle(
          'nav-active',
          a.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => spyObserver.observe(s));

// Inject nav-active style
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .nav-links a.nav-active {
    color: var(--gold) !important;
  }
`;
document.head.appendChild(activeStyle);


/* ── SMOOTH SCROLL OFFSET (fixed navbar) ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── REDUCED MOTION: disable animations ─────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', 'none');
  document.querySelectorAll('.hero-orb, .art-center-icon, .map-pin').forEach(el => {
    el.style.animation = 'none';
  });
}


/* ── INIT LOG ────────────────────────────────────── */
console.log('✦ High Looks Hair & Makeup Studio — site loaded');
