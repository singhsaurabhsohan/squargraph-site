'use strict';

(function () {
  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var brandMarks = [
    { name: 'Tata Motors', src: '/assets/images/brand-marks/tata-motors.svg', className: 'brand-marquee-item--wide' },
    { name: 'Audi', src: '/assets/images/brand-marks/audi.svg', className: 'brand-marquee-item--compact' },
    { name: 'Hyundai India', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg', className: 'brand-marquee-item--wide' },
    { name: 'Booking.com', src: '/assets/images/brand-marks/booking-com.svg', className: 'brand-marquee-item--wide' },
    { name: 'Mahindra', src: '/assets/images/brand-marks/mahindra.svg' },
    { name: 'vivo', src: '/assets/images/brand-marks/vivo.svg' },
    { name: 'MG Motor', src: '/assets/images/brand-marks/mg-motor.svg', className: 'brand-marquee-item--compact' },
    { name: 'ZUCERO - The Good Sugar', src: 'https://raw.githubusercontent.com/singhsaurabhsohan/zucero-website/main/assets/images/zucerothegoodsugar-logo.webp', className: 'brand-marquee-item--zucero' },
    { name: 'YASHICA', src: '/assets/images/brand-marks/yashica.png', className: 'brand-marquee-item--yashica' },
    { name: 'Angelbird', src: '/assets/images/brand-marks/angelbird.svg', className: 'brand-marquee-item--angelbird' },
    { name: 'Lowepro', src: '/assets/images/brand-marks/lowepro.png' }
  ];

  function ensureBrandMarqueeStyles() {
    if (document.querySelector('link[data-brand-marquee-styles]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/components/brand-marquee.css?v=20260915-4';
    link.dataset.brandMarqueeStyles = '';
    document.head.appendChild(link);
  }

  function brandGroup(isDuplicate) {
    var group = make('div', 'brand-marquee-group');
    if (isDuplicate) group.setAttribute('aria-hidden', 'true');

    brandMarks.forEach(function (brand) {
      var item = make('div', 'brand-marquee-item' + (brand.className ? ' ' + brand.className : ''));
      var image = document.createElement('img');
      image.src = brand.src;
      image.alt = isDuplicate ? '' : brand.name;
      image.decoding = 'async';
      image.loading = 'lazy';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', function () {
        if (!image.parentNode) return;
        item.classList.add('brand-marquee-item--fallback');
        image.remove();
        item.appendChild(make('span', 'brand-marquee-fallback', brand.name));
      }, { once: true });
      item.appendChild(image);
      group.appendChild(item);
    });

    return group;
  }

  function renderBrandMarquee() {
    var hero = document.getElementById('hero');
    var trust = document.querySelector('.architecture-trust');
    var anchor = trust || hero;
    if (!anchor || document.querySelector('.brand-marquee-section')) return;

    ensureBrandMarqueeStyles();

    var section = make('section', 'brand-marquee-section');
    section.setAttribute('aria-label', "Brands we've worked with");

    var head = make('div', 'brand-marquee-head');
    var mark = document.createElement('img');
    mark.className = 'brand-section-art'; mark.src = '/assets/images/sections/brands-immersive-v20261101.svg';
    mark.alt = ''; mark.width = 68; mark.height = 42; mark.loading = 'lazy';
    head.appendChild(mark);
    head.appendChild(make('p', 'brand-marquee-title', "Brands we've worked with"));
    head.appendChild(make('p', 'brand-marquee-note', 'Across SQUARGRAPH™ engagements and founder-led professional experience.'));

    var mask = make('div', 'brand-marquee-mask');
    var track = make('div', 'brand-marquee-track');
    track.appendChild(brandGroup(false));
    track.appendChild(brandGroup(true));
    mask.appendChild(track);

    section.appendChild(head);
    section.appendChild(mask);
    anchor.insertAdjacentElement('afterend', section);
  }

  function intelligenceLink(entry) {
    if (entry.url) return entry.url;
    if (entry.type === 'study' && entry.slug) return '/intelligence#study-' + entry.slug;
    if ((entry.type === 'signal' || entry.type === 'observation') && entry.slug) return '/intelligence';
    return '';
  }

  function entryDescription(entry) {
    return entry.excerpt || entry.tension || entry.observation || entry.summary || '';
  }

  function renderIntelligence() {
    var grid = document.querySelector('[data-home-intelligence-grid]');
    if (!grid) return;
    fetch('/assets/data/intelligence.json')
      .then(function (response) { if (!response.ok) throw new Error('Intelligence unavailable'); return response.json(); })
      .then(function (data) {
        var entries = (data.entries || []).filter(function (entry) {
          return entry.published === true && entry.date && intelligenceLink(entry) && entryDescription(entry);
        }).sort(function (a, b) {
          if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
          return String(b.date).localeCompare(String(a.date));
        });
        var picked = [];
        ['study', 'signal', 'observation'].forEach(function (type) {
          var match = entries.find(function (entry) { return entry.type === type && picked.indexOf(entry) === -1; });
          if (match) picked.push(match);
        });
        entries.forEach(function (entry) { if (picked.length < 3 && picked.indexOf(entry) === -1) picked.push(entry); });
        if (!picked.length) return;
        grid.replaceChildren();
        picked.slice(0, 3).forEach(function (entry) {
          var article = make('article', 'architecture-intel-card sg-detail-visual');
          var artByType = {study: '911287e694', signal: '86525cbf5a', observation: '5a70fe422b'};
          article.setAttribute('data-detail-art', artByType[entry.type] || '911287e694');
          article.appendChild(make('p', 'architecture-card-meta', entry.type));
          article.appendChild(make('h3', '', entry.title || entry.category || 'Intelligence signal'));
          article.appendChild(make('p', '', entryDescription(entry)));
          var link = make('a', 'text-link', 'Read intelligence');
          link.href = intelligenceLink(entry);
          link.setAttribute('data-sq-event', 'intelligence_article_click');
          article.appendChild(link);
          grid.appendChild(article);
        });
      })
      .catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderBrandMarquee();
    renderIntelligence();
  });
}());
