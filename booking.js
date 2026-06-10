/* ══════════════════════════════════════
   booking.js — form validation + submit
══════════════════════════════════════ */

(function () {
  const form       = document.getElementById('bookingForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnLabel   = submitBtn?.querySelector('.btn-label');
  const btnSpinner = submitBtn?.querySelector('.btn-spinner');
  const successEl  = document.getElementById('formSuccess');

  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ── VALIDATION RULES ──────────────────────────
  const rules = {
    name:    { el: document.getElementById('name'),    errEl: document.getElementById('nameErr'),    validate: v => v.trim().length >= 2    ? '' : 'Please enter your full name.' },
    phone:   { el: document.getElementById('phone'),   errEl: document.getElementById('phoneErr'),   validate: v => /^[0-9]{10}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit mobile number.' },
    service: { el: document.getElementById('service'), errEl: document.getElementById('serviceErr'), validate: v => v ? '' : 'Please select a service.' },
    date:    { el: document.getElementById('date'),    errEl: document.getElementById('dateErr'),    validate: v => v ? '' : 'Please choose a preferred date.' },
    time:    { el: document.getElementById('time'),    errEl: document.getElementById('timeErr'),    validate: v => v ? '' : 'Please choose a preferred time.' },
  };

  function validateField(key) {
    const { el, errEl, validate } = rules[key];
    const msg = validate(el.value);
    errEl.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  // Live validation on blur
  Object.keys(rules).forEach(key => {
    rules[key].el?.addEventListener('blur', () => validateField(key));
    rules[key].el?.addEventListener('input', () => {
      if (rules[key].el.classList.contains('error')) validateField(key);
    });
  });

  // ── SUBMIT ────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!allValid) {
      // Scroll to first error
      const firstErr = form.querySelector('.error');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    btnLabel.hidden    = true;
    btnSpinner.hidden  = false;

    try {
      const data     = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // Show success
        form.hidden      = true;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const json = await response.json().catch(() => ({}));
        if (json.errors) {
          throw new Error(json.errors.map(e => e.message).join(', '));
        } else {
          throw new Error('Submission failed. Please try again or call us directly.');
        }
      }
    } catch (err) {
      console.error('Form error:', err);
      // Re-enable button and show inline error
      submitBtn.disabled = false;
      btnLabel.hidden    = false;
      btnSpinner.hidden  = true;

      // Show a friendly banner
      let errorBanner = document.getElementById('formGlobalErr');
      if (!errorBanner) {
        errorBanner = document.createElement('p');
        errorBanner.id = 'formGlobalErr';
        errorBanner.style.cssText = 'color:#e05c6a;font-size:0.85rem;text-align:center;margin-top:12px;padding:12px;background:rgba(224,92,106,0.1);border-radius:8px;border:1px solid rgba(224,92,106,0.3)';
        submitBtn.insertAdjacentElement('afterend', errorBanner);
      }
      errorBanner.textContent = err.message || 'Something went wrong. Please call us at 095825 01552.';
    }
  });
})();
