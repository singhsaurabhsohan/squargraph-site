import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/js/home-motion.js',import.meta.url),'utf8');
async function check(fine) {
  const frames=[]; const observers=[]; const documentEvents={}; let blockSound=false;
  for(let i=0;i<2;i++) {
    const listeners={};
    const video={dataset:{src:'/preview.mp4'},muted:false,paused:true,playbackRate:0,
      getAttribute:()=>video.src||null,addEventListener(){},
      play(){if(blockSound&&!video.muted){video.paused=true;return Promise.reject(Error('Audio blocked'))}video.paused=false;return Promise.resolve()},
      pause(){video.paused=true}};
    frames.push({video,listeners,querySelector:()=>video,addEventListener:(event,fn)=>listeners[event]=fn});
  }
  const doc={hidden:false,querySelectorAll:()=>frames,addEventListener:(event,fn)=>documentEvents[event]=fn};
  class Observer {constructor(fn){this.fn=fn;observers.push(this)}observe(){this.fn([{isIntersecting:true}])}}
  vm.runInNewContext(source,{document:doc,window:{matchMedia:()=>({matches:fine}),IntersectionObserver:Observer},IntersectionObserver:Observer});
  assert.ok(frames.every(f=>!f.video.paused&&f.video.muted&&f.video.playbackRate===1),'Every visible preview must autoplay muted at normal speed, with no button or click');
  if(fine) {
    frames[0].listeners.pointermove({pointerType:'mouse'});
    assert.equal(frames[0].video.muted,false);
    frames[1].listeners.pointerenter({pointerType:'mouse'});
    assert.equal(frames[0].video.muted,true);
    assert.equal(frames[1].video.muted,false);
    frames[1].listeners.pointerleave();
    assert.equal(frames[1].video.muted,true);
    blockSound=true;
    frames[0].listeners.pointerenter({pointerType:'mouse'});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(frames[0].video.muted,true,'Blocked audio must fall back to muted playback');
    assert.equal(frames[0].video.paused,false,'Blocked audio must not freeze the video');
  } else {
    frames[0].listeners.pointermove({pointerType:'touch'});
    assert.equal(frames[0].video.muted,true,'Touch scrolling must not change audio');
  }
  observers[0].fn([{isIntersecting:false}]);
  assert.equal(frames[0].video.paused,true);
  doc.hidden=true;documentEvents.visibilitychange();
  assert.ok(frames.every(f=>f.video.paused&&f.video.muted));
  doc.hidden=false;documentEvents.visibilitychange();
  assert.equal(frames[0].video.paused,true,'Offscreen previews must stay paused');
  assert.equal(frames[1].video.paused,false);
  observers[0].fn([{isIntersecting:true}]);
  assert.equal(frames[0].video.paused,false);
}
await check(true); await check(false);
console.log('Native preview checks passed: autoplay without interaction, hover sound, blocked-audio recovery, touch scrolling, and visibility resume.');
