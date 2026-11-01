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
    function play() {
      if (!visible || document.hidden) return;
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.playbackRate = 1;
      var attempt = video.play();
      if (attempt) attempt.catch(function () {
        if (!visible || document.hidden) return;
        // Blocked audible playback must never stop the muted preview.
        if (!video.muted) audioBlocked = true;
        video.muted = true;
        var retry = video.play();
        if (retry) retry.catch(function () {});
      });
    }
    function sound(on) {
      if (on && audioBlocked) return;
      if (on) controllers.forEach(function (other) { if (other.video !== video) other.video.muted = true; });
      video.muted = !on;
      if (on) play();
    }
    var controller = { video: video, resume: play, resetAudio: function () { audioBlocked = false; } };
    controllers.push(controller);
    video.addEventListener('canplay', play);
    frame.addEventListener('pointerenter', function (event) {
      if (finePointer.matches && event.pointerType !== 'touch') sound(true);
    });
    frame.addEventListener('pointermove', function (event) {
      if (finePointer.matches && event.pointerType !== 'touch' && video.muted) sound(true);
    });
    frame.addEventListener('pointerleave', function () { sound(false); });
    frame.addEventListener('focusin', function () { sound(true); });
    frame.addEventListener('focusout', function () { sound(false); });
    frame.addEventListener('click', function (event) {
      if (!finePointer.matches || event.pointerType === 'touch') sound(video.muted);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) play();
        else { video.muted = true; video.pause(); }
      }, { threshold: .1 }).observe(frame);
    } else { visible = true; play(); }
  });
  document.addEventListener('pointerdown', function () {
    controllers.forEach(function (controller) { controller.resetAudio(); });
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    controllers.forEach(function (controller) {
      if (document.hidden) { controller.video.muted = true; controller.video.pause(); }
      else controller.resume();
    });
  });
}());
