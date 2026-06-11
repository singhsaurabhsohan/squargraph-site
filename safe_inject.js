const fs = require('fs');

const files = [
  'discovery.html',
  'brand-foundation-sprint.html',
  'websites-digital-experiences.html',
  'index.html',
  'creative-agency-delhi.html',
  'audit.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Inject forms.css right before </head> if it's not already there
  if (!content.includes('css/forms.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="/css/forms.css" />\n</head>');
    fs.writeFileSync(file, content);
  }
});

console.log('Safe CSS injection complete.');
