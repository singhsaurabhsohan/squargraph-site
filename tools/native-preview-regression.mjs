import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/js/home-motion.js',import.meta.url),'utf8');
async function check(fine) {
 const frames=[],observers=[],events={};let blockSound=false;
 for(let i=0;i<2;i++) {
  const listeners={},attrs={};
  const video={dataset:{src:'/preview.mp4'},muted:false,paused:true,playbackRate:0,getAttribute:()=>video.src||null,addEventListener(){},play(){if(blockSound&&!video.muted){video.paused=true;return Promise.reject(Error('Audio blocked'))}video.paused=false;return Promise.resolve()},pause(){video.paused=true}};
  frames.push({video,listeners,attrs,querySelector:()=>video,addEventListener:(name,fn)=>listeners[name]=fn,setAttribute:(name,value)=>attrs[name]=value});
 }
 const doc={hidden:false,querySelectorAll:()=>frames,addEventListener:(name,fn)=>events[name]=fn};
 class Observer {constructor(fn){this.fn=fn;observers.push(this)}observe(){this.fn([{isIntersecting:true}])}}
 vm.runInNewContext(source,{document:doc,window:{matchMedia:()=>({matches:fine}),IntersectionObserver:Observer},IntersectionObserver:Observer});
 assert.ok(frames.every(f=>!f.video.paused&&f.video.muted&&f.video.playbackRate===1));
 if(fine) {
  frames[0].listeners.pointermove({pointerType:'mouse'});assert.equal(frames[0].video.muted,false);
  frames[1].listeners.pointerenter({pointerType:'mouse'});assert.equal(frames[0].video.muted,true);assert.equal(frames[1].video.muted,false);
  frames[1].listeners.pointerleave({pointerType:'mouse'});assert.equal(frames[1].video.muted,true);
  blockSound=true;frames[0].listeners.pointerenter({pointerType:'mouse'});await new Promise(r=>setImmediate(r));
  assert.equal(frames[0].video.muted,true);assert.equal(frames[0].video.paused,false);
  blockSound=false;frames[0].listeners.click({pointerType:'mouse'});assert.equal(frames[0].video.muted,false,'A real click must retry previously blocked hover audio');
 } else {
  frames[0].listeners.pointermove({pointerType:'touch'});assert.equal(frames[0].video.muted,true);
  if(frames[0].listeners.focusin)frames[0].listeners.focusin({});
  frames[0].listeners.click({pointerType:'touch'});
  assert.equal(frames[0].video.muted,false,'First touch must enable sound, not toggle focus audio back off');
  frames[0].listeners.pointerleave({pointerType:'touch'});assert.equal(frames[0].video.muted,false,'Synthetic touch leave must not mute the new audio');
  assert.equal(frames[0].attrs['aria-pressed'],'true');
  frames[1].listeners.click({pointerType:'touch'});assert.equal(frames[0].video.muted,true);assert.equal(frames[1].video.muted,false);
  frames[1].listeners.click({pointerType:'touch'});assert.equal(frames[1].video.muted,true);
 }
 frames[0].listeners.focusout();
 frames[0].listeners.keydown({key:'Enter',preventDefault(){}});assert.equal(frames[0].video.muted,false);
 frames[0].listeners.focusout();assert.equal(frames[0].video.muted,true);
 observers[0].fn([{isIntersecting:false}]);assert.equal(frames[0].video.paused,true);
 doc.hidden=true;events.visibilitychange();assert.ok(frames.every(f=>f.video.paused&&f.video.muted));
 doc.hidden=false;events.visibilitychange();assert.equal(frames[0].video.paused,true);assert.equal(frames[1].video.paused,false);
 observers[0].fn([{isIntersecting:true}]);assert.equal(frames[0].video.paused,false);
}
await check(true);await check(false);
console.log('Native previews passed: muted autoplay, first-touch audio, touch leave, exclusive sound, keyboard, blocked-audio recovery and visibility resume.');
