'use strict';

window.SQ = window.SQ || {};

window.SQ.loadRecaptcha = function (callback) {
  if (typeof grecaptcha !== 'undefined') { if (callback) callback(); return; }
  var s = document.createElement('script');
  s.src = 'https://www.google.com/recaptcha/api.js';
  s.async = true; s.defer = true;
  if (callback) s.onload = callback;
  document.head.appendChild(s);
};

window.SQ.initContactForm = function () {
  var form      = document.getElementById('contact-form');
  var submitBtn = document.getElementById('form-submit-btn');
  if (!form || !submitBtn) return;

  var submitted    = false;
  var originalLabel = submitBtn.innerHTML;

  function setState(state, message) {
    switch (state) {
      case 'loading':
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>';
        submitBtn.style.background = '';
        break;
      case 'success':
        submitBtn.disabled = true;
        submitBtn.innerHTML = message || '✓ Brief received, we\'ll respond within 48 hours.';
        submitBtn.style.background = '#1fad4e';
        break;
      case 'error':
        submitBtn.disabled = false;
        submitBtn.innerHTML = message || 'Something went wrong, please try again.';
        submitBtn.style.background = '#EF4444';
        submitted = false;
        var formNext = document.querySelector('.form-next');
        if (formNext) formNext.innerHTML = 'Having trouble? <a href="https://wa.me/' + window.SQ.config.whatsappNumber + '?text=Hi%20SQUARGRAPH%2C%20I%20want%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer" style="color:var(--accent);border-bottom:1px solid var(--accentmuted);">Send us a WhatsApp instead →</a>';
        setTimeout(function () { submitBtn.innerHTML = originalLabel; submitBtn.style.background = ''; }, 5000);
        break;
      default:
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
        submitBtn.style.background = '';
    }
  }

  function getPayload() {
    var raw = Object.fromEntries(new FormData(form).entries());
    return {
      name:       raw.name      || null,
      phone:      (window.iti ? window.iti.getNumber() : raw.phone) || null,
      email:      raw.email     || null,
      company:    raw.company   || null,
      service:    raw.service   || null,
      budget:     raw.budget    || null,
      timeline:   raw.timeline  || null,
      message:    raw.message   || null,
      reference:  raw.reference || null,
      created_at: new Date().toISOString(),
      source_url: window.location.href,
      country:    raw.country   || null,
      city:       raw.city || raw.city_text || null,
      industry:   (document.getElementById('industry-contact') ? document.getElementById('industry-contact').value : null) || null
    };
  }

  function validateForm() {
    var required = form.querySelectorAll('[required]');
    var valid = true;
    required.forEach(function (field) {
      var errContainer = field.closest('form > div') || field.parentNode;
      var err = errContainer.querySelector('.field-error');
      if (field.id === 'phone' && typeof window.iti !== 'undefined') {
        if (!field.value.trim()) {
          field.classList.add('error');
          if (err) { err.textContent = 'Please enter your phone number.'; err.classList.add('visible'); }
          if (valid) field.focus();
          valid = false;
        } else if (!window.iti.isValidNumber()) {
          field.classList.add('error');
          if (err) { err.textContent = 'Please enter a valid ' + window.iti.getSelectedCountryData().name + ' phone number.'; err.classList.add('visible'); }
          if (valid) field.focus();
          valid = false;
        } else {
          field.classList.remove('error');
          if (err) err.classList.remove('visible');
        }
        return;
      }
      if (!field.value.trim()) {
        field.classList.add('error');
        if (err) err.classList.add('visible');
        if (valid) field.focus();
        valid = false;
      } else {
        field.classList.remove('error');
        if (err) err.classList.remove('visible');
      }
    });
    return valid;
  }

  form.querySelectorAll('.form-input').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('error');
      var err = field.parentNode.querySelector('.field-error');
      if (err) err.classList.remove('visible');
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (submitted) return;
    if (!validateForm()) { setState('error', 'Please fill in all required fields.'); return; }

    var emailVal = document.getElementById('email').value.trim();
    if (emailVal && window.SQOtp && !window.SQOtp.isEmailVerified()) {
      window.SQOtp.verifyEmail(emailVal); return;
    }

    var captchaVal = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
    if (!captchaVal) { document.getElementById('captcha-error').style.display = 'block'; return; }
    document.getElementById('captcha-error').style.display = 'none';

    submitted = true;
    setState('loading');

    try {
      await window.__sb.from(window.SQ.config.supabaseTable).insert([getPayload()]);
      setState('success');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_submission_success' });
      form.reset();
    } catch (err) {
      setState('error', 'Submission failed, please try WhatsApp or email directly.');
    }
  });
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initContactForm();
  window.SQ.initITI('phone').then(function (instance) {
    window.iti = instance;
  }).catch(function (e) { console.error('ITI init failed', e); });
  window.SQ.initCountryCity('country-location', 'city');
});
