/* ══════════════════════════════════════════════
   SQUARGRAPH™ Form System — form-system.js
   Provides: initRobustITI, initCountryCityMapping
══════════════════════════════════════════════ */

/* ── Country → City mapping ── */
var COUNTRY_CITIES = {
  'India':     ['Mumbai','Delhi','Bengaluru','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Surat','Other'],
  'UAE':       ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Other'],
  'USA':       ['New York','Los Angeles','Chicago','Houston','San Francisco','Seattle','Austin','Other'],
  'UK':        ['London','Manchester','Birmingham','Edinburgh','Bristol','Leeds','Other'],
  'Singapore': ['Singapore'],
  'Australia': ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Other'],
  'Canada':    ['Toronto','Vancouver','Montreal','Calgary','Ottawa','Other'],
  'Germany':   ['Berlin','Munich','Hamburg','Frankfurt','Cologne','Other'],
  'France':    ['Paris','Lyon','Marseille','Toulouse','Nice','Other'],
  'Japan':     ['Tokyo','Osaka','Kyoto','Yokohama','Nagoya','Other'],
  'Other':     ['Other']
};

function initCountryCityMapping(countryId, cityId) {
  var countryEl = document.getElementById(countryId);
  var cityEl    = document.getElementById(cityId);
  if (!countryEl || !cityEl) return;

  countryEl.addEventListener('change', function () {
    var selected = this.value;
    var cities   = COUNTRY_CITIES[selected] || ['Other'];

    /* rebuild city options */
    cityEl.innerHTML = '<option value="" disabled selected>Select city</option>';
    cities.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      cityEl.appendChild(opt);
    });

    /* show city dropdown */
    cityEl.style.display = 'block';

    /* if there's a city-text fallback input, hide it */
    var cityText = document.getElementById(cityId + '-text') ||
                   document.getElementById('city-text');
    if (cityText) cityText.style.display = 'none';
  });
}

/* ── intl-tel-input robust init ── */
function initRobustITI(phoneId) {
  return new Promise(function (resolve, reject) {
    var phoneEl = document.getElementById(phoneId);
    if (!phoneEl) { reject(new Error('Phone element not found: ' + phoneId)); return; }

    function doInit() {
      if (typeof window.intlTelInput !== 'function') {
        reject(new Error('intlTelInput not loaded')); return;
      }
     var instance = window.intlTelInput(phoneEl, {
        initialCountry:      'in',
        preferredCountries:  ['in', 'ae', 'gb', 'us', 'sg', 'au', 'ca'],
        separateDialCode:    true,
        allowDropdown:       true,
        showFlags:           true,
        utilsScript:         'https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js'
      });
      resolve(instance);
    }

    if (typeof window.intlTelInput === 'function') {
      doInit();
    } else {
      /* wait for ITI script to finish loading */
      var attempts = 0;
      var poll = setInterval(function () {
        attempts++;
        if (typeof window.intlTelInput === 'function') {
          clearInterval(poll); doInit();
        } else if (attempts > 40) {
          clearInterval(poll); reject(new Error('intlTelInput load timeout'));
        }
      }, 100);
    }
  });
}
