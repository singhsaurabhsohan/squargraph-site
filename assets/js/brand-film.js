(function () {
  var playerApiPromise = null;

  function loadPlayerApi() {
    if (window.playerjs && window.playerjs.Player) return Promise.resolve();
    if (playerApiPromise) return playerApiPromise;

    playerApiPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-gumlet-player-api]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@gumlet/player.js@3.0.8/dist/main.global.js';
      script.async = true;
      script.dataset.gumletPlayerApi = '';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });

    return playerApiPromise;
  }

  function mount(container) {
    if (container.dataset.gumletReady === 'true' || container.dataset.gumletLoading === 'true') return;

    var iframe = container.querySelector('iframe');
    var audioButton = container.querySelector('[data-gumlet-audio]');
    if (!iframe || !audioButton) return;

    container.dataset.gumletLoading = 'true';
    audioButton.disabled = true;
    if (!iframe.getAttribute('src') && iframe.dataset.src) iframe.src = iframe.dataset.src;

    loadPlayerApi().then(function () {
      if (!window.playerjs || !window.playerjs.Player) throw new Error('Gumlet player API unavailable');

      delete container.dataset.gumletLoading;
      container.dataset.gumletReady = 'true';
      var player = new window.playerjs.Player(iframe);
      var isMuted = true;

      function updateButton() {
        audioButton.setAttribute('aria-pressed', String(!isMuted));
        audioButton.setAttribute('aria-label', isMuted ? 'Unmute brand film' : 'Mute brand film');
        audioButton.setAttribute('title', isMuted ? 'Unmute brand film' : 'Mute brand film');
      }

      player.on('ready', function () {
        player.setLoop(true).catch(function () {});
        player.mute().catch(function () {});
        player.play().catch(function () {});
        audioButton.disabled = false;
        container.classList.add('is-player-ready');
      });

      audioButton.addEventListener('click', function () {
        isMuted = !isMuted;
        updateButton();

        if (isMuted) {
          player.mute().catch(function () {});
        } else {
          player.unmute().catch(function () {});
          player.setVolume(100).catch(function () {});
        }
      });

      updateButton();
    }).catch(function () {
      delete container.dataset.gumletLoading;
      audioButton.disabled = true;
      audioButton.setAttribute('aria-label', 'Brand film audio unavailable');
    });
  }

  function observe(container) {
    if (container.dataset.gumletObserved === 'true') return;
    container.dataset.gumletObserved = 'true';

    if (!('IntersectionObserver' in window)) {
      mount(container);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      observer.disconnect();
      mount(container);
    }, { rootMargin: '240px 0px' });

    observer.observe(container);
  }

  function init(root) {
    (root || document).querySelectorAll('[data-gumlet-loop]').forEach(observe);
  }

  document.addEventListener('DOMContentLoaded', function () { init(document); });
  document.addEventListener('sq:work-rendered', function () { init(document); });
})();
