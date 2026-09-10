'use strict';

window.SQ = window.SQ || {};

window.SQ.trackEvent = function (name, params) {
  if (!name) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, params || {}));
};

window.SQ.getCaptchaToken = function () {
  try {
    return typeof window.grecaptcha !== 'undefined' && typeof window.grecaptcha.getResponse === 'function'
      ? window.grecaptcha.getResponse()
      : '';
  } catch (error) {
    return '';
  }
};

window.SQ.getVerifiedEmailToken = function () {
  try {
    return window.SQOtp && typeof window.SQOtp.getAccessToken === 'function'
      ? window.SQOtp.getAccessToken() || ''
      : '';
  } catch (error) {
    return '';
  }
};

window.SQ.submitPublicRows = async function (table, rows) {
  var cfg = window.SQ.config || {};
  if (!cfg.publicFormEndpoint) throw new Error('Public form gateway is not configured.');
  var response = await fetch(cfg.publicFormEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      table: table,
      rows: rows,
      captcha_token: window.SQ.getCaptchaToken(),
      email_access_token: window.SQ.getVerifiedEmailToken(),
      page: { path: window.location.pathname, href: window.location.href }
    })
  });
  var data = await response.json().catch(function () { return {}; });
  if (!response.ok || data.ok !== true) throw new Error(data.error || 'Submission failed');
  return { error: null, data: data.data || null };
};

window.__sb = {
  from: function (table) {
    return {
      insert: async function (rows) {
        var cfg = window.SQ.config;
        if (table === cfg.supabaseTable || table === 'leads') {
          return window.SQ.submitPublicRows(table, rows);
        }
        var res = await fetch(cfg.supabaseUrl + '/rest/v1/' + table, {
          method: 'POST',
          headers: {
            apikey: cfg.supabaseKey,
            Authorization: 'Bearer ' + cfg.supabaseKey,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(rows)
        });
        if (!res.ok) throw new Error('Insert failed');
        return { error: null };
      }
    };
  }
};

window.SQ.initEventTracking = function () {
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button, [role="button"]');
    if (!el) return;
    var eventName = el.getAttribute('data-sq-event') || '';
    var href = el.getAttribute('href') || '';
    var onclick = el.getAttribute('onclick') || '';
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    var url = null;
    if (href) {
      try { url = new URL(href, window.location.origin); } catch (err) { url = null; }
    }
    if (!eventName && url) {
      var host = url.hostname.toLowerCase();
      var path = url.pathname.replace(/\/+$/, '') || '/';
      var hash = url.hash.toLowerCase();
      if (url.protocol === 'mailto:') eventName = 'email_click';
      else if (url.protocol === 'tel:') eventName = 'phone_click';
      else if (host === 'wa.me' || host.indexOf('whatsapp.com') !== -1) eventName = 'whatsapp_click';
      else if ((path === '/audit' || path === '/audit.html') && text.indexOf('audit') !== -1) eventName = 'audit_start_click';
      else if ((path === '/discovery' || path === '/discovery.html') && (text.indexOf('discovery') !== -1 || text.indexOf('book') !== -1)) eventName = 'discovery_session_click';
      else if ((path === '/project-direction' || path === '/project-direction.html') && (el.classList.contains('nav-cta') || text.indexOf('start a project') !== -1)) eventName = 'project_direction_start';
      else if (path === '/work' || path === '/work/index.html') eventName = 'work_card_click';
      else if (path === '/capabilities' || path === '/capabilities/index.html' || path.indexOf('/capabilities/') === 0) eventName = 'capability_click';
      else if (path === '/engagements' || path === '/engagements/index.html') eventName = 'engagement_click';
      else if (path === '/intelligence' || path === '/intelligence.html' || path.indexOf('/blog/') === 0) eventName = 'intelligence_article_click';
      else if (path === '/saurabh-sohan-singh' || path === '/saurabh-sohan-singh.html') eventName = 'founder_profile_click';
      else if (hash === '#contact' && (el.classList.contains('nav-cta') || text.indexOf('conversation') !== -1 || text.indexOf("let's talk") !== -1)) eventName = 'cta_start_conversation_click';
      else if (hash === '#capabilities' && (el.closest('.hero-ctas') || text.indexOf('explore capabilities') !== -1)) eventName = 'cta_explore_capabilities_click';
    }
    if (!eventName && onclick) {
      if (/audit\.html|\/audit/.test(onclick)) eventName = 'audit_start_click';
      else if (/\/discovery/.test(onclick)) eventName = 'discovery_session_click';
    }
    if (!eventName) {
      if (text.indexOf('explore capabilities') !== -1) eventName = 'cta_explore_capabilities_click';
      else if (text.indexOf('start a project') !== -1 || text.indexOf('start a conversation') !== -1 || text.indexOf('start the conversation') !== -1) eventName = 'cta_start_conversation_click';
    }
    if (eventName) {
      window.SQ.trackEvent(eventName, {
        link_text: text || undefined,
        link_url: href || undefined,
        page_path: window.location.pathname
      });
    }
  });
};

