(function () {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const videos = Array.from(hero.querySelectorAll('.hero-tile-video video'));
  let visible = true;
  function sync() {
    videos.forEach(video => {
      video.muted = true;
      video.defaultMuted = true;
      video.playbackRate = 1;
      if (reduce.matches || document.hidden || !visible) {
        video.pause();
        return;
      }
      // Native muted playback does not need player SDKs or a visitor gesture.
      const playing = video.play();
      if (playing) playing.catch(() => {}); // Readiness/pageshow events retry interrupted loads.
    });
  }
  videos.forEach(video => {
    video.addEventListener('canplay', sync);
    video.addEventListener('loadeddata', sync);
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', sync);
  reduce.addEventListener('change', sync);
  sync();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, {threshold: .05}).observe(hero);
  }
})();
