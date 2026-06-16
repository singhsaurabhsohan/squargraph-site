'use strict';

window.SQ = window.SQ || {};

window.SQ.initReveal = function () {
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(function (el) { revealObs.observe(el); });
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

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initReveal();
  window.SQ.initDivider();
});
