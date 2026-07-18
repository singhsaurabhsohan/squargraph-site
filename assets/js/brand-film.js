(function () {
  function init(root) {
    if (!window.playerjs || !window.playerjs.Player) return;

    (root || document).querySelectorAll('[data-gumlet-loop]').forEach(function (container) {
      if (container.dataset.gumletReady === 'true') return;

      var iframe = container.querySelector('iframe');
      var audioButton = container.querySelector('[data-gumlet-audio]');
      if (!iframe || !audioButton) return;

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
    });
  }

  document.addEventListener('DOMContentLoaded', function () { init(document); });
  document.addEventListener('sq:work-rendered', function () { init(document); });
})();