window.SQ.initNav = function () {
  var nav = document.getElementById('nav');
  var mobToggle = document.getElementById('mob-toggle');
  var mobMenu = document.getElementById('mob-menu');
  var menuOpen = false;
  var lastFocused = null;
  if (!nav || !mobToggle || !mobMenu) return;

  function focusableItems() {
    return Array.prototype.slice.call(mobMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }
  function setMenu(open, restoreFocus) {
    menuOpen = open;
    mobToggle.classList.toggle('open', menuOpen);
    mobToggle.setAttribute('aria-expanded', String(menuOpen));
    mobToggle.setAttribute('aria-label', menuOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobMenu.classList.toggle('open', menuOpen);
    mobMenu.setAttribute('aria-hidden', String(!menuOpen));
    if (menuOpen) {
      lastFocused = document.activeElement;
      mobMenu.removeAttribute('inert');
      var first = focusableItems()[0];
      if (first) window.setTimeout(function () { first.focus(); }, 0);
    } else {
      mobMenu.classList.remove('pointer-open');
      mobMenu.setAttribute('inert', '');
      if (restoreFocus !== false && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });
  mobMenu.addEventListener('touchstart', function () {}, { passive: true });
  mobToggle.addEventListener('pointerdown', function () { mobMenu.classList.add('pointer-open'); });
  mobToggle.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') mobMenu.classList.remove('pointer-open'); });
  mobToggle.addEventListener('click', function () { setMenu(!menuOpen, true); });
  window.closeMob = function (restoreFocus) { setMenu(false, restoreFocus); };

  mobMenu.addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); window.closeMob(true); return; }
    if (e.key !== 'Tab') return;
    var items = focusableItems();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  mobMenu.addEventListener('touchmove', function (e) {
    var touch = e.touches[0];
    var el = document.elementFromPoint(touch.clientX, touch.clientY);
    mobMenu.querySelectorAll('a').forEach(function (a) { a.classList.remove('finger-active'); });
    if (el && el.tagName === 'A' && mobMenu.contains(el)) el.classList.add('finger-active');
  }, { passive: true });
  mobMenu.addEventListener('touchend', function () { mobMenu.querySelectorAll('a').forEach(function (a) { a.classList.remove('finger-active'); }); }, { passive: true });
  document.addEventListener('click', function (e) {
    if (menuOpen && !mobMenu.contains(e.target) && !mobToggle.contains(e.target)) window.closeMob();
  });
};

window.SQ.initCountryCity = function (countryId, citySelectId) {
  var countryEl = document.getElementById(countryId);
  var cityEl = document.getElementById(citySelectId);
  var textEl = document.getElementById(citySelectId + '-text');
  if (!countryEl || !cityEl) return;
  var cityData = window.SQ.config.cityData;
  countryEl.addEventListener('change', function () {
    var cities = cityData[this.value] || [];
    while (cityEl.firstChild) cityEl.removeChild(cityEl.firstChild);
    if (!this.value || !cities.length) {
      cityEl.style.display = 'none';
      if (textEl) { textEl.style.display = 'block'; textEl.value = ''; }
      return;
    }
    var ph = document.createElement('option');
    ph.value = ''; ph.disabled = true; ph.selected = true; ph.textContent = 'Select city';
    cityEl.appendChild(ph);
    cities.forEach(function (city) {
      var option = document.createElement('option');
      option.value = city; option.textContent = city; cityEl.appendChild(option);
    });
    cityEl.style.display = 'block';
    if (textEl) { textEl.style.display = 'none'; textEl.value = ''; }
  });
  cityEl.addEventListener('change', function () {
    if (!textEl) return;
    if (this.value === 'Other') { textEl.style.display = 'block'; textEl.focus(); }
    else { textEl.style.display = 'none'; textEl.value = ''; }
  });
};

window.SQ.initITI = function (inputId) {
  return new Promise(function (resolve, reject) {
    var input = document.getElementById(inputId);
    if (!input) return reject(new Error('Input not found: ' + inputId));
    function tryInit() {
      if (typeof window.intlTelInput !== 'function') return reject(new Error('intlTelInput not loaded'));
      try { resolve(window.intlTelInput(input, window.SQ.config.itiOptions)); }
      catch (error) { reject(error); }
    }
    if (typeof window.intlTelInput === 'function') return tryInit();
    var waited = 0;
    var poll = setInterval(function () {
      waited += 50;
      if (typeof window.intlTelInput === 'function') { clearInterval(poll); tryInit(); }
      else if (waited > 5000) { clearInterval(poll); reject(new Error('intlTelInput timeout')); }
    }, 50);
  });
};

window.SQ.initEscapeKey = function () {
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (typeof window.closeMob === 'function') window.closeMob(true);
    if (typeof window.closeModal === 'function') window.closeModal();
    var overlay = document.getElementById('payment-success-overlay');
    if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
  });
};

