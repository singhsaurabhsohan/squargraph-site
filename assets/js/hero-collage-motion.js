(function(){
 const hero=document.querySelector('[data-hero]');
 if(!hero)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const frames=Array.from(hero.querySelectorAll('[data-hero-video]'));
 function stop(){frames.forEach(el=>el.replaceChildren());}
 function start(){
  if(reduce.matches||document.hidden)return;
  frames.forEach(el=>{if(el.firstChild)return;const iframe=document.createElement('iframe');
   iframe.src='https://play.gumlet.io/embed/'+el.dataset.heroVideo+'?background=true&autoplay=true&muted=true&loop=true&disable_player_controls=true&playsinline=true';
   iframe.title='Muted film and Reel collage';iframe.allow='autoplay; fullscreen';iframe.loading='eager';iframe.tabIndex=-1;
   el.append(iframe);
  });
 }
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 reduce.addEventListener('change',()=>reduce.matches?stop():start());
 // Start before the rest of the page and its scripts finish loading.
 start();
 const observer=new IntersectionObserver(entries=>{entries[0].isIntersecting?start():stop();},{threshold:.05});observer.observe(hero);
})();
