'use strict';
(function () {
  var frames = document.querySelectorAll('[data-native-preview]');
  var controllers = [];
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  frames.forEach(function (frame) {
    var video = frame.querySelector('video');
    if (!video) return;
    var visible = false;
    var audioBlocked = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playbackRate = 1;
    function state() { frame.setAttribute('aria-pressed', String(!video.muted)); }
    function mute() { video.muted = true; state(); }
    function play() {
      if (!visible || document.hidden) return;
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.playbackRate = 1;
      var attempt = video.play();
      if (attempt) attempt.catch(function () {
        if (!visible || document.hidden) return;
        if (!video.muted) audioBlocked = true;
        mute();
        var retry = video.play();
        if (retry) retry.catch(function () {});
      });
    }
    function sound(on) {
      if (on && audioBlocked) return;
      if (on) controllers.forEach(function (other) { if (other.video !== video) other.mute(); });
      video.muted = !on;
      if (on) { video.volume = 1; play(); }
      state();
    }
    var controller = { video: video, resume: play, mute: mute, resetAudio: function () { audioBlocked = false; } };
    controllers.push(controller);
    frame.setAttribute('role', 'button');
    state();
    video.addEventListener('canplay', play);
    frame.addEventListener('pointerenter', function (event) {
      if (finePointer.matches && event.pointerType !== 'touch') sound(true);
    });
    frame.addEventListener('pointermove', function (event) {
      if (finePointer.matches && event.pointerType !== 'touch' && video.muted) sound(true);
    });
    frame.addEventListener('pointerleave', function (event) {
      if (finePointer.matches && event.pointerType !== 'touch') mute();
    });
    // Touch focus must not unmute before click, or the same tap mutes again.
    frame.addEventListener('focusout', mute);
    frame.addEventListener('click', function (event) {
      audioBlocked = false;
      if (finePointer.matches && event.pointerType !== 'touch') sound(true);
      else sound(video.muted);
    });
    frame.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      audioBlocked = false;
      sound(video.muted);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) play();
        else { mute(); video.pause(); }
      }, { threshold: .1 }).observe(frame);
    } else { visible = true; play(); }
  });
  document.addEventListener('pointerdown', function () {
    controllers.forEach(function (controller) { controller.resetAudio(); });
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    controllers.forEach(function (controller) {
      if (document.hidden) { controller.mute(); controller.video.pause(); }
      else controller.resume();
    });
  });
}());
