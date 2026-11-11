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

  var grid = document.createElement('div');
  grid.className = 'footer-map-grid';

  var info = document.createElement('div');
  info.className = 'footer-profile-info';

  var label = document.createElement('span');
  label.textContent = 'Business profile';
  label.className = 'footer-profile-label';

  var googleMark = document.createElement('span');
  googleMark.setAttribute('aria-label', 'Google');
  googleMark.title = 'Google';
  googleMark.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.45a5.52 5.52 0 0 1-2.39 3.52v2.93h3.87c2.27-2.09 3.56-5.17 3.56-8.69z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-2.93c-1.07.72-2.44 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.94H1.27v3.03A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.27 14.37A7.23 7.23 0 0 1 4.89 12c0-.82.14-1.61.38-2.37V6.6H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.4l4-3.03z"/><path fill="#EA4335" d="M12 4.69c1.76 0 3.34.6 4.58 1.79l3.43-3.43A11.52 11.52 0 0 0 12 0 12 12 0 0 0 1.27 6.6l4 3.03C6.22 6.8 8.87 4.69 12 4.69z"/></svg>';
  googleMark.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;flex:0 0 auto;';

  label.appendChild(googleMark);

  var title = document.createElement('h2');
  title.id = 'footer-location-title';
  title.textContent = 'Hari Nagar Ashram';
  title.className = 'footer-profile-title';

  var category = document.createElement('p');
  category.textContent = 'Marketing agency · South Delhi';

  var address = document.createElement('p');
  address.textContent = 'Hari Nagar Ashram, New Delhi 110014';
  address.className = 'footer-profile-address';

  var link = document.createElement('a');
  link.href = 'https://www.google.com/maps/search/?api=1&query=SQUARGRAPH%20Studios%2C%20Hari%20Nagar%20Ashram%2C%20New%20Delhi%20110014';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('data-sq-event', 'footer_google_business_open');
  link.textContent = 'View on Google Maps ↗';
  link.className = 'footer-profile-link';

  info.appendChild(label);
  info.appendChild(title);
  info.appendChild(category);
  info.appendChild(address);
  info.appendChild(link);

  var mapWrap = document.createElement('div');
  mapWrap.className = 'footer-map-frame';

  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.google.com/maps?q=SQUARGRAPH%20Studios%2C%20Hari%20Nagar%20Ashram%2C%20New%20Delhi%20110014&output=embed';
  iframe.title = 'SQUARGRAPH™ on Google Maps, Hari Nagar Ashram, New Delhi 110014';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.setAttribute('allowfullscreen', '');
  mapWrap.appendChild(iframe);

  grid.appendChild(info);
  grid.appendChild(mapWrap);
  section.appendChild(grid);

  var links = footer.querySelector('.footer-inner--expanded');
  if (links) {
    links.appendChild(section);
    return;
  }

  var marker = footer.querySelector('.footer-finish') || footer.querySelector('.footer-bar, .footer-bottom');
  if (marker) footer.insertBefore(section, marker);
  else footer.appendChild(section);
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initFooterLocationMap();

  var footer = document.querySelector('.site-footer');
  var banner = document.getElementById('sticky-banner');
  if (!footer || !banner || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    banner.classList.toggle('sg-footer-hidden', entries[0].isIntersecting);
  });
  observer.observe(footer);
});
