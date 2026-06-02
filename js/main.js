import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs';
import { initReveals } from './reveals.js';
import { initCounters } from './counters.js';
import { initCursor } from './cursor.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
  const gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);

  if (!reduceMotion) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  initReveals({ gsap, ST, reduceMotion });
  initCounters({ gsap, ST });
  initCursor({ gsap, reduceMotion });
}

window.addEventListener('load', () => {
  if (window.gsap) boot();
  else { const i = setInterval(() => { if (window.gsap) { clearInterval(i); boot(); } }, 30); }
});
