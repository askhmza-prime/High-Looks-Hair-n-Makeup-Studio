/* ══════════════════════════════════════
   gallery.js — filter tabs
══════════════════════════════════════ */

(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cells      = document.querySelectorAll('.gallery-cell[data-cat]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cells
      cells.forEach(cell => {
        const match = filter === 'all' || cell.dataset.cat === filter;
        cell.classList.toggle('hidden', !match);

        // Re-trigger reveal animation
        if (match) {
          cell.style.opacity = '0';
          cell.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            cell.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            cell.style.opacity = '1';
            cell.style.transform = 'scale(1)';
          });
        }
      });
    });
  });
})();
