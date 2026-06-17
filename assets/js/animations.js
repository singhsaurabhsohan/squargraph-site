'use strict';

window.SQ = window.SQ || {};

window.SQ.initReveal = function () {
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .scroll-reveal').forEach(function (el) { revealObs.observe(el); });
};

window.SQ.initDivider = function () {
  var divider = document.getElementById('approach-divider');
  if (!divider) return;
  var divObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { divider.classList.add('visible'); divObs.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  divObs.observe(divider);
};

window.SQ.initIntelHero = function () {
  var h1 = document.querySelector('.intel-page-hero .intel-page-h1');
  if (!h1) return;

  h1.innerHTML =
    '<span class="sq-hw" data-w="perception">Perception</span>' +
    '<span class="sq-hw sq-hw--static"> leaves </span>' +
    '<em class="sq-hw sq-hw--em" data-w="clues">clues.</em>';

  var words = h1.querySelectorAll('.sq-hw[data-w]');
  words.forEach(function (w) {
    w.style.display       = 'inline';
    w.style.fontWeight    = '300';
    w.style.color         = 'var(--textmuted)';
    w.style.transition    = 'none';
    w.style.letterSpacing = '0.02em';
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      var perception = h1.querySelector('[data-w="perception"]');
      var clues      = h1.querySelector('[data-w="clues"]');

      if (clues) {
        clues.style.transition    =
          'font-weight 1.1s cubic-bezier(0.16,1,0.3,1),' +
          'color 1.0s cubic-bezier(0.16,1,0.3,1),' +
          'letter-spacing 0.9s cubic-bezier(0.16,1,0.3,1)';
        clues.style.fontWeight    = '500';
        clues.style.color         = 'var(--accent)';
        clues.style.letterSpacing = '-0.04em';
        clues.style.fontStyle     = 'italic';
      }

      setTimeout(function () {
        if (perception) {
          perception.style.transition   =
            'color 0.8s ease,' +
            'font-weight 0.8s ease,' +
            'letter-spacing 0.8s ease';
          perception.style.fontWeight    = '500';
          perception.style.color         = 'var(--textprimary)';
          perception.style.letterSpacing = '-0.04em';
        }
        var staticWord = h1.querySelector('.sq-hw--static');
        if (staticWord) {
          staticWord.style.transition = 'color 0.8s ease';
          staticWord.style.color      = 'var(--textsecondary)';
        }
      }, 420);
    });
  });
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initReveal();
  window.SQ.initDivider();

  var page = document.body.getAttribute('data-page');
  if (page === 'intelligence') window.SQ.initIntelHero();
});
