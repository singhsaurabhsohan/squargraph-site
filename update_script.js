const fs = require('fs');

const standardFields = `          <!-- Standardized Top Half -->
          <div class="field">
            <label for="form-name">Name</label>
            <input type="text" id="form-name" name="name" placeholder="Full name" autocomplete="name" />
            <span class="error-msg">Please enter your name.</span>
          </div>

          <div class="field">
            <label for="form-phone">WhatsApp / Phone</label>
            <input type="tel" id="form-phone" name="phone" placeholder="98765 43210" autocomplete="tel" />
            <span class="error-msg">Please enter your phone number.</span>
          </div>

          <div class="field">
            <label for="form-email">Work Email</label>
            <input type="email" id="form-email" name="email" placeholder="name@company.com" autocomplete="email" />
            <span class="error-msg">Please enter a valid email.</span>
          </div>

          <div class="field">
            <label for="form-company">Brand / Company</label>
            <input type="text" id="form-company" name="company" placeholder="Your brand name" autocomplete="organization" />
            <span class="error-msg">Please enter your company name.</span>
          </div>

          <div class="field">
            <label for="form-industry">Industry</label>
            <select id="form-industry" name="industry">
              <option value="" disabled selected>Select...</option>
              <option>Technology &amp; SaaS</option>
              <option>E-commerce &amp; Retail</option>
              <option>Professional Services</option>
              <option>Health &amp; Wellness</option>
              <option>Finance &amp; Fintech</option>
              <option>Automotive</option>
              <option>Hospitality &amp; F&amp;B</option>
              <option>Real Estate</option>
              <option>D2C &amp; Consumer Brands</option>
              <option>Luxury &amp; Lifestyle</option>
              <option>Media &amp; Entertainment</option>
              <option>Education &amp; EdTech</option>
              <option>Other</option>
            </select>
          </div>

          <div class="field">
            <label>Country &amp; City</label>
            <div class="field-row">
              <div class="field-col" style="flex:1; min-width: 0;">
                <select id="form-country" name="country">
                  <option value="" disabled selected>Country</option>
                  <option value="India">🇮🇳 India</option>
                  <option value="UAE">🇦🇪 UAE</option>
                  <option value="USA">🇺🇸 USA</option>
                  <option value="UK">🇬🇧 UK</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Germany">🇩🇪 Germany</option>
                  <option value="France">🇫🇷 France</option>
                  <option value="Japan">🇯🇵 Japan</option>
                  <option value="Other">🌍 Other</option>
                </select>
              </div>
              <div class="field-col" style="flex:1; position:relative; min-width: 0;">
                <select id="form-city" name="city" style="display:none;"></select>
                <input type="text" id="form-city-text" name="city_text" placeholder="Enter city" />
              </div>
            </div>
          </div>
          <!-- End Standardized Top Half -->
`;

const jsToAdd = `
  var CITIES = {
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

  function updateCityDropdown(countrySelectId, citySelectId) {
    var countrySelect = document.getElementById(countrySelectId);
    var citySelect = document.getElementById(citySelectId);
    var textInput = document.getElementById(citySelectId + '-text');
    if (!countrySelect || !citySelect || !textInput) return;
    
    countrySelect.addEventListener('change', function() {
      var country = this.value;
      if (CITIES[country]) {
        citySelect.innerHTML = '<option value="" disabled selected>City</option>';
        CITIES[country].forEach(function(city) {
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
      } else {
        citySelect.style.display = 'none';
        citySelect.required = false;
        citySelect.innerHTML = '';
        textInput.style.display = 'block';
        textInput.required = true;
        textInput.value = '';
      }
    });
  }
  updateCityDropdown('form-country', 'form-city');
`;

['discovery.html', 'brand-foundation-sprint.html', 'websites-digital-experiences.html'].forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let s1 = c.indexOf('<!-- Name + Email -->');
  
  // Start from s1 and look for the SECOND section-divider OR '<!-- Challenge -->'
  let s2 = c.indexOf('<!-- Challenge -->', s1);
  if (s2 === -1) s2 = c.indexOf('<!-- Your Session -->', s1);
  if (s2 === -1) {
    let d1 = c.indexOf('<div class="section-divider">', s1);
    s2 = c.indexOf('<div class="section-divider">', d1 + 1);
  }

  // Backup fallback: find <!-- City --> and then find the NEXT closing div
  if (s1 !== -1 && s2 === -1) {
      let cityIdx = c.indexOf('<!-- City -->');
      if (cityIdx !== -1) {
          s2 = c.indexOf('</div>', c.indexOf('</div>', cityIdx) + 1);
      }
  }

  if (s1 !== -1 && s2 !== -1) {
    c = c.substring(0, s1) + standardFields + "\n" + c.substring(s2);
  } else {
    console.log("Could not process HTML for", file);
  }

  // Update CSS
  c = c.replace(/\.field label\s*\{[\s\S]*?\}/, `.field label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text);
      margin-bottom: 7px;
    }`);

  // Inject JS
  if (!c.includes('function updateCityDropdown')) {
    c = c.replace('</script>\n</body>', jsToAdd + '\n</script>\n</body>');
  }

  // Fix Payload mapping
  c = c.replace(/city:\s*document.getElementById\('disc-city'\)\.value\.trim\(\)/g, "city: (document.getElementById('form-city').value || document.getElementById('form-city-text').value).trim()");
  c = c.replace(/city:\s*document.getElementById\('sprint-city'\)\.value\.trim\(\)/g, "city: (document.getElementById('form-city').value || document.getElementById('form-city-text').value).trim()");
  c = c.replace(/city:\s*document.getElementById\('web-city'\)\.value\.trim\(\)/g, "city: (document.getElementById('form-city').value || document.getElementById('form-city-text').value).trim()");
  
  c = c.replace(/disc-/g, "form-");
  c = c.replace(/sprint-/g, "form-");
  c = c.replace(/web-/g, "form-");

  // Fix ITI dropdown clipping
  c = c.replace(/placeholderNumberType: 'MOBILE'/g, "placeholderNumberType: 'MOBILE',\n      dropdownContainer: document.body");

  fs.writeFileSync(file, c);
});

// For audit.html
let ac = fs.readFileSync('audit.html', 'utf8');
ac = ac.replace(/placeholderNumberType: 'MOBILE'/g, "placeholderNumberType: 'MOBILE',\n    dropdownContainer: document.body");
ac = ac.replace(/\?\?\?\? India/g, '🇮🇳 India');
ac = ac.replace(/\?\?\?\? UAE/g, '🇦🇪 UAE');
ac = ac.replace(/\?\?\?\? USA/g, '🇺🇸 USA');
ac = ac.replace(/\?\?\?\? UK/g, '🇬🇧 UK');
ac = ac.replace(/\?\?\?\? Singapore/g, '🇸🇬 Singapore');
ac = ac.replace(/\?\?\?\? Australia/g, '🇦🇺 Australia');
ac = ac.replace(/\?\?\?\? Canada/g, '🇨🇦 Canada');
ac = ac.replace(/\?\?\?\? Germany/g, '🇩🇪 Germany');
ac = ac.replace(/\?\?\?\? France/g, '🇫🇷 France');
ac = ac.replace(/\?\?\?\? Japan/g, '🇯🇵 Japan');
ac = ac.replace(/\?\? Other/g, '🌍 Other');
// Make audit.html labels uppercase
ac = ac.replace(/\.field label\s*\{[\s\S]*?\}/, `.field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 7px;
  }`);
fs.writeFileSync('audit.html', ac);

console.log("Done");
