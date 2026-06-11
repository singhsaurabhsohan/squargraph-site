const fs = require('fs');

const files = [
    'discovery.html',
    'audit.html',
    'brand-foundation-sprint.html',
    'websites-digital-experiences.html'
];

const topHalfReplacement = `          <!-- Standardized Top Half -->
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
              <div class="field-col" style="flex:1;">
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
              <div class="field-col" style="flex:1; position:relative;">
                <select id="form-city" name="city" style="display:none;"></select>
                <input type="text" id="form-city-text" name="city_text" placeholder="Enter city" />
              </div>
            </div>
          </div>
          <!-- End Standardized Top Half -->`;

const updateCityJS = `
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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace the old HTML block
    // It starts with <!-- Name + Email --> and goes until <!-- City --> block finishes.
    // The exact strings might differ slightly per file, so we use a robust regex.
    const formRegex = /<!-- Name \+ Email -->[\s\S]*?<!-- City -->[\s\S]*?<\/div>\s*<\/div>/;
    content = content.replace(formRegex, topHalfReplacement);

    // Wait, audit.html has slightly different comments, let's just match from the first field inside <div class="field-group">
    const robustFormRegex = /<div class="field-group">\s*(?:<!--[\s\S]*?-->\s*)*<div class="field-row">[\s\S]*?(?=<!-- (Challenge|Your Session|What's your biggest|What is your biggest))/;
    if (content.match(robustFormRegex)) {
        content = content.replace(robustFormRegex, '<div class="field-group">\n' + topHalfReplacement + '\n\n          <!-- Challenge');
    } else {
        console.log("Could not find robust replacement point in", file);
    }

    // 2. Update CSS for .field label
    const cssRegex = /\.field label\s*\{[\s\S]*?\}/;
    const newCss = `.field label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text);
      margin-bottom: 7px;
    }`;
    content = content.replace(cssRegex, newCss);

    // 3. Inject JS
    // Append to the script tag where handleInit / iti logic is
    if (!content.includes('function updateCityDropdown')) {
        content = content.replace('</script>\n</body>', updateCityJS + '\n</script>\n</body>');
    }

    // Fix payload mapping (raw.city_text instead of just raw.city)
    // The getPayload function now needs to check raw.city_text
    content = content.replace(/city:\s*raw\.city\s*\|\|\s*null/g, "city: raw.city || raw.city_text || null");

    // Also update phone input id reference for ITI if it was hardcoded (e.g. disc-phone -> form-phone)
    content = content.replace(/querySelector\('#disc-phone'\)/g, "querySelector('#form-phone')");
    content = content.replace(/querySelector\('#audit-phone'\)/g, "querySelector('#form-phone')");
    content = content.replace(/querySelector\('#sprint-phone'\)/g, "querySelector('#form-phone')");
    content = content.replace(/querySelector\('#web-phone'\)/g, "querySelector('#form-phone')");

    fs.writeFileSync(file, content);
});

console.log("Stage 2 complete");
