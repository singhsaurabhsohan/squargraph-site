(function () {
  const widget = document.querySelector('[data-welcome-sound]');
  if (!widget) return;
  const audio = widget.querySelector('audio');
  const mute = widget.querySelector('button');
  let welcomed = false;
  let pending = false;
  audio.volume = 0.65;
  function update() {
    // Only a stop control is shown, and only while the greeting is playing.
    mute.hidden = audio.paused || audio.ended;
  }
  function play() {
    if (pending || welcomed || document.hidden) return;
    pending = true;
    audio.play().then(() => {
      welcomed = true;
      document.removeEventListener('pointerdown', firstInteraction);
      document.removeEventListener('keydown', firstInteraction);
    }).catch(() => {
      // Audible autoplay may require the visitor's first interaction.
    }).finally(() => { pending = false; update(); });
  }
  function firstInteraction(event) {
    if (widget.contains(event.target)) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    play();
  }
  mute.addEventListener('click', () => { welcomed = true; audio.pause(); update(); });
  document.addEventListener('pointerdown', firstInteraction, { passive:true });
  document.addEventListener('keydown', firstInteraction);
  document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); else play(); update(); });
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('ended', update);
  audio.addEventListener('error', () => { widget.hidden = true; });
  update();
  play();
})();
