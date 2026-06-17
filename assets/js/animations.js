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

window.SQ.initHeroWeight = function () {
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;

  var h1 = hero.querySelector('h1');
  if (!h1) return;

  var emEl   = h1.querySelector('em');
  var anchor = emEl ? emEl : null;

  if (!anchor) {
    var childNodes = Array.from(h1.childNodes);
    var lastNode   = null;
    childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) lastNode = node;
      if (node.nodeType === Node.ELEMENT_NODE) lastNode = node;
    });
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
      var words  = lastNode.textContent.trim().split(/\s+/);
      var before = words.slice(0, -1).join(' ');
      var word   = words[words.length - 1];
      var span   = document.createElement('em');
      span.className   = 'sq-hw--anchor';
      span.textContent = word;
      lastNode.textContent = before ? before + ' ' : '';
      lastNode.parentNode.insertBefore(span, lastNode.nextSibling);
      anchor = span;
    } else if (lastNode) {
      anchor = lastNode;
    }
  }

  if (!anchor) return;

  anchor.classList.add('sq-hw--anchor');

  var allInline = Array.from(h1.querySelectorAll('span, em'));
  h1.style.opacity = '1';

  Array.from(h1.childNodes).forEach(function (node) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    if (!node.textContent.trim()) return;
    var wrap = document.createElement('span');
    wrap.className        = 'sq-hw--rest';
    wrap.style.color      = 'var(--textmuted)';
    wrap.style.transition = 'none';
    node.parentNode.insertBefore(wrap, node);
    wrap.appendChild(node);
    allInline.push(wrap);
  });

  allInline.forEach(function (w) {
    w.style.transition    = 'none';
    w.style.color         = 'var(--textmuted)';
    w.style.fontWeight    = '300';
    w.style.letterSpacing = '0.02em';
  });

  anchor.style.color         = 'var(--textmuted)';
  anchor.style.fontWeight    = '300';
  anchor.style.letterSpacing = '0.02em';

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {

      anchor.style.transition =
        'font-weight 1.1s cubic-bezier(0.16,1,0.3,1),' +
        'color 1.0s cubic-bezier(0.16,1,0.3,1),' +
        'letter-spacing 0.9s cubic-bezier(0.16,1,0.3,1)';
      anchor.style.fontWeight    = '500';
      anchor.style.color         = 'var(--accent)';
      anchor.style.letterSpacing = '-0.04em';

      setTimeout(function () {

        allInline.forEach(function (w) {
          if (w === anchor || anchor.contains(w)) return;
          var isRest = w.classList.contains('sq-hw--rest');
          w.style.transition =
            'color 0.8s ease,' +
            'font-weight 0.8s ease,' +
            'letter-spacing 0.8s ease';
          w.style.fontWeight    = '500';
          w.style.color         = isRest ? 'var(--textsecondary)' : 'var(--textprimary)';
          w.style.letterSpacing = '-0.04em';
        });

      }, 420);
    });
  });
};

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initReveal();
  window.SQ.initDivider();
  window.SQ.initHeroWeight();
});
