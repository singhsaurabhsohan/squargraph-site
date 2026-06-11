const fs = require('fs');

const filesToUpdateHTML = ['discovery.html', 'audit.html', 'brand-foundation-sprint.html', 'websites-digital-experiences.html'];
const allFiles = [...filesToUpdateHTML, 'index.html', 'creative-agency-delhi.html'];

const countryOptions = `                <option value="" disabled selected>Country</option>
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
                <option value="Other">🌍 Other</option>`;

// 1. Replace ???? in index and creative-agency
['index.html', 'creative-agency-delhi.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace broken country options block - index.html has Country selected
    content = content.replace(/<option value="" disabled selected>Country<\/option>[\s\S]*?<option value="Other">\?\? Other<\/option>/g, countryOptions);
    
    // creative-agency-delhi.html has India selected
    content = content.replace(/<option value="India" selected>\?\?\?\? India<\/option>[\s\S]*?<option value="Other">\?\? Other<\/option>/g, countryOptions.replace('value="India"', 'value="India" selected'));
    
    // Fix getPayload
    const payloadReplacement = `    return {
      name:       raw.name      || null,
      phone: (typeof iti !== 'undefined' ? iti.getNumber() : raw.phone) || null,
      email:      raw.email     || null,
      company:    raw.company   || null,
      industry:   raw.industry  || (document.getElementById('industry-contact') ? document.getElementById('industry-contact').value : null) || null,
      country:    raw.country   || null,
      city:       raw.city      || raw.city_text || null,
      challenge:  raw.message   || null,
      goal:       raw.goal      || null,
      reference:  raw.reference || null,
      service:    'General Inquiry',
      source:     'General Contact',
      status:     'new',
      created_at: new Date().toISOString(),
      source_url: window.location.href
    };`;
    content = content.replace(/return \{[\s\S]*?source_url: window\.location\.href[\s\S]*?\};/g, payloadReplacement);
    
    // Add webhook to submitLead
    const webhookCode = `  const { error } = await window.__sb
    .from(SUPABASE_TABLE)
    .insert([payload]);

  if (error) throw new Error('Insert failed');

  try {
    await fetch('https://morning-resonance-0ad8.singhsaurabhsohan.workers.dev/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: payload,
        product: 'General Contact',
        payment_status: 'lead'
      })
    });
  } catch (e) { console.error('Webhook failed', e); }

  return true;`;
    content = content.replace(/const \{ error \} = await window\.__sb[\s\S]*?return true;/g, webhookCode);
    
    fs.writeFileSync(file, content);
});

// 2. Fix ITI dropdown clipping by adding dropdownContainer: document.body to ALL files
allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/placeholderNumberType: 'MOBILE'/g, "placeholderNumberType: 'MOBILE',\n      dropdownContainer: document.body");
    fs.writeFileSync(file, content);
});

console.log("Stage 1 complete");
