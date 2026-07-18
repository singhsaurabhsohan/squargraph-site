'use strict';

(function () {
  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-work-grid]'));
  var squargraphGrid = document.querySelector('[data-work-grid="squargraph"]');
  var previousGrid = document.querySelector('[data-work-grid="founder-previous-experience"]');
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-work-filter]'));
  var status = document.querySelector('[data-work-status]');
  if (!grids.length) return;

  function relationshipLabel(value) {
    return value === 'founder-previous-experience' ? "Founder's Previous Experience" : 'SQUARGRAPH™ Work';
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function render(entry) {
    var card = make('article', 'work-entry');
    if (entry.id) card.id = 'work-' + entry.id;
    card.dataset.categories = (entry.category || []).map(function (item) { return item.toLowerCase(); }).join(' ');
    card.dataset.relationship = entry.relationship;

    var media = make('div', 'work-entry-media');
    if (entry.image) {
      var image = document.createElement('img');
      image.src = entry.image;
      image.alt = entry.imageAlt || '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.width = 800;
      image.height = 500;
      media.appendChild(image);
    } else {
      media.classList.add('work-entry-media--system');
      media.setAttribute('aria-hidden', 'true');
    }

    var body = make('div', 'work-entry-body');
    var top = make('div', 'work-entry-topline');
    top.appendChild(make('span', 'work-relationship', relationshipLabel(entry.relationship)));
    top.appendChild(make('span', 'work-categories', (entry.category || []).join(' · ')));
    body.appendChild(top);
    body.appendChild(make('h3', '', entry.title));
    body.appendChild(make('p', 'work-entry-summary', entry.summary));

    var details = make('div', 'work-entry-details');
    var role = make('div');
    role.appendChild(make('span', '', 'Role'));
    role.appendChild(make('p', '', entry.role));
    details.appendChild(role);
    var outputs = make('div');
    outputs.appendChild(make('span', '', 'Selected outputs'));
    outputs.appendChild(make('p', '', (entry.outputs || []).join(', ')));
    details.appendChild(outputs);
    body.appendChild(details);

    if (entry.url) {
      var link = make('a', 'work-entry-link', entry.linkLabel || 'View context');
      link.href = entry.url;
      link.setAttribute('data-sq-event', 'work_card_click');
      if (entry.external === true) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      body.appendChild(link);
    }

    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  function applyFilter(filter) {
    var visibleCount = 0;
    grids.forEach(function (grid) {
      var gridVisible = 0;
      Array.prototype.forEach.call(grid.children, function (card) {
        var categories = card.dataset.categories || '';
        var matches = filter === 'all' || categories.split(' ').indexOf(filter) !== -1;
        card.hidden = !matches;
        if (matches) {
          gridVisible += 1;
          visibleCount += 1;
        }
      });
      var section = grid.closest('[data-work-section]');
      if (section && section.id === 'previous-experience') section.hidden = gridVisible === 0;
    });
    filters.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.workFilter === filter));
    });
    if (status) status.textContent = visibleCount + (visibleCount === 1 ? ' work entry shown.' : ' work entries shown.');
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () { applyFilter(button.dataset.workFilter); });
  });

  fetch('/assets/data/work.json')
    .then(function (response) { if (!response.ok) throw new Error('Work data unavailable'); return response.json(); })
    .then(function (data) {
      var entries = (data.entries || []).filter(function (entry) { return entry.published === true; });
      if (!entries.length) return;
      if (squargraphGrid) {
        squargraphGrid.replaceChildren();
        entries.filter(function (entry) { return entry.relationship === 'squargraph'; })
          .forEach(function (entry) { squargraphGrid.appendChild(render(entry)); });
      }
      if (previousGrid) {
        previousGrid.replaceChildren();
        entries.filter(function (entry) { return entry.relationship === 'founder-previous-experience'; })
          .forEach(function (entry) { previousGrid.appendChild(render(entry)); });
      }
      applyFilter('all');
      if (window.location.hash) {
        var anchor = document.getElementById(window.location.hash.slice(1));
        if (anchor) window.requestAnimationFrame(function () { anchor.scrollIntoView({ block: 'start' }); });
      }
    })
    .catch(function () {
      applyFilter('all');
    });
}());
