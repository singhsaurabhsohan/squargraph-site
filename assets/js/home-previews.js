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
    { name: 'ZUCERO - The Good Sugar', src: 'https://thegoodsugar.in/assets/images/zucerothegoodsugar-logo.webp', className: 'brand-marquee-item--wide' },
    { name: 'YASHICA', src: '/assets/images/brand-marks/yashica.png' },
    { name: 'Angelbird', src: '/assets/images/brand-marks/angelbird.svg' },
    { name: 'Lowepro', src: '/assets/images/brand-marks/lowepro.png' }
  ];

  function ensureBrandMarqueeStyles() {
    if (document.querySelector('link[data-brand-marquee-styles]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/components/brand-marquee.css?v=20260915-1';
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
    if (!hero || document.querySelector('.brand-marquee-section')) return;

    ensureBrandMarqueeStyles();

    var section = make('section', 'brand-marquee-section');
    section.setAttribute('aria-label', "Brands we've worked with");

    var head = make('div', 'brand-marquee-head');
    head.appendChild(make('p', 'brand-marquee-title', "Brands we've worked with"));
    head.appendChild(make('p', 'brand-marquee-note', 'Across SQUARGRAPH engagements and founder-led professional experience.'));

    var mask = make('div', 'brand-marquee-mask');
    var track = make('div', 'brand-marquee-track');
    track.appendChild(brandGroup(false));
    track.appendChild(brandGroup(true));
    mask.appendChild(track);

    section.appendChild(head);
    section.appendChild(mask);
    hero.insertAdjacentElement('afterend', section);
  }

  function makeVideoAudioButton() {
    var button = make('button', 'brand-film-audio');
    button.type = 'button';
    button.dataset.gumletAudio = '';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Unmute brand film');
    button.setAttribute('title', 'Unmute brand film');
    button.innerHTML = '<svg class="brand-film-audio-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="m22 9-6 6"></path><path d="m16 9 6 6"></path></svg><svg class="brand-film-audio-playing" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path></svg>';
    return button;
  }

  function renderWork() {
    var grid = document.querySelector('[data-home-work-grid]');
    if (!grid) return;
    fetch('/assets/data/work.json?v=20260915-zucero-website1')
      .then(function (response) { if (!response.ok) throw new Error('Work data unavailable'); return response.json(); })
      .then(function (data) {
        var entries = (data.entries || []).filter(function (entry) {
          return entry.published === true && entry.featured === true && entry.relationship === 'squargraph';
        }).slice(0, 4);
        if (!entries.length) return;
        grid.replaceChildren();
        entries.forEach(function (entry) {
          var article = make('article', 'architecture-work-card');
          var media = make('div', 'architecture-work-media');
          if (entry.videoEmbed) {
            media.classList.add('architecture-work-media--video');
            media.dataset.gumletLoop = '';
            if (entry.image) {
              var poster = document.createElement('img');
              poster.className = 'brand-film-poster';
              poster.src = entry.image;
              poster.alt = '';
              poster.setAttribute('aria-hidden', 'true');
              poster.loading = 'lazy';
              poster.decoding = 'async';
              poster.width = 720;
              poster.height = 405;
              media.appendChild(poster);
            }
            var iframe = document.createElement('iframe');
            iframe.dataset.src = entry.videoEmbed;
            iframe.title = entry.videoTitle || entry.imageAlt || entry.title;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.referrerPolicy = 'origin';
            iframe.loading = 'lazy';
            media.appendChild(iframe);
            media.appendChild(makeVideoAudioButton());
          } else if (entry.image) {
            var image = document.createElement('img');
            image.src = entry.previewImage || entry.image;
            image.alt = entry.imageAlt || '';
            image.loading = 'lazy';
            image.decoding = 'async';
            image.width = 720;
            image.height = 450;
            media.appendChild(image);
          } else {
            media.classList.add('architecture-work-media--system');
            media.setAttribute('aria-hidden', 'true');
          }
          var body = make('div', 'architecture-work-body');
          body.appendChild(make('p', 'architecture-card-meta', (entry.category || []).join(' · ')));
          body.appendChild(make('h3', '', entry.title));
          body.appendChild(make('p', '', entry.summary));
          var link = make('a', 'text-link', entry.linkLabel || 'View context');
          link.href = entry.url || '/work';
          link.setAttribute('data-sq-event', entry.analyticsEvent || 'work_card_click');
          if (entry.external === true) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          body.appendChild(link);
          article.appendChild(media);
          article.appendChild(body);
          grid.appendChild(article);
        });
        document.dispatchEvent(new CustomEvent('sq:work-rendered'));
      })
      .catch(function () {});
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
          var article = make('article', 'architecture-intel-card');
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
    renderWork();
    renderIntelligence();
  });
}());
