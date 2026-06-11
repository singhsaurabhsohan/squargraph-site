/* 
  SQUARGRAPH Form System 
  Centralizes City mapping, ITI initialisation, and common form validations.
*/

var CITY_DATA = {
  'India': ['Ahmedabad','Bengaluru','Chennai','Delhi','Hyderabad','Jaipur','Kochi','Kolkata','Lucknow','Mumbai','Noida','Pune','Surat'],
  'USA': ['Atlanta','Austin','Boston','Chicago','Dallas','Houston','Los Angeles','Miami','New York','San Francisco','Seattle','Washington D.C.'],
  'UK': ['Birmingham','Bristol','Edinburgh','Glasgow','Leeds','Liverpool','London','Manchester','Oxford'],
  'UAE': ['Abu Dhabi','Ajman','Dubai','Sharjah'],
  'Singapore': ['Singapore'],
  'Australia': ['Adelaide','Brisbane','Melbourne','Perth','Sydney'],
  'Canada': ['Calgary','Edmonton','Montreal','Ottawa','Toronto','Vancouver'],
  'Germany': ['Berlin','Cologne','Frankfurt','Hamburg','Munich','Stuttgart'],
  'France': ['Bordeaux','Lille','Lyon','Marseille','Paris','Toulouse'],
  'Japan': ['Fukuoka','Kyoto','Nagoya','Osaka','Sapporo','Tokyo','Yokohama']
};

/**
 * Initializes the dynamic country-to-city dropdown mapping.
 */
function initCountryCityMapping(countrySelectId, citySelectId) {
  var countrySelect = document.getElementById(countrySelectId);
  var citySelect = document.getElementById(citySelectId);
  var textInput = document.getElementById(citySelectId + '-text');
  
  if (!countrySelect || !citySelect || !textInput) return;
  
  // Clean up any existing listeners by cloning (if needed) but usually it's fine.
  countrySelect.addEventListener('change', function() {
    var country = this.value;
    var cities = CITY_DATA[country] || [];
    
    if (!country || cities.length === 0) {
      citySelect.style.display = 'none';
      citySelect.required = false;
      citySelect.innerHTML = '';
      textInput.style.display = 'block';
      textInput.required = true;
      textInput.value = '';
      return;
    }

    // Add cities
    citySelect.innerHTML = '<option value="" disabled selected>Select city</option>';
    cities.forEach(function(city) {
      var opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
    
    citySelect.style.display = 'block';
    citySelect.required = true;
    textInput.style.display = 'none';
    textInput.value = '';
    textInput.required = false;
  });
}

/**
 * Robustly initializes intlTelInput, waiting for the CDN to load if necessary.
 * Returns a Promise that resolves with the ITI instance.
 */
window._itiInstances = window._itiInstances || {};

function initRobustITI(phoneId) {
  return new Promise(function(resolve, reject) {
    var phoneEl = document.getElementById(phoneId);
    if (!phoneEl) return reject(new Error('Phone element not found'));

    var attempts = 0;
    var check = setInterval(function() {
      if (typeof window.intlTelInput !== 'undefined') {
        clearInterval(check);
        var instance = window.intlTelInput(phoneEl, {
          initialCountry: 'in',
          preferredCountries: ['in', 'ae', 'us', 'gb', 'sg', 'au'],
          separateDialCode: false,
          utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js',
          nationalMode: true,
          placeholderNumberType: 'MOBILE',
          dropdownContainer: document.body
        });
        
        window._itiInstances[phoneId] = instance;

        // Fix tap highlight on mobile
        setTimeout(function() {
          var wrap = phoneEl.closest('.iti');
          if (wrap) {
            var flagBtn = wrap.querySelector('.iti__selected-flag');
            if (flagBtn) {
              flagBtn.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
              flagBtn.style.backgroundColor = 'transparent';
              flagBtn.addEventListener('touchstart', function() {
                this.style.backgroundColor = 'transparent';
              }, { passive: true });
            }
          }
        }, 300);

        resolve(instance);
      } else {
        attempts++;
        if (attempts > 100) { // Timeout after ~10 seconds
          clearInterval(check);
          console.error('intlTelInput failed to load.');
          reject(new Error('intlTelInput load timeout'));
        }
      }
    }, 100);
  });
}

/**
 * Generic field validation helper
 */
function checkFieldValidation(inputId, condition) {
  var el = document.getElementById(inputId);
  if (!el) return true; // if field doesn't exist, don't fail validation
  var wrap = el.parentNode;
  
  if (condition(el.value)) {
    wrap.classList.remove('has-error');
    var err = wrap.querySelector('.field-error') || wrap.querySelector('.error-msg');
    if (err) err.classList.remove('visible');
    return true;
  } else {
    wrap.classList.add('has-error');
    var err = wrap.querySelector('.field-error') || wrap.querySelector('.error-msg');
    if (err) err.classList.add('visible');
    return false;
  }
}
