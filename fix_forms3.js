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

    // Find start and end points
    let startIdx = content.indexOf('<!-- Name + Email -->');
    if (startIdx === -1 && file === 'audit.html') {
        startIdx = content.indexOf('<div class="field" id="audit-name">');
        // Let's go up to the step active div
        startIdx = content.lastIndexOf('<div class="step active"', startIdx);
        if (startIdx !== -1) startIdx = content.indexOf('<div class="field"', startIdx);
    }
    
    let endIdx = -1;
    if (file === 'audit.html') {
        endIdx = content.indexOf('</div>\n          <!-- STEP 3 -->');
    } else {
        endIdx = content.indexOf('<div class="section-divider">', startIdx);
    }

    if (startIdx !== -1 && endIdx !== -1) {
        let replacement = topHalfReplacement;
        if (file === 'audit.html') {
            // Audit HTML requires the fields to be spread across steps, but the user requested:
            // "i want every form this part feilds to be exactly the same... AI function is only for brand growth audit"
            // Wait, maybe we keep the steps but just replace the fields inside the steps?
            // Actually, for audit, let's just make STEP 1 and STEP 2 have the fields.
            // But it's easier to put the standardized block in STEP 1 and make STEP 2 empty, or combine them.
            // For now, let's just replace the content between start of step 1 fields and end of step 2 fields.
            const auditStart1 = content.indexOf('<!-- Name -->');
            const auditEnd1 = content.indexOf('</div>\n          <!-- STEP 2 -->');
            const auditStart2 = content.indexOf('<!-- Company + Website -->');
            const auditEnd2 = content.indexOf('</div>\n          <!-- STEP 3 -->');
            
            if (auditStart1 !== -1 && auditEnd1 !== -1 && auditStart2 !== -1 && auditEnd2 !== -1) {
                // Split the topHalfReplacement into Step 1 and Step 2 fields
                const step1Fields = `          <div class="field">
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
          </div>\n`;
                
                const step2Fields = `          <div class="field">
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
          </div>\n`;
                
                content = content.substring(0, auditStart1) + step1Fields + content.substring(auditEnd1, auditStart2) + step2Fields + content.substring(auditEnd2);
            }
        } else {
            content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
        }
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
    if (!content.includes('function updateCityDropdown')) {
        content = content.replace('</script>\n</body>', updateCityJS + '\n</script>\n</body>');
    }

    // Fix payload mapping (raw.city_text instead of just raw.city)
    content = content.replace(/city:\s*raw\.city\s*\|\|\s*null/g, "city: raw.city || raw.city_text || null");

    // Also update phone/IDs in JS
    content = content.replace(/disc-name/g, "form-name");
    content = content.replace(/disc-email/g, "form-email");
    content = content.replace(/disc-phone/g, "form-phone");
    content = content.replace(/disc-company/g, "form-company");
    content = content.replace(/disc-industry/g, "form-industry");
    content = content.replace(/disc-country/g, "form-country");
    content = content.replace(/disc-city/g, "form-city");

    content = content.replace(/sprint-name/g, "form-name");
    content = content.replace(/sprint-email/g, "form-email");
    content = content.replace(/sprint-phone/g, "form-phone");
    content = content.replace(/sprint-company/g, "form-company");
    content = content.replace(/sprint-industry/g, "form-industry");
    content = content.replace(/sprint-country/g, "form-country");
    content = content.replace(/sprint-city/g, "form-city");

    content = content.replace(/web-name/g, "form-name");
    content = content.replace(/web-email/g, "form-email");
    content = content.replace(/web-phone/g, "form-phone");
    content = content.replace(/web-company/g, "form-company");
    content = content.replace(/web-industry/g, "form-industry");
    content = content.replace(/web-country/g, "form-country");
    content = content.replace(/web-city/g, "form-city");

    content = content.replace(/audit-name/g, "form-name");
    content = content.replace(/audit-email/g, "form-email");
    content = content.replace(/audit-phone/g, "form-phone");
    content = content.replace(/audit-company/g, "form-company");
    content = content.replace(/audit-industry/g, "form-industry");
    content = content.replace(/audit-country/g, "form-country");
    content = content.replace(/audit-city/g, "form-city");

    fs.writeFileSync(file, content);
});

console.log("Stage 3 complete");
