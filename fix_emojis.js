const fs = require('fs');

['index.html', 'creative-agency-delhi.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let ac = fs.readFileSync(file, 'utf8');
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
    
    // Also the copyright symbols that might be corrupted:
    ac = ac.replace(/c 2026 SQUARGRAPHT/g, '© 2026 SQUARGRAPH™');
    ac = ac.replace(/"priceRange": "\?\?\?"/g, '"priceRange": "$$$"');

    // Fix payload payload mismatch: In getPayload of index.html and creative-agency-delhi.html
    // Specifically fix 'service', 'budget', 'timeline', 'message' -> mapping to the actual form fields.
    // In index.html the form fields are: name, phone, email, company, industry, country, city, message
    // Wait, let's just do the emoji and basic fixes first.
    fs.writeFileSync(file, ac);
  }
});
console.log("Done emojis");
