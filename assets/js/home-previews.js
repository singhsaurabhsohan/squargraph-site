'use strict';

(function () {
  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderWork() {
    var grid = document.querySelector('[data-home-work-grid]');
    if (!grid) return;
    fetch('/assets/data/work.json')
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
          if (entry.image) {
            var image = document.createElement('img');
            image.src = entry.image;
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
          link.setAttribute('data-sq-event', 'work_card_click');
          if (entry.external === true) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          body.appendChild(link);
          article.appendChild(media);
          article.appendChild(body);
          grid.appendChild(article);
        });
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
    renderWork();
    renderIntelligence();
  });
}());
