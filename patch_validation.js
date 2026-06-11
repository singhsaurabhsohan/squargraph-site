const fs = require('fs');

['discovery.html', 'brand-foundation-sprint.html', 'websites-digital-experiences.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix validation logic to use parentNode instead of wrapper IDs
  content = content.replace(/function checkField\(wrapperId, inputId, condition\) \{[\s\S]*?ok = false;\n\s*\}\n\s*\}/g,
`function checkField(inputId, condition) {
      var el = document.getElementById(inputId);
      if (!el) return;
      var wrap = el.parentNode;
      if (condition(el.value)) {
        wrap.classList.remove('has-error');
      } else {
        wrap.classList.add('has-error');
        ok = false;
      }
    }`);

  // Update validation calls to remove the first wrapperId argument
  content = content.replace(/checkField\('field-name',\s*'form-name'/g, "checkField('form-name'");
  content = content.replace(/checkField\('field-email',\s*'form-email'/g, "checkField('form-email'");
  content = content.replace(/checkField\('field-phone',\s*'form-phone'/g, "checkField('form-phone'");
  content = content.replace(/checkField\('field-company',\s*'form-company'/g, "checkField('form-company'");
  content = content.replace(/checkField\('field-challenge',\s*'form-challenge'/g, "checkField('form-challenge'");
  content = content.replace(/checkField\('field-goal',\s*'form-goal'/g, "checkField('form-goal'");

  // Fix missing website field
  content = content.replace(/document\.getElementById\('form-website'\)\.value\.trim\(\)/g, "(document.getElementById('form-website') ? document.getElementById('form-website').value.trim() : '')");

  // Fix ITI wrapper errors when phone fails ITI check
  content = content.replace(/if \(itiDisc && !itiDisc\.isValidNumber\(\)\) \{/g, 
    "if (itiDisc && !itiDisc.isValidNumber()) { document.getElementById('form-phone').parentNode.classList.add('has-error'); ok = false;");

  // Let's also do it for sprint and web
  content = content.replace(/if \(itiSprint && !itiSprint\.isValidNumber\(\)\) \{/g, 
    "if (itiSprint && !itiSprint.isValidNumber()) { document.getElementById('form-phone').parentNode.classList.add('has-error'); ok = false;");
  
  content = content.replace(/if \(itiWeb && !itiWeb\.isValidNumber\(\)\) \{/g, 
    "if (itiWeb && !itiWeb.isValidNumber()) { document.getElementById('form-phone').parentNode.classList.add('has-error'); ok = false;");

  fs.writeFileSync(file, content);
});

console.log('Validation patched');