window.SQ.initHoverDisclosures = function () {
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('mouseover', function (event) {
    var disclosure = event.target.closest && event.target.closest('details');
    if (!disclosure || (event.relatedTarget && disclosure.contains(event.relatedTarget))) return;
    disclosure.open = true;
  });
  document.addEventListener('mouseout', function (event) {
    var disclosure = event.target.closest && event.target.closest('details');
    if (!disclosure || (event.relatedTarget && disclosure.contains(event.relatedTarget))) return;
    disclosure.open = false;
  });
};

window.SQ.initAuditSubmitBridge = function () {
  if (!document.body || !document.body.classList.contains('audit-page')) return;
  var submit = document.getElementById('btn-submit');
  var emailInput = document.getElementById('contact-email');
  var captchaWrap = document.getElementById('audit-captcha-wrap');
  if (!submit || !emailInput) return;

  submit.setAttribute('type', 'button');
  submit.addEventListener('click', function (event) {
    var otp = window.SQOtp;
    var email = emailInput.value.trim();
    var submitError = document.getElementById('audit-submit-error');

    if (!otp || typeof otp.isEmailVerified !== 'function' || !email) return;
    if (otp.isEmailVerified(email)) {
      if (submitError && submitError.dataset.auditOtpNotice === 'true') {
        submitError.hidden = true;
        submitError.dataset.auditOtpNotice = '';
      }
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    if (typeof otp.verifyEmail === 'function') otp.verifyEmail(email);

    window.setTimeout(function () {
      var panel = emailInput._sqOtpPanel;
      if (panel && captchaWrap && captchaWrap.parentNode) {
        panel.hidden = false;
        panel.classList.add('sq-audit-final-otp');
        captchaWrap.insertAdjacentElement('afterend', panel);
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (submitError) {
        submitError.hidden = false;
        submitError.dataset.auditOtpNotice = 'true';
        submitError.textContent = 'Verify the six-digit code sent to your email, then click Generate My Brand Quotient™ again.';
      }
    }, 0);
  }, true);
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initEventTracking();
  window.SQ.initNav();
  window.SQ.initEscapeKey();
  window.SQ.initHoverDisclosures();
  window.SQ.initAuditSubmitBridge();
});
