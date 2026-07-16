(function () {
  var iframe = document.getElementById('brand-film-iframe');
  var audioButton = document.getElementById('brand-film-audio');

  if (!iframe || !audioButton) return;

  var playerOrigin = new URL(iframe.src).origin;
  var isMuted = true;

  function sendPlayerCommand(method, value) {
    if (!iframe.contentWindow) return;

    var message = {
      context: 'player.js',
      version: '3.0',
      method: method
    };

    if (typeof value !== 'undefined') message.value = value;
    iframe.contentWindow.postMessage(JSON.stringify(message), playerOrigin);
  }

  function updateAudioButton() {
    audioButton.setAttribute('aria-pressed', String(!isMuted));
    audioButton.setAttribute('aria-label', isMuted ? 'Unmute brand film' : 'Mute brand film');
    audioButton.setAttribute('title', isMuted ? 'Unmute brand film' : 'Mute brand film');
  }

  audioButton.addEventListener('click', function () {
    if (isMuted) {
      sendPlayerCommand('setVolume', 100);
      sendPlayerCommand('unmute');
      isMuted = false;
    } else {
      sendPlayerCommand('mute');
      isMuted = true;
    }

    updateAudioButton();
  });

  iframe.addEventListener('load', function () {
    sendPlayerCommand('setLoop', true);
    if (isMuted) {
      sendPlayerCommand('mute');
    } else {
      sendPlayerCommand('setVolume', 100);
      sendPlayerCommand('unmute');
    }
    sendPlayerCommand('play');
  });
})();
