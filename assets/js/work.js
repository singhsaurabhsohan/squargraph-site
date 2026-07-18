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

  var motionFilms = [
    { title: 'Campaign film one', poster: '/film1.webp', id: '6a08955d0ed6988dba1990e6' },
    { title: 'Campaign film two', poster: '/film2.webp', id: '6a08955d0ed6988dba1990e1' }
  ];

  var motionReels = [
    { title: 'Reel one', poster: '/reel1.webp', id: '6a0896763a5246215d47a7fd' },
    { title: 'Reel two', poster: '/reel2.webp', id: '6a08955d3a5246215d479670' },
    { title: 'Reel three', poster: '/reel3.webp', id: '6a08955d0143a2000b232aad' },
    { title: 'Reel four', poster: '/reel4.webp', id: '6a0896160ed6988dba199c1a' },
    { title: 'Reel five', poster: '/reel5.webp', id: '6a0896760143a2000b233c09' },
    { title: 'Reel six', poster: '/reel6.webp', id: '6a20aee640fe2ab62837d2c7' },
    { title: 'Reel seven', poster: '/reel7.webp', id: '6a20b11240fe2ab62837f6ce' },
    { title: 'Reel eight', poster: '/reel8.webp', id: '6a20b4f340fe2ab628383a81' },
    { title: 'Reel nine', poster: '/reel9.webp', id: '6a20ba6b40fe2ab6283896e4' }
  ];

  function motionCard(item, isReel) {
    var card = make('div', 'work-motion-card ' + (isReel ? 'work-motion-card--reel' : 'work-motion-card--film'));
    var poster = make('button', 'reel-poster work-motion-poster');
    poster.type = 'button';
    poster.dataset.title = item.title;
    poster.dataset.src = 'https://play.gumlet.io/embed/' + item.id + '?autoplay=true&muted=true&loop=true&disable_player_controls=true';
    poster.style.backgroundImage = 'url("' + item.poster + '")';
    poster.setAttribute('aria-label', 'Play ' + item.title.toLowerCase());
    poster.innerHTML = '<span class="work-motion-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 11 7-11 7V5Z"></path></svg></span>';
    card.appendChild(poster);
    return card;
  }

  function motionGroup(label, count, items, isReel) {
    var group = make('div', 'work-motion-group');
    var meta = make('p', 'work-motion-label');
    meta.appendChild(make('span', '', label));
    meta.appendChild(make('span', '', count));
    group.appendChild(meta);
    var collection = make('div', isReel ? 'work-motion-reels' : 'work-motion-films');
    collection.id = isReel ? 'reels-strip' : 'films-strip';
    items.forEach(function (item) { collection.appendChild(motionCard(item, isReel)); });
    group.appendChild(collection);
    return group;
  }

  function renderMotionShowcase() {
    if (document.getElementById('motion-work')) return;
    var previousSection = document.getElementById('previous-experience');
    if (!previousSection || !previousSection.parentNode) return;

    var section = make('section', 'destination-section destination-section--white');
    section.id = 'motion-work';
    var shell = make('div', 'destination-shell');
    var head = make('div', 'work-motion-head');
    var title = make('div');
    title.appendChild(make('p', 'destination-kicker', 'Campaign films & reels'));
    title.appendChild(make('h2', '', 'Systems in motion.'));
    head.appendChild(title);
    head.appendChild(make('p', '', 'Selected campaign films and short-form content shaped across production, narrative and digital surfaces.'));
    shell.appendChild(head);
    shell.appendChild(motionGroup('Campaign films', '02 films', motionFilms, false));
    var reels = motionGroup('Reels', '09 reels', motionReels, true);
    var credit = make('p', 'work-motion-credit', 'Created in collaboration with ');
    var creditLink = make('a', '', 'Films By Jones');
    creditLink.href = 'https://www.instagram.com/filmsbyjones/';
    creditLink.target = '_blank';
    creditLink.rel = 'noopener noreferrer';
    credit.appendChild(creditLink);
    credit.appendChild(document.createTextNode('.'));
    reels.appendChild(credit);
    shell.appendChild(reels);
    section.appendChild(shell);
    previousSection.parentNode.insertBefore(section, previousSection);
  }

  function renderExperienceVisual(media, visualType) {
    if (visualType === 'mandate-system') {
      media.classList.add('work-experience-visual', 'work-experience-visual--mandate');
      media.setAttribute('role', 'img');
      media.setAttribute('aria-label', 'Campaign system board showing launch, content, creators, public relations and experience aligned around brand intent');
      media.innerHTML = '<span class="work-system-caption">Connected mandate</span><span class="work-system-line work-system-line--launch"></span><span class="work-system-line work-system-line--content"></span><span class="work-system-line work-system-line--creators"></span><span class="work-system-line work-system-line--pr"></span><span class="work-system-line work-system-line--experience"></span><span class="work-system-core">Brand<br>intent</span><span class="work-system-node work-system-node--launch">Launch</span><span class="work-system-node work-system-node--content">Content</span><span class="work-system-node work-system-node--creators">Creators</span><span class="work-system-node work-system-node--pr">PR</span><span class="work-system-node work-system-node--experience">Experience</span>';
      return true;
    }
    if (visualType === 'campaign-timeline') {
      media.classList.add('work-experience-visual', 'work-experience-visual--timeline');
      media.setAttribute('role', 'img');
      media.setAttribute('aria-label', 'Operating board showing strategy, content, creators, public relations, production and reporting moving in one coordinated rhythm');
      media.innerHTML = '<span class="work-system-caption">Integrated operating rhythm</span><div class="work-timeline-rows"><div class="work-timeline-row"><span>Strategy</span><span class="work-timeline-track"><i></i><i></i><i></i><i></i></span></div><div class="work-timeline-row"><span>Content</span><span class="work-timeline-track work-timeline-track--shift"><i></i><i></i><i></i><i></i></span></div><div class="work-timeline-row"><span>Creators</span><span class="work-timeline-track"><i></i><i></i><i></i><i></i></span></div><div class="work-timeline-row"><span>PR</span><span class="work-timeline-track work-timeline-track--shift"><i></i><i></i><i></i><i></i></span></div><div class="work-timeline-row"><span>Production</span><span class="work-timeline-track"><i></i><i></i><i></i><i></i></span></div><div class="work-timeline-row"><span>Reporting</span><span class="work-timeline-track work-timeline-track--shift"><i></i><i></i><i></i><i></i></span></div></div><span class="work-system-note">One direction across every workstream.</span>';
      return true;
    }
    return false;
  }

  function render(entry) {
    var card = make('article', 'work-entry');
    if (entry.id) card.id = 'work-' + entry.id;
    card.dataset.categories = (entry.category || []).map(function (item) { return item.toLowerCase(); }).join(' ');
    card.dataset.relationship = entry.relationship;

    var media = make('div', 'work-entry-media');
    if (renderExperienceVisual(media, entry.visualType)) {
      // The system board is rendered from verified, non-client-specific information.
    } else if (entry.videoEmbed) {
      media.classList.add('work-entry-media--video');
      media.dataset.gumletLoop = '';

      var iframe = document.createElement('iframe');
      iframe.src = entry.videoEmbed;
      iframe.title = entry.videoTitle || entry.imageAlt || entry.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.referrerPolicy = 'origin';
      iframe.loading = 'eager';
      iframe.setAttribute('allowfullscreen', '');
      media.appendChild(iframe);

      var audioButton = make('button', 'work-video-audio');
      audioButton.type = 'button';
      audioButton.dataset.gumletAudio = '';
      audioButton.setAttribute('aria-pressed', 'false');
      audioButton.setAttribute('aria-label', 'Unmute brand film');
      audioButton.setAttribute('title', 'Unmute brand film');
      audioButton.innerHTML = '<svg class="work-video-audio-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="m22 9-6 6"></path><path d="m16 9 6 6"></path></svg><svg class="work-video-audio-playing" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path></svg>';
      media.appendChild(audioButton);
    } else if (entry.image) {
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
    role.appendChild(make('span', '', entry.relationship === 'founder-previous-experience' ? 'Relationship' : 'Role'));
    role.appendChild(make('p', '', entry.role));
    details.appendChild(role);
    var outputs = make('div');
    outputs.appendChild(make('span', '', entry.relationship === 'founder-previous-experience' ? 'Scope' : 'Selected outputs'));
    outputs.appendChild(make('p', '', (entry.outputs || []).join(', ')));
    details.appendChild(outputs);
    body.appendChild(details);

    if (entry.url && !entry.videoEmbed) {
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

  renderMotionShowcase();

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
      document.dispatchEvent(new CustomEvent('sq:work-rendered'));
    })
    .catch(function () {
      applyFilter('all');
    });
}());
