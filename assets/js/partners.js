(function () {
  'use strict';

  var form = document.getElementById('partner-form');
  var submitButton = document.getElementById('partner-submit');
  var statusLine = document.getElementById('partner-form-status');
  var fallbackLink = document.getElementById('partner-form-fallback');
  var successPanel = document.getElementById('partner-form-success');
  var captchaWrap = document.getElementById('partner-captcha-wrap');
  var phoneInput = document.getElementById('partner-phone');
  var deckInput = document.getElementById('partner-deck');
  var phoneInstance = null;
  var submitting = false;
  var captchaRequested = false;
  var originalButtonText = submitButton ? submitButton.textContent : 'Submit capability';
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var URL_FIELDS = ['partner-website', 'partner-portfolio', 'partner-linkedin', 'partner-instagram', 'partner-showreel', 'partner-case-study'];
  var DECK_EXTENSIONS = ['pdf', 'ppt', 'pptx'];
  var MAX_DECK_SIZE = 10 * 1024 * 1024;

  if (!form || !submitButton) return;

  function loadRecaptcha() {
    if (captchaRequested || typeof window.grecaptcha !== 'undefined') return;
    captchaRequested = true;
    var script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  if ('IntersectionObserver' in window && captchaWrap) {
    var captchaObserver = new IntersectionObserver(function (entries) {
      if (entries[0] && entries[0].isIntersecting) {
        loadRecaptcha();
        captchaObserver.disconnect();
      }
    }, { rootMargin: '300px' });
    captchaObserver.observe(captchaWrap);
  } else {
    loadRecaptcha();
  }

  if (window.SQ && typeof window.SQ.initITI === 'function' && phoneInput) {
    window.SQ.initITI('partner-phone').then(function (instance) {
      phoneInstance = instance;
    }).catch(function () {
      phoneInstance = null;
    });
  }

  function cleanText(value, maxLength) {
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLength || 1800);
  }

  function cleanLongText(value, maxLength) {
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/\r\n?/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, maxLength || 1800);
  }

  function cleanUrl(value) {
    var candidate = String(value || '').trim();
    if (!candidate) return '';
    try {
      var parsed = new URL(candidate);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
      return parsed.href.slice(0, 500);
    } catch (error) {
      return '';
    }
  }

  function fieldError(field, visible) {
    if (!field) return;
    field.classList.toggle('invalid', visible);
    field.setAttribute('aria-invalid', visible ? 'true' : 'false');
    var error = document.getElementById(field.id + '-error');
    if (error) error.classList.toggle('visible', visible);
  }

  function validateDeck() {
    var deckError = document.getElementById('partner-deck-error');
    if (deckError) deckError.textContent = 'Use a PDF, PPT or PPTX file under 10 MB.';
    if (!deckInput || !deckInput.files || !deckInput.files[0]) {
      fieldError(deckInput, false);
      return true;
    }
    var file = deckInput.files[0];
    var extension = (file.name.split('.').pop() || '').toLowerCase();
    var valid = DECK_EXTENSIONS.indexOf(extension) !== -1 && file.size <= MAX_DECK_SIZE;
    fieldError(deckInput, !valid);
    return valid;
  }

  function validateForm() {
    var firstInvalid = null;
    var valid = true;

    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (field) {
      if (field.type === 'checkbox') return;
      var fieldValid = Boolean(String(field.value || '').trim());

      if (field.type === 'email') fieldValid = EMAIL_PATTERN.test(field.value.trim());
      if (field.type === 'url') fieldValid = Boolean(cleanUrl(field.value));
      if (field.id === 'partner-introduction') fieldValid = cleanLongText(field.value).length >= 40;
      if (field.id === 'partner-phone' && phoneInstance) fieldValid = phoneInstance.isValidNumber();

      fieldError(field, !fieldValid);
      if (!fieldValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    URL_FIELDS.forEach(function (id) {
      var field = document.getElementById(id);
      if (!field || !field.value.trim()) return;
      var fieldValid = Boolean(cleanUrl(field.value));
      fieldError(field, !fieldValid);
      if (!fieldValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    var consent = document.getElementById('partner-consent');
    var consentError = document.getElementById('partner-consent-error');
    var consentValid = Boolean(consent && consent.checked);
    if (consent) consent.setAttribute('aria-invalid', consentValid ? 'false' : 'true');
    if (consentError) consentError.classList.toggle('visible', !consentValid);
    if (!consentValid) {
      valid = false;
      if (!firstInvalid) firstInvalid = consent;
    }

    if (!validateDeck()) {
      valid = false;
      if (!firstInvalid) firstInvalid = deckInput;
    }

    if (!valid && firstInvalid) firstInvalid.focus();
    return valid;
  }

  function getFormValues() {
    var raw = Object.fromEntries(new FormData(form).entries());
    return {
      full_name: cleanText(raw.full_name, 120),
      company_name: cleanText(raw.company_name, 160),
      email: cleanText(raw.email, 180).toLowerCase(),
      phone: cleanText(phoneInstance ? phoneInstance.getNumber() : raw.phone, 60),
      city_country: cleanText(raw.city_country, 160),
      website: cleanUrl(raw.website),
      primary_capability: cleanText(raw.primary_capability, 120),
      collaboration_type: cleanText(raw.collaboration_type, 160),
      introduction: cleanLongText(raw.introduction, 1800),
      portfolio_url: cleanUrl(raw.portfolio_url),
      years_experience: cleanText(raw.years_experience, 80),
      typical_project_range: cleanText(raw.typical_project_range, 120),
      availability: cleanText(raw.availability, 120),
      linkedin_url: cleanUrl(raw.linkedin_url) || null,
      instagram_url: cleanUrl(raw.instagram_url) || null,
      showreel_url: cleanUrl(raw.showreel_url) || null,
      case_study_url: cleanUrl(raw.case_study_url) || null,
      additional_notes: cleanLongText(raw.additional_notes, 1800) || null,
      capability_deck_url: null,
      status: 'new',
      source_page: '/partners',
      created_at: new Date().toISOString()
    };
  }

  function uniqueId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function safeFileName(name) {
    var extension = (String(name || '').split('.').pop() || '').toLowerCase();
    var base = String(name || 'capability-deck')
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'capability-deck';
    return base + '.' + extension;
  }

  async function uploadDeck(file) {
    if (!file) return null;
    var cfg = window.SQ.config;
    var objectPath = new Date().toISOString().slice(0, 10) + '/' + uniqueId() + '-' + safeFileName(file.name);
    var response = await fetch(cfg.supabaseUrl + '/storage/v1/object/partner-capability-decks/' + encodeURI(objectPath), {
      method: 'POST',
      headers: {
        apikey: cfg.supabaseKey,
        Authorization: 'Bearer ' + cfg.supabaseKey,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false'
      },
      body: file
    });
    if (!response.ok) throw new Error('deck_upload_unavailable');
    return 'partner-capability-decks/' + objectPath;
  }

  async function insertPartnerApplication(payload) {
    var cfg = window.SQ.config;
    var response = await fetch(cfg.supabaseUrl + '/rest/v1/partner_applications', {
      method: 'POST',
      headers: {
        apikey: cfg.supabaseKey,
        Authorization: 'Bearer ' + cfg.supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify([payload])
    });
    if (!response.ok) {
      var detail = await response.json().catch(function () { return {}; });
      var error = new Error(detail.message || 'partner_table_unavailable');
      error.status = response.status;
      error.code = detail.code || '';
      throw error;
    }
  }

  function fallbackLeadPayload(payload, deckFileName) {
    var context = {
      application_type: 'partner_capability',
      collaboration_type: payload.collaboration_type,
      introduction: payload.introduction,
      years_experience: payload.years_experience,
      availability: payload.availability,
      linkedin_url: payload.linkedin_url,
      instagram_url: payload.instagram_url,
      showreel_url: payload.showreel_url,
      case_study_url: payload.case_study_url,
      additional_notes: payload.additional_notes,
      capability_deck_file: deckFileName || null
    };
    return {
      name: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      company: payload.company_name,
      service: 'Partner application: ' + payload.primary_capability,
      budget: payload.typical_project_range,
      timeline: payload.availability,
      message: JSON.stringify(context),
      reference: payload.portfolio_url,
      created_at: payload.created_at,
      source_url: window.location.href,
      country: payload.city_country,
      city: null,
      industry: payload.primary_capability
    };
  }

  function setSubmitting(active) {
    submitting = active;
    submitButton.disabled = active;
    submitButton.textContent = active ? 'Submitting capability...' : originalButtonText;
  }

  function showError(message, showFallback) {
    statusLine.textContent = message;
    statusLine.classList.add('error');
    fallbackLink.hidden = !showFallback;
  }

  function showSuccess() {
    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
  }

  form.addEventListener('input', function (event) {
    var field = event.target;
    if (field && field.id) fieldError(field, false);
    statusLine.textContent = '';
    statusLine.classList.remove('error');
    fallbackLink.hidden = true;
  });

  form.addEventListener('change', function (event) {
    if (event.target === deckInput) validateDeck();
    if (event.target && event.target.id) fieldError(event.target, false);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (submitting) return;
    fallbackLink.hidden = true;
    statusLine.textContent = '';
    statusLine.classList.remove('error');

    var trap = form.querySelector('[name="company_website_confirm"]');
    if (trap && trap.value) return;

    if (!validateForm()) {
      showError('Please review the highlighted fields.');
      return;
    }

    var emailValue = document.getElementById('partner-email').value.trim();
    if (window.SQOtp && !window.SQOtp.isEmailVerified(emailValue)) {
      window.SQOtp.verifyEmail(emailValue);
      showError('Verify the email code sent to your inbox before submitting.');
      fallbackLink.hidden = true;
      return;
    }

    var captchaToken = typeof window.grecaptcha !== 'undefined' ? window.grecaptcha.getResponse() : '';
    var captchaError = document.getElementById('partner-captcha-error');
    if (!captchaToken) {
      if (captchaError) captchaError.classList.add('visible');
      loadRecaptcha();
      return;
    }
    if (captchaError) captchaError.classList.remove('visible');

    setSubmitting(true);
    statusLine.textContent = 'Securely submitting your capability.';

    var payload = getFormValues();
    var deckFile = deckInput && deckInput.files ? deckInput.files[0] : null;
    var storedIn = 'partner_applications';

    try {
      if (deckFile) {
        try {
          payload.capability_deck_url = await uploadDeck(deckFile);
        } catch (deckError) {
          var deckMessage = document.getElementById('partner-deck-error');
          if (deckMessage) {
            deckMessage.textContent = 'The capability deck could not be uploaded. Remove it and submit again, or try later.';
            deckMessage.classList.add('visible');
          }
          setSubmitting(false);
          showError('Your details are still here. Remove the optional deck and submit again, or continue on WhatsApp.', true);
          return;
        }
      }

      try {
        await insertPartnerApplication(payload);
      } catch (partnerError) {
        storedIn = 'leads_fallback';
        await window.__sb.from(window.SQ.config.supabaseTable).insert([
          fallbackLeadPayload(payload, deckFile ? safeFileName(deckFile.name) : null)
        ]);
      }

      if (window.SQ && typeof window.SQ.trackEvent === 'function') {
        window.SQ.trackEvent('form_partner_application_submit', {
          form_id: 'partner-form',
          primary_capability: payload.primary_capability,
          collaboration_type: payload.collaboration_type,
          submission_store: storedIn,
          page_path: window.location.pathname
        });
      }

      if (typeof window.grecaptcha !== 'undefined') window.grecaptcha.reset();
      showSuccess();
    } catch (error) {
      setSubmitting(false);
      showError('Submission failed. Please try again or continue on WhatsApp.', true);
    }
  });
})();
