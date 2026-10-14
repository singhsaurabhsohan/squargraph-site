(function () {
  const widget = document.querySelector('[data-welcome-sound]');
  if (!widget) return;
  const audio = widget.querySelector('audio');
  const button = widget.querySelector('button');
  const label = button.querySelector('span');
  const read = (store, key) => { try { return window[store].getItem(key); } catch (_) { return null; } };
  const write = (store, key, value) => { try { window[store].setItem(key, value); } catch (_) {} };
  let muted = read('localStorage', 'sq-welcome-muted') === 'true';
  let welcomed = read('sessionStorage', 'sq-welcome-played') === 'true';
  let pending = false;
  audio.volume = 0.65;

  function update() {
    const playing = !audio.paused && !audio.ended;
    label.textContent = playing ? 'Mute welcome' : muted ? 'Sound off' : welcomed ? 'Replay welcome' : 'Welcome sound';
    button.setAttribute('aria-label', playing ? 'Mute welcome greeting' : 'Play welcome greeting');
    button.setAttribute('aria-pressed', String(playing));
  }
  function play(manual) {
    if (pending || document.hidden || (!manual && (muted || welcomed))) return;
    pending = true;
    audio.currentTime = 0;
    audio.play().then(() => {
      welcomed = true;
      write('sessionStorage', 'sq-welcome-played', 'true');
    }).catch(() => {
      // Browsers may require a click or tap before allowing audible playback.
    }).finally(() => { pending = false; update(); });
  }
  button.addEventListener('click', () => {
    if (!audio.paused) {
      audio.pause();
      muted = true;
      write('localStorage', 'sq-welcome-muted', 'true');
    } else {
      muted = false;
      write('localStorage', 'sq-welcome-muted', 'false');
      play(true);
    }
    update();
  });
  function firstInteraction(event) {
    if (widget.contains(event.target)) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    play(false);
  }
  document.addEventListener('pointerdown', firstInteraction, { passive:true });
  document.addEventListener('keydown', firstInteraction);
  document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); else play(false); update(); });
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('ended', update);
  audio.addEventListener('error', () => { widget.hidden = true; });
  update();
  play(false);
})();
