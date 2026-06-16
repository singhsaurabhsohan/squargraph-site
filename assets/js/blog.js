(function() {
  'use strict';

  // Filter
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.post-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  var nlCaptcha = document.querySelector('#newsletter-form .g-recaptcha');
  if(nlCaptcha){ var rcObs=new IntersectionObserver(function(entries){ if(entries[0].isIntersecting){ window.SQ.loadRecaptcha(); rcObs.disconnect(); } },{rootMargin:'200px'}); rcObs.observe(nlCaptcha); }

  // Newsletter form
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var emailEl = document.getElementById('nl-email');
      if (!emailEl.value.trim() || !emailEl.value.includes('@')) {
        emailEl.style.borderColor = '#EF4444';
        return;
      }
      emailEl.style.borderColor = '';
      var btn = nlForm.querySelector('.newsletter-btn');
      btn.textContent = 'Subscribed ✓';
      btn.style.background = '#1fad4e';
      btn.disabled = true;
      emailEl.disabled = true;
    });
  }

})();
