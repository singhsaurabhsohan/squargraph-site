'use strict';

window.SQ = window.SQ || {};

window.SQ.trackEvent = function (name, params) {
  if (!name) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, params || {}));
};

window.__sb = {
  from: function (table) {
    return {
      insert: async function (rows) {
        const cfg = window.SQ.config;
        const res = await fetch(cfg.supabaseUrl + '/rest/v1/' + table, {
          method: 'POST',
          headers: {
            'apikey': cfg.supabaseKey,
            'Authorization': 'Bearer ' + cfg.supabaseKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
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

    if (!eventName) return;

    window.SQ.trackEvent(eventName, {
      link_text: text || undefined,
      link_url: href || undefined,
      page_path: window.location.pathname
    });
  });
};

window.SQ.initNav = function () {
  var nav = document.getElementById('nav');
  var mobToggle = document.getElementById('mob-toggle');
  var mobMenu = document.getElementById('mob-menu');
  var menuOpen = false;
  var lastFocused = null;

  if (!nav || !mobToggle || !mobMenu) return;

  mobMenu.addEventListener('touchstart', function () {}, { passive: true });

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  function focusableItems() {
    return Array.prototype.slice.call(mobMenu.querySelectorAll('a[href], button:not([disabled])'));
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
      mobMenu.setAttribute('inert', '');
      if (restoreFocus !== false && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  mobToggle.addEventListener('click', function () {
    setMenu(!menuOpen, true);
  });

  window.closeMob = function (restoreFocus) {
    setMenu(false, restoreFocus);
  };

  mobMenu.addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      window.closeMob(true);
      return;
    }
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
    if (el && el.tagName === 'A' && mobMenu.contains(el)) { el.classList.add('finger-active'); }
  }, { passive: true });

  mobMenu.addEventListener('touchend', function () {
    mobMenu.querySelectorAll('a').forEach(function (a) { a.classList.remove('finger-active'); });
  }, { passive: true });

  document.addEventListener('click', function (e) {
    if (menuOpen && !mobMenu.contains(e.target) && !mobToggle.contains(e.target)) { closeMob(); }
  });
};

window.SQ.initCountryCity = function (countryId, citySelectId) {
  var countryEl = document.getElementById(countryId);
  var cityEl    = document.getElementById(citySelectId);
  var textEl    = document.getElementById(citySelectId + '-text');
  if (!countryEl || !cityEl) return;
  var cityData  = window.SQ.config.cityData;

  countryEl.addEventListener('change', function () {
    var country = this.value;
    var cities  = cityData[country] || [];
    cityEl.innerHTML = '';

    if (!country || cities.length === 0) {
      cityEl.style.display = 'none';
      if (textEl) { textEl.style.display = 'block'; textEl.value = ''; }
      return;
    }

    var ph = document.createElement('option');
    ph.value = ''; ph.disabled = true; ph.selected = true; ph.textContent = 'Select city';
    cityEl.appendChild(ph);

    cities.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c; o.textContent = c; cityEl.appendChild(o);
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
      try {
        var instance = window.intlTelInput(input, window.SQ.config.itiOptions);
        resolve(instance);
      } catch (e) { reject(e); }
    }

    if (typeof window.intlTelInput === 'function') { tryInit(); return; }

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

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initEventTracking();
  window.SQ.initNav();
  window.SQ.initEscapeKey();
});
