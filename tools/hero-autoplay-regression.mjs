import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/js/hero-collage-motion.js',import.meta.url),'utf8');
async function check(compactMode,phoneMode) {
 const events={},winEvents={},queries={};let observer,blocked=false;
 for(const [query,matches]of [['(prefers-reduced-motion: reduce)',false],['(max-width: 1050px)',compactMode],['(max-width: 760px)',phoneMode]]) queries[query]={matches,addEventListener(name,fn){this.change=fn}};
 function makeVideo(id){const attrs={},listeners={};let v={dataset:{heroSrc:'/tile-'+id+'.mp4'},muted:false,paused:true,playbackRate:0,listeners,getAttribute:n=>attrs[n]||null,removeAttribute:n=>delete attrs[n],load(){},pause(){this.paused=true},play(){if(blocked){this.paused=true;return Promise.reject(Error('Policy blocked'))}this.paused=false;listeners.playing?.();return Promise.resolve()},addEventListener:(n,fn)=>listeners[n]=fn};Object.defineProperty(v,'src',{get:()=>attrs.src,set:x=>attrs.src=x});return v}
 const tiles=Array.from({length:12},(_,i)=>makeVideo(i)),mobile=makeVideo('mobile');mobile.dataset={phoneSrc:'/phone.mp4',tabletSrc:'/tablet.mp4'};
 const classes=new Set(),hero={querySelectorAll:()=>tiles,querySelector:()=>mobile,classList:{toggle(n,on){on?classes.add(n):classes.delete(n)},add:n=>classes.add(n),remove:n=>classes.delete(n)}};
 const doc={hidden:false,querySelector:()=>hero,addEventListener:(n,fn)=>events[n]=fn};
 class Observer{constructor(fn){observer=fn}observe(){}}
 vm.runInNewContext(source,{document:doc,matchMedia:q=>queries[q],window:{IntersectionObserver:Observer,addEventListener:(n,fn)=>winEvents[n]=fn},IntersectionObserver:Observer});
 let active=compactMode?[mobile]:tiles,inactive=compactMode?tiles:[mobile];
 const playing=()=>assert.ok(active.every(v=>!v.paused&&v.muted&&v.defaultMuted&&v.playsInline&&v.playbackRate===1));playing();
 assert.ok(inactive.every(v=>v.paused&&!v.getAttribute('src')),'Inactive videos must not download or decode');
 if(compactMode){assert.equal(mobile.src,phoneMode?'/phone.mp4':'/tablet.mp4');assert.ok(classes.has('hero-mobile-playing'))}
 observer([{isIntersecting:false}]);assert.ok(active.every(v=>v.paused));observer([{isIntersecting:true}]);playing();
 doc.hidden=true;events.visibilitychange();assert.ok(active.every(v=>v.paused));doc.hidden=false;events.visibilitychange();playing();
 const reduced=queries['(prefers-reduced-motion: reduce)'];reduced.matches=true;reduced.change();assert.ok(active.every(v=>v.paused));reduced.matches=false;reduced.change();playing();
 blocked=true;winEvents.pageshow();await new Promise(r=>setImmediate(r));assert.ok(active.every(v=>v.paused));blocked=false;events.touchend();playing();
 const compact=queries['(max-width: 1050px)'];compact.matches=!compactMode;compact.change();assert.ok((compact.matches?tiles:[mobile]).every(v=>v.paused&&!v.getAttribute('src')));
}
await check(false,false);await check(true,true);await check(true,false);
const html=await readFile(new URL('../index.html',import.meta.url),'utf8'),start=html.indexOf('<section id="hero"'),hero=html.slice(start,html.indexOf('</section>',start));
assert.equal((hero.match(/<video /g)||[]).length,13);assert.ok(!hero.includes('<video src='),'Hero media must be selected before loading sources');
for(const match of hero.matchAll(/data-(?:hero|phone|tablet)-src="([^"]+)"/g))await readFile(new URL('..'+match[1],import.meta.url));
console.log('Hero passed: one phone/tablet decoder, desktop tiles, inactive source cleanup, reduced motion, visibility/gesture resume, and asset integrity.');
