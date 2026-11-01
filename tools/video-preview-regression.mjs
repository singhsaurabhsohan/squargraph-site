import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/js/brand-film.js',import.meta.url),'utf8');
async function check(finePointer) {
  const frames=[];
  const players=[];
  const observers=[];
  for(let i=0;i<2;i++) {
    const listeners={}; const attrs={'aria-pressed':'false'};
    const button={disabled:false,setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,v)=>listeners['button:'+k]=v};
    const iframe={dataset:{src:'https://player.example/?autoplay=true&muted=true'},getAttribute:()=>null};
    frames.push({dataset:{},hasAttribute:()=>false,querySelector:q=>q==='iframe'?iframe:button,classList:{add(){}},addEventListener:(k,v)=>listeners[k]=v,listeners,attrs});
  }
  class Player {
    constructor(){this.muted=true;this.playing=false;players.push(this)}
    on(event,fn){if(event==='ready')fn()}
    setLoop(){return Promise.resolve()}
    play(){this.playing=true;return Promise.resolve()}
    mute(){this.muted=true;return Promise.resolve()}
    unmute(){this.muted=false;return Promise.resolve()}
    setVolume(){return Promise.resolve()}
  }
  class Observer {
    constructor(fn){this.fn=fn;observers.push(this)}
    observe(frame){if(!frame.dataset.gumletLoading)this.fn([{isIntersecting:true,target:frame,intersectionRatio:1}])}
    disconnect(){}
  }
  const doc={readyState:'complete',querySelectorAll:()=>frames,addEventListener(){}};
  const win={playerjs:{Player},matchMedia:()=>({matches:finePointer}),IntersectionObserver:Observer};
  vm.runInNewContext(source,{window:win,document:doc,IntersectionObserver:Observer});
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(players.every(p=>p.playing&&p.muted),'Videos must autoplay muted before any interaction');
  if(finePointer) {
    frames[0].listeners.pointermove({pointerType:'mouse'});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(players[0].muted,false,'Mouse movement must enable audio without a click');
    frames[1].listeners.pointerenter({pointerType:'mouse'});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(players[0].muted,true,'Only one preview may have sound');
    assert.equal(players[1].muted,false);
    frames[1].listeners.pointerleave();
    assert.equal(players[1].muted,true,'Leaving a preview must mute it');
  } else {
    frames[0].listeners.pointermove({pointerType:'touch'});
    assert.equal(players[0].muted,true,'Touch scrolling must not enable audio');
    frames[0].listeners.click({target:{closest:()=>null}});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(players[0].muted,false,'Tapping a touch preview must enable audio');
    frames[0].listeners.click({target:{closest:()=>null}});
    assert.equal(players[0].muted,true);
  }
}
await check(true);
await check(false);
console.log('Video preview checks passed: muted autoplay, mouse movement, exclusive sound, hover leave, mobile tap and touch scroll.');
