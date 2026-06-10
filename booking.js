/* ==========================================
HIGH LOOKS - WHATSAPP BOOKING SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("bookingForm");

if (!form) {
console.log("Booking form not found");
return;
}

const dateInput = document.getElementById("date");

if (dateInput) {
const today = new Date().toISOString().split("T")[0];
dateInput.min = today;
}

form.addEventListener("submit", function (e) {

e.preventDefault();

const name =
  document.getElementById("name").value.trim();

const phone =
  document.getElementById("phone").value.trim();

const service =
  document.getElementById("service").value;

const date =
  document.getElementById("date").value;

const time =
  document.getElementById("time").value;

const notes =
  document.getElementById("message").value.trim();

if (!name) {
  alert("Please enter your name");
  return;
}

if (!phone) {
  alert("Please enter your phone number");
  return;
}

if (!service) {
  alert("Please select a service");
  return;
}

if (!date) {
  alert("Please select a date");
  return;
}

if (!time) {
  alert("Please select a time");
  return;
}

const whatsappNumber = "919582501552";

const message =

`🌸 NEW APPOINTMENT REQUEST 🌸

Name: ${name}

Phone: ${phone}

Service: ${service}

Preferred Date: ${date}

Preferred Time: ${time}

Additional Notes:
${notes || "None"}

Please contact me to confirm my booking.`;

const whatsappURL =
  "https://wa.me/" +
  whatsappNumber +
  "?text=" +
  encodeURIComponent(message);

window.location.href = whatsappURL;

});

});
