(function () {
  'use strict';

  var form = document.getElementById('careers-form');
  var submitButton = document.getElementById('careers-submit');
  var statusLine = document.getElementById('careers-form-status');
  var fallbackLink = document.getElementById('careers-form-fallback');
  var successPanel = document.getElementById('careers-form-success');
  var captchaWrap = document.getElementById('careers-captcha-wrap');
  var emailInput = document.getElementById('careers-email');
  var phoneInput = document.getElementById('careers-phone');
  var countryInput = document.getElementById('careers-country');
  var cityInput = document.getElementById('careers-city');
  var cityTextInput = document.getElementById('careers-city-text');
  var cvInput = document.getElementById('careers-cv');
  var phoneInstance = null;
  var submitting = false;
  var started = false;
  var captchaRequested = false;
  var originalButtonText = submitButton ? submitButton.textContent : 'Introduce Yourself';
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var CV_EXTENSIONS = ['pdf', 'doc', 'docx'];
  var MAX_CV_SIZE = 5 * 1024 * 1024;

  function track(name, params) {
    if (window.SQ && typeof window.SQ.trackEvent === 'function') {
      window.SQ.trackEvent(name, Object.assign({ page_path: window.location.pathname }, params || {}));
    }
  }

  track('careers_page_view');

  document.querySelectorAll('[data-careers-role-id]').forEach(function (link) {
    link.addEventListener('click', function () {
      track(link.matches('[data-careers-apply]') ? 'careers_apply_click' : 'careers_role_click', {
        role_id: link.getAttribute('data-careers-role-id') || undefined
      });
    });
  });

  ['careers-linkedin', 'careers-portfolio'].forEach(function (id) {
    var field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('click', function onFirstClick() {
      track(id === 'careers-linkedin' ? 'careers_linkedin_click' : 'careers_portfolio_click', { form_id: 'careers-form' });
      field.removeEventListener('click', onFirstClick);
    });
  });

  if (!form || !submitButton) return;

  if (window.SQOtp && typeof window.SQOtp.init === 'function') {
    window.SQOtp.init({ emailInputId: 'careers-email' });
  }

  if (window.SQ && typeof window.SQ.initCountryCity === 'function' && countryInput && cityInput) {
    window.SQ.initCountryCity('careers-country', 'careers-city');
    countryInput.addEventListener('change', function () {
      var hasPresetCities = Boolean(window.SQ.config.cityData[countryInput.value]);
      cityInput.disabled = !hasPresetCities;
      fieldError(cityInput, false);
      fieldError(cityTextInput, false);
    });
  }

  if (window.SQ && typeof window.SQ.initITI === 'function' && phoneInput) {
    window.SQ.initITI('careers-phone').then(function (instance) {
      phoneInstance = instance;
    }).catch(function () {
      phoneInstance = null;
    });
  }

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
    }, { rootMargin: '320px' });
    captchaObserver.observe(captchaWrap);
  } else {
    loadRecaptcha();
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

  function validateCv() {
    var cvError = document.getElementById('careers-cv-error');
    if (!cvInput || !cvInput.files || !cvInput.files[0]) {
      fieldError(cvInput, false);
      return true;
    }
    var file = cvInput.files[0];
    var extension = (file.name.split('.').pop() || '').toLowerCase();
    var valid = CV_EXTENSIONS.indexOf(extension) !== -1 && file.size <= MAX_CV_SIZE;
    if (cvError) cvError.textContent = 'Use a PDF, DOC or DOCX file under 5 MB.';
    fieldError(cvInput, !valid);
    return valid;
  }

  function validateForm() {
    var firstInvalid = null;
    var valid = true;

    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (field) {
      if (field.type === 'checkbox') return;
      var fieldValid = Boolean(String(field.value || '').trim());
      if (field.type === 'email') fieldValid = EMAIL_PATTERN.test(field.value.trim());
      if (field.id === 'careers-introduction') fieldValid = cleanLongText(field.value).length >= 40;
      if (field.id === 'careers-phone' && phoneInstance) fieldValid = phoneInstance.isValidNumber();
      fieldError(field, !fieldValid);
      if (!fieldValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    ['careers-linkedin', 'careers-portfolio'].forEach(function (id) {
      var field = document.getElementById(id);
      if (!field || !field.value.trim()) return;
      var fieldValid = Boolean(cleanUrl(field.value));
      fieldError(field, !fieldValid);
      if (!fieldValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    var needsCityText = cityInput && (cityInput.style.display === 'none' || cityInput.value === 'Other');
    var activeCityInput = needsCityText ? cityTextInput : cityInput;
    var cityValid = Boolean(activeCityInput && String(activeCityInput.value || '').trim());
    if (activeCityInput) fieldError(activeCityInput, !cityValid);
    if (!cityValid) {
      valid = false;
      if (!firstInvalid) firstInvalid = activeCityInput || countryInput;
    }

    var consent = document.getElementById('careers-consent');
    var consentError = document.getElementById('careers-consent-error');
    var consentValid = Boolean(consent && consent.checked);
    if (consent) consent.setAttribute('aria-invalid', consentValid ? 'false' : 'true');
    if (consentError) consentError.classList.toggle('visible', !consentValid);
    if (!consentValid) {
      valid = false;
      if (!firstInvalid) firstInvalid = consent;
    }

    if (!validateCv()) {
      valid = false;
      if (!firstInvalid) firstInvalid = cvInput;
    }

    if (!valid && firstInvalid) firstInvalid.focus();
    return valid;
  }

  function getFormValues() {
    var raw = Object.fromEntries(new FormData(form).entries());
    var city = cleanText(raw.city === 'Other' || !raw.city ? raw.city_text : raw.city, 120);
    return {
      full_name: cleanText(raw.full_name, 120),
      email: cleanText(raw.email, 180).toLowerCase(),
      phone: cleanText(phoneInstance ? phoneInstance.getNumber() : raw.phone, 60),
      location: cleanText([city, raw.country].filter(Boolean).join(', '), 180),
      discipline: cleanText(raw.discipline, 120),
      experience_years: cleanText(raw.experience_years, 80),
      linkedin_url: cleanUrl(raw.linkedin_url) || null,
      portfolio_url: cleanUrl(raw.portfolio_url) || null,
      opportunity_type: cleanText(raw.opportunity_type, 100),
      working_model: cleanText(raw.working_model, 80),
      introduction: cleanLongText(raw.introduction, 1800),
      cv_url: null,
      role_id: cleanText(new URLSearchParams(window.location.search).get('role'), 120) || null,
      consent: true,
      source: '/careers',
      status: 'New',
      created_at: new Date().toISOString()
    };
  }

  function uniqueId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function safeFileName(name) {
    var extension = (String(name || '').split('.').pop() || '').toLowerCase();
    var base = String(name || 'cv')
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'cv';
    return base + '.' + extension;
  }

  function accessToken() {
    if (!window.SQOtp || typeof window.SQOtp.getAccessToken !== 'function') return '';
    return window.SQOtp.getAccessToken() || '';
  }

  async function createCvReviewUrl(objectPath, token) {
    if (!objectPath || !token) return null;
    var cfg = window.SQ.config;
    var response = await fetch(cfg.supabaseUrl + '/storage/v1/object/sign/careers-cvs/' + encodeURI(objectPath), {
      method: 'POST',
      headers: { apikey: cfg.supabaseKey, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn: 31536000 })
    });
    if (!response.ok) return null;
    var data = await response.json().catch(function () { return {}; });
    var signedPath = data.signedURL || data.signedUrl || '';
    if (!signedPath) return null;
    if (signedPath.indexOf('http') === 0) return signedPath;
    if (signedPath.indexOf('/storage/v1/') === 0) return cfg.supabaseUrl + signedPath;
    return cfg.supabaseUrl + '/storage/v1' + (signedPath.charAt(0) === '/' ? signedPath : '/' + signedPath);
  }

  async function uploadCv(file) {
    if (!file) return null;
    var cfg = window.SQ.config;
    var token = accessToken();
    if (!token) throw new Error('verified_session_required');
    var objectPath = new Date().toISOString().slice(0, 10) + '/' + uniqueId() + '-' + safeFileName(file.name);
    var response = await fetch(cfg.supabaseUrl + '/storage/v1/object/careers-cvs/' + encodeURI(objectPath), {
      method: 'POST',
      headers: {
        apikey: cfg.supabaseKey,
        Authorization: 'Bearer ' + token,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false'
      },
      body: file
    });
    if (!response.ok) throw new Error('cv_upload_unavailable');
    var reviewUrl = await createCvReviewUrl(objectPath, token);
    if (!reviewUrl) throw new Error('cv_review_link_unavailable');
    return reviewUrl;
  }

  async function insertCareerApplication(payload) {
    var cfg = window.SQ.config;
    var token = accessToken();
    var response = await fetch(cfg.supabaseUrl + '/rest/v1/careers_applications', {
      method: 'POST',
      headers: {
        apikey: cfg.supabaseKey,
        Authorization: 'Bearer ' + (token || cfg.supabaseKey),
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify([payload])
    });
    if (!response.ok) throw new Error('careers_table_unavailable');
  }

  function fallbackLeadPayload(payload, cvFileName) {
    var locationParts = payload.location.split(',').map(function (part) { return part.trim(); }).filter(Boolean);
    var country = locationParts.length > 1 ? locationParts.pop() : '';
    var city = locationParts.join(', ');
    return {
      name: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      company: null,
      service: 'Careers: ' + payload.opportunity_type,
      budget: null,
      timeline: payload.working_model,
      message: JSON.stringify({
        application_type: 'career_application',
        discipline: payload.discipline,
        experience_years: payload.experience_years,
        linkedin_url: payload.linkedin_url,
        portfolio_url: payload.portfolio_url,
        introduction: payload.introduction,
        role_id: payload.role_id,
        cv_file: cvFileName || null,
        cv_url: payload.cv_url || null
      }),
      reference: payload.portfolio_url || payload.linkedin_url,
      created_at: payload.created_at,
      source_url: window.location.href,
      country: country,
      city: city,
      industry: payload.discipline
    };
  }

  function setSubmitting(active) {
    submitting = active;
    submitButton.disabled = active;
    submitButton.textContent = active ? 'Submitting...' : originalButtonText;
  }

  function showError(message, showFallback, errorType) {
    statusLine.textContent = message;
    statusLine.classList.add('error');
    fallbackLink.hidden = !showFallback;
    track('careers_application_error', { form_id: 'careers-form', error_type: errorType || 'submission' });
  }

  function showSuccess() {
    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
  }

  form.addEventListener('input', function (event) {
    if (!started) {
      started = true;
      track('careers_introduce_yourself_start', { form_id: 'careers-form', interaction: 'form_start' });
    }
    var field = event.target;
    if (field && field.id) fieldError(field, false);
    statusLine.textContent = '';
    statusLine.classList.remove('error');
    fallbackLink.hidden = true;
  });

  form.addEventListener('change', function (event) {
    if (event.target === cvInput) validateCv();
    if (event.target && event.target.id) fieldError(event.target, false);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (submitting) return;
    fallbackLink.hidden = true;
    statusLine.textContent = '';
    statusLine.classList.remove('error');

    var trap = form.querySelector('[name="company_confirm"]');
    if (trap && trap.value) return;

    if (!validateForm()) {
      showError('Please review the highlighted fields.', false, 'validation');
      return;
    }

    var emailValue = emailInput.value.trim();
    if (window.SQOtp && !window.SQOtp.isEmailVerified(emailValue)) {
      window.SQOtp.verifyEmail(emailValue);
      showError('Verify the email code sent to your inbox before submitting.', false, 'email_verification');
      return;
    }

    var captchaToken = typeof window.grecaptcha !== 'undefined' ? window.grecaptcha.getResponse() : '';
    var captchaError = document.getElementById('careers-captcha-error');
    if (!captchaToken) {
      if (captchaError) captchaError.classList.add('visible');
      loadRecaptcha();
      showError('Complete the captcha before submitting.', false, 'captcha');
      return;
    }
    if (captchaError) captchaError.classList.remove('visible');

    setSubmitting(true);
    statusLine.textContent = 'Securely submitting your introduction.';
    var payload = getFormValues();
    var cvFile = cvInput && cvInput.files ? cvInput.files[0] : null;
    var storedIn = 'careers_applications';

    try {
      if (cvFile) {
        try {
          payload.cv_url = await uploadCv(cvFile);
        } catch (cvError) {
          var cvMessage = document.getElementById('careers-cv-error');
          if (cvMessage) {
            cvMessage.textContent = 'The CV could not be uploaded. Remove it and submit again, or try later.';
            cvMessage.classList.add('visible');
          }
          setSubmitting(false);
          showError('Your details are still here. Remove the optional CV and submit again, or continue on WhatsApp.', true, 'cv_upload');
          return;
        }
      }

      try {
        await insertCareerApplication(payload);
      } catch (tableError) {
        storedIn = 'leads_fallback';
        await window.__sb.from(window.SQ.config.supabaseTable).insert([
          fallbackLeadPayload(payload, cvFile ? safeFileName(cvFile.name) : null)
        ]);
      }

      track('careers_application_submit', {
        form_id: 'careers-form',
        discipline: payload.discipline,
        opportunity_type: payload.opportunity_type,
        submission_store: storedIn
      });

      if (typeof window.grecaptcha !== 'undefined') window.grecaptcha.reset();
      showSuccess();
    } catch (error) {
      setSubmitting(false);
      showError('Submission failed. Please try again or continue on WhatsApp.', true, 'submission');
    }
  });
})();
