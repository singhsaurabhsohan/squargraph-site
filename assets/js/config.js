'use strict';

window.SQ = window.SQ || {};

window.SQ.config = {
  supabaseUrl:  'https://jzlupkvgizfdwwbofzmu.supabase.co',
  supabaseKey:  'sb_publishable_IPU4Nh7zQW_OfZr0Tlej6A_gfYhevRl',
  supabaseTable: 'leads',

  publicFormEndpoint: 'https://jzlupkvgizfdwwbofzmu.supabase.co/functions/v1/public-form-submit',
  paymentEndpoint: 'https://jzlupkvgizfdwwbofzmu.supabase.co/functions/v1/squargraph-payments',
  auditEndpoint: 'https://jzlupkvgizfdwwbofzmu.supabase.co/functions/v1/squargraph-audit',
  aiChatEndpoint: 'https://squargraph-chat.singhsaurabhsohan.workers.dev',

  recaptchaSiteKey: '6LdWRRYtAAAAAOC7lw8efP1OOmh17sYpkLBZ4YvB',

  // Razorpay Key ID is public by design. The Key Secret must remain server-side only.
  razorpayKey: 'rzp_live_TaK02yH9uQF8SV',

  whatsappNumber: '918588897488',

  itiOptions: {
    initialCountry: 'in',
    separateDialCode: true,
    preferredCountries: ['in', 'ae', 'us', 'gb', 'sg'],
    utilsScript: '/assets/vendor/intl-tel-input/js/utils.js'
  },
  cityData: {
    'India':     ['Ahmedabad','Bengaluru','Chennai','Delhi','Gurugram','Hyderabad','Jaipur','Kolkata','Mumbai','Noida','Pune','Surat','Other'],
    'UAE':       ['Abu Dhabi','Dubai','Sharjah','Other'],
    'USA':       ['Austin','Chicago','Los Angeles','Miami','New York','San Francisco','Seattle','Other'],
    'UK':        ['Birmingham','Edinburgh','Leeds','London','Manchester','Other'],
    'Singapore': ['Singapore'],
    'Australia': ['Brisbane','Melbourne','Perth','Sydney','Other'],
    'Canada':    ['Calgary','Montreal','Toronto','Vancouver','Other'],
    'Germany':   ['Berlin','Frankfurt','Hamburg','Munich','Other'],
    'France':    ['Lyon','Marseille','Paris','Other'],
    'Japan':     ['Osaka','Tokyo','Other']
  },

  // Display metadata only. Server-side payment functions are authoritative for price/currency.
  razorpayProducts: {
    discovery: { name: 'Discovery Session™',        amount: 299900,  description: '30-min founder-led brand strategy session' },
    audit:     { name: 'Brand Growth Audit™',       amount: 999900,  description: 'Full digital brand communication & growth audit' },
    sprint:    { name: 'Brand Foundation Sprint™',  amount: 4999900, description: 'Complete brand system in 3 weeks' }
  }
};

window.SQ.initFooterLocationMap = function () {
  var footer = document.querySelector('.site-footer');
  if (!footer || footer.querySelector('.footer-map-block')) return;

  var section = document.createElement('section');
  section.className = 'footer-map-block';
  section.setAttribute('aria-labelledby', 'footer-location-title');
  section.style.cssText = 'border-top:1px solid rgba(255,255,255,.12);padding:36px 0;';

  var grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:28px;align-items:stretch;';

  var info = document.createElement('div');
  info.style.cssText = 'display:flex;flex-direction:column;justify-content:center;min-height:220px;padding:6px 0;';

  var googleLabel = document.createElement('span');
  googleLabel.textContent = 'Google Business Profile';
  googleLabel.style.cssText = 'display:block;margin-bottom:14px;color:rgba(255,255,255,.58);font-size:11px;line-height:1.4;text-transform:uppercase;letter-spacing:.08em;';

  var brandLine = document.createElement('div');
  brandLine.style.cssText = 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;';

  var logo = document.createElement('img');
  logo.src = '/logo.webp?v=20260719-optimized1';
  logo.alt = 'SQUARGRAPH™';
  logo.width = 236;
  logo.height = 28;
  logo.loading = 'lazy';
  logo.style.cssText = 'display:block;width:min(190px,60vw);height:auto;object-fit:contain;';

  var onGoogle = document.createElement('span');
  onGoogle.textContent = 'on Google';
  onGoogle.style.cssText = 'color:#fff;font:500 18px/1.2 Satoshi,Arial,sans-serif;letter-spacing:-.02em;';

  brandLine.appendChild(logo);
  brandLine.appendChild(onGoogle);

  var title = document.createElement('h2');
  title.id = 'footer-location-title';
  title.textContent = 'SQUARGRAPH™ · Hari Nagar Ashram';
  title.style.cssText = 'margin:0 0 8px;color:#fff;font:500 clamp(22px,2.5vw,30px)/1.2 Satoshi,Arial,sans-serif;letter-spacing:-.02em;';

  var category = document.createElement('p');
  category.textContent = 'Marketing agency · South Delhi';
  category.style.cssText = 'margin:0 0 4px;color:rgba(255,255,255,.82);font-size:14px;line-height:1.6;';

  var address = document.createElement('p');
  address.textContent = 'Hari Nagar Ashram, New Delhi 110014';
  address.style.cssText = 'margin:0 0 22px;color:rgba(255,255,255,.58);font-size:13px;line-height:1.7;';

  var link = document.createElement('a');
  link.href = 'https://www.google.com/maps/search/?api=1&query=SQUARGRAPH%20Studios%2C%20Hari%20Nagar%20Ashram%2C%20New%20Delhi%20110014';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('data-sq-event', 'footer_google_business_open');
  link.textContent = 'View SQUARGRAPH on Google ↗';
  link.style.cssText = 'width:max-content;color:#fff;font-size:13px;font-weight:500;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.34);padding-bottom:3px;';

  info.appendChild(googleLabel);
  info.appendChild(brandLine);
  info.appendChild(title);
  info.appendChild(category);
  info.appendChild(address);
  info.appendChild(link);

  var mapWrap = document.createElement('div');
  mapWrap.style.cssText = 'min-height:250px;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:#151515;';

  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.google.com/maps?q=SQUARGRAPH%20Studios%2C%20Hari%20Nagar%20Ashram%2C%20New%20Delhi%20110014&output=embed';
  iframe.title = 'SQUARGRAPH on Google Maps, Hari Nagar Ashram, New Delhi 110014';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText = 'display:block;width:100%;height:100%;min-height:250px;border:0;';
  mapWrap.appendChild(iframe);

  grid.appendChild(info);
  grid.appendChild(mapWrap);
  section.appendChild(grid);

  var marker = footer.querySelector('.footer-bar, .footer-bottom');
  if (marker) footer.insertBefore(section, marker);
  else footer.appendChild(section);
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initFooterLocationMap();
});
