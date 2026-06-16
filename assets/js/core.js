'use strict';

window.SQ = window.SQ || {};

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

window.SQ.initNav = function () {
  var nav = document.getElementById('nav');
  var mobToggle = document.getElementById('mob-toggle');
  var mobMenu = document.getElementById('mob-menu');
  var menuOpen = false;

  if (!nav || !mobToggle || !mobMenu) return;

  mobMenu.addEventListener('touchstart', function () {}, { passive: true });

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  mobToggle.addEventListener('click', function () {
    menuOpen = !menuOpen;
    mobToggle.classList.toggle('open', menuOpen);
    mobToggle.setAttribute('aria-expanded', String(menuOpen));
    mobToggle.setAttribute('aria-label', menuOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobMenu.classList.toggle('open', menuOpen);
    if (menuOpen) { mobMenu.removeAttribute('inert'); } else { mobMenu.setAttribute('inert', ''); }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });

  window.closeMob = function () {
    menuOpen = false;
    mobToggle.classList.remove('open');
    mobToggle.setAttribute('aria-expanded', 'false');
    mobToggle.setAttribute('aria-label', 'Open navigation menu');
    mobMenu.classList.remove('open');
    mobMenu.setAttribute('inert', '');
    document.body.style.overflow = '';
  };

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
    if (typeof window.closeModal === 'function') window.closeModal();
    var overlay = document.getElementById('payment-success-overlay');
    if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
  });
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initNav();
  window.SQ.initEscapeKey();
});
