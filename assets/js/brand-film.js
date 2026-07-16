(function () {
  var iframe = document.getElementById('brand-film-iframe');
  var audioButton = document.getElementById('brand-film-audio');

  if (!iframe || !audioButton) return;

  var player = null;
  var isMuted = true;

  function updateAudioButton() {
    audioButton.setAttribute('aria-pressed', String(!isMuted));
    audioButton.setAttribute('aria-label', isMuted ? 'Unmute brand film' : 'Mute brand film');
    audioButton.setAttribute('title', isMuted ? 'Unmute brand film' : 'Mute brand film');
  }

  function initialisePlayer(attempt) {
    if (!window.playerjs || !window.playerjs.Player) {
      if (attempt < 40) window.setTimeout(function () { initialisePlayer(attempt + 1); }, 100);
      return;
    }

    player = new window.playerjs.Player(iframe);

    player.on('ready', async function () {
      try {
        await player.setLoop(true);
        await player.mute();
        await player.play();
        isMuted = true;
        updateAudioButton();
        audioButton.disabled = false;
        audioButton.classList.add('is-ready');
      } catch (error) {
        audioButton.disabled = true;
      }
    });

    player.on('ended', async function () {
      try {
        await player.setCurrentTime(0);
        await player.play();
      } catch (error) {
        // The URL loop parameter remains the playback fallback.
      }
    });
  }

  audioButton.addEventListener('click', async function () {
    if (!player) return;

    audioButton.disabled = true;

    try {
      if (isMuted) {
        await player.unmute();
        isMuted = false;
      } else {
        await player.mute();
        isMuted = true;
      }

      updateAudioButton();
    } finally {
      audioButton.disabled = false;
      audioButton.focus();
    }
  });

  initialisePlayer(0);
})();
