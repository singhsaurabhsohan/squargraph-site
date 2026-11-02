(function () {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 1050px)');
  const phone = matchMedia('(max-width: 760px)');
  const tiles = Array.from(hero.querySelectorAll('.hero-tile-video video'));
  const mobile = hero.querySelector('[data-hero-mobile]');
  let visible = true;
  function unload(video) {
    video.pause();
    if (video.getAttribute('src')) { video.removeAttribute('src'); video.load(); }
  }
  function sync() {
    hero.classList.toggle('hero-compact-motion', compact.matches);
    const active = compact.matches && mobile ? [mobile] : tiles;
    const inactive = compact.matches && mobile ? tiles : (mobile ? [mobile] : []);
    inactive.forEach(unload);
    active.forEach(video => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.playbackRate = 1;
      if (reduce.matches || document.hidden || !visible) { video.pause(); return; }
      const source = video === mobile ? (phone.matches ? mobile.dataset.phoneSrc : mobile.dataset.tabletSrc) : video.dataset.heroSrc;
      if (video.getAttribute('src') !== source) video.src = source;
      const playing = video.play();
      if (playing) playing.catch(() => {});
    });
    if (!compact.matches || reduce.matches) hero.classList.remove('hero-mobile-playing');
  }
  tiles.concat(mobile ? [mobile] : []).forEach(video => video.addEventListener('canplay', sync));
  if (mobile) mobile.addEventListener('playing', () => {
    if (compact.matches && !reduce.matches) hero.classList.add('hero-mobile-playing');
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', sync);
  // If the browser blocks autoplay in battery-saving mode, the first real gesture retries it.
  document.addEventListener('touchend', sync, {passive:true});
  document.addEventListener('pointerup', sync, {passive:true});
  document.addEventListener('keydown', sync);
  reduce.addEventListener('change', sync);
  compact.addEventListener('change', sync);
  phone.addEventListener('change', sync);
  sync();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold:.01}).observe(hero);
  }
})();
