'use strict';

window.SQ = window.SQ || {};

window.SQ.config = {
  supabaseUrl:  'https://jzlupkvgizfdwwbofzmu.supabase.co',
  supabaseKey:  'sb_publishable_IPU4Nh7zQW_OfZr0Tlej6A_gfYhevRl',
  supabaseTable: 'leads',

  aiChatEndpoint: 'https://squargraph-chat.singhsaurabhsohan.workers.dev',

  recaptchaSiteKey: '6LdWRRYtAAAAAOC7lw8efP1OOmh17sYpkLBZ4YvB',

  razorpayKey: 'rzp_live_SvayEzczzvrE7f',

  whatsappNumber: '918588897488',

  itiOptions: {
    initialCountry: 'in',
    separateDialCode: true,
    preferredCountries: ['in', 'ae', 'us', 'gb', 'sg'],
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js'
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

  razorpayProducts: {
    discovery: { name: 'Discovery Session™',        amount: 299900,  description: '30-min founder-led brand strategy session' },
    audit:     { name: 'Brand Growth Audit™',       amount: 999900,  description: 'Full digital brand communication & growth audit' },
    sprint:    { name: 'Brand Foundation Sprint™',  amount: 4999900, description: 'Complete brand system in 3 weeks' }
  }
};
