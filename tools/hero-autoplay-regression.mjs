import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/js/hero-collage-motion.js',import.meta.url),'utf8');
const events={},windowEvents={},mediaEvents={}; let observer;
const videos=Array.from({length:12},()=>({muted:false,paused:true,playbackRate:0,events:{},play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true},addEventListener(name,fn){this.events[name]=fn}}));
const reduce={matches:false,addEventListener:(name,fn)=>mediaEvents[name]=fn};
const document={hidden:false,querySelector:()=>({querySelectorAll:()=>videos}),addEventListener:(name,fn)=>events[name]=fn};
class IntersectionObserver {constructor(fn){observer=fn}observe(){}}
vm.runInNewContext(source,{document,matchMedia:()=>reduce,window:{IntersectionObserver,addEventListener:(name,fn)=>windowEvents[name]=fn},IntersectionObserver});
const playing=()=>assert.ok(videos.every(v=>!v.paused&&v.muted&&v.defaultMuted&&v.playbackRate===1));
playing();
observer([{isIntersecting:false}]);assert.ok(videos.every(v=>v.paused));
observer([{isIntersecting:true}]);playing();
document.hidden=true;events.visibilitychange();assert.ok(videos.every(v=>v.paused));
document.hidden=false;events.visibilitychange();playing();
reduce.matches=true;mediaEvents.change();assert.ok(videos.every(v=>v.paused));
reduce.matches=false;mediaEvents.change();playing();
windowEvents.pageshow();playing();
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const hero=html.slice(html.indexOf('<section id="hero"'),html.indexOf('</section>',html.indexOf('<section id="hero"')));
assert.equal((hero.match(/<video /g)||[]).length,12);
assert.ok(!hero.includes('data-hero-video='));
for(const match of hero.matchAll(/<video src="([^"]+)"[^>]*>/g)){assert.match(match[0],/autoplay muted loop playsinline/);await readFile(new URL('..'+match[1],import.meta.url));}
console.log('Hero autoplay passed: immediate muted native playback, offscreen pause, visibility/pageshow resume, reduced motion, and 12 local clips.');
