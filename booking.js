/* ══════════════════════════════════════ booking.js — WhatsApp Booking System ══════════════════════════════════════ */
(function () {
const form = document.getElementById('bookingForm'); const submitBtn = document.getElementById('submitBtn'); const btnLabel = submitBtn?.querySelector('.btn-label'); const btnSpinner = submitBtn?.querySelector('.btn-spinner');
if (!form) return;
// Studio WhatsApp Number const WHATSAPP_NUMBER = "919582501552";
// Set minimum date to today const dateInput = document.getElementById('date');
if (dateInput) { const today = new Date().toISOString().split('T')[0]; dateInput.setAttribute('min', today); }
// ── VALIDATION ─────────────────────
const rules = { name: { el: document.getElementById('name'), errEl: document.getElementById('nameErr'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
phone: {
  el: document.getElementById('phone'),
  errEl: document.getElementById('phoneErr'),
  validate: v =>
    /^[0-9]{10}$/.test(v.trim())
      ? ''
      : 'Enter a valid 10-digit mobile number.'
},

service: {
  el: document.getElementById('service'),
  errEl: document.getElementById('serviceErr'),
  validate: v =>
    v
      ? ''
      : 'Please select a service.'
},

date: {
  el: document.getElementById('date'),
  errEl: document.getElementById('dateErr'),
  validate: v =>
    v
      ? ''
      : 'Please choose a preferred date.'
},

time: {
  el: document.getElementById('time'),
  errEl: document.getElementById('timeErr'),
  validate: v =>
    v
      ? ''
      : 'Please choose a preferred time.'
}
};
function validateField(key) { const { el, errEl, validate } = rules[key];
const msg = validate(el.value);

errEl.textContent = msg;

el.classList.toggle('error', !!msg);

return !msg;
}
Object.keys(rules).forEach(key => {
rules[key].el?.addEventListener('blur', () => {
  validateField(key);
});

rules[key].el?.addEventListener('input', () => {
  if (rules[key].el.classList.contains('error')) {
    validateField(key);
  }
});
});
// ── SUBMIT TO WHATSAPP ─────────────
form.addEventListener('submit', function (e) {
  alert("FORM SUBMITTED");
e.preventDefault();

const allValid = Object.keys(rules)
  .map(validateField)
  .every(Boolean);

if (!allValid) {

  const firstErr = form.querySelector('.error');

  firstErr?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  return;
}

submitBtn.disabled = true;

btnLabel.hidden = true;

btnSpinner.hidden = false;

const name =
  document.getElementById('name').value;

const phone =
  document.getElementById('phone').value;

const service =
  document.getElementById('service').value;

const date =
  document.getElementById('date').value;

const time =
  document.getElementById('time').value;

const notes =
  document.getElementById('message').value;

const whatsappMessage =
`🌸 NEW APPOINTMENT REQUEST 🌸
Name: ${name}
Phone: ${phone}
Service: ${service}
Preferred Date: ${date}
Preferred Time: ${time}
Additional Notes: ${notes || "None"}
Please contact me to confirm my booking.`;
const whatsappURL =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

window.open(
  whatsappURL,
  '_blank'
);

btnSpinner.hidden = true;

btnLabel.hidden = false;

submitBtn.disabled = false;
});
})();
