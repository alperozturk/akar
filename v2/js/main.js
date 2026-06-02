import Lenis from './vendor/lenis.mjs'; // self-hosted lenis@1.1.13 (supply-chain hardening; no third-party runtime fetch)
import { initReveals } from './reveals.js';
import { initCounters } from './counters.js';
import { initCursor } from './cursor.js';
import { initHero, initMobileMenu } from './hero.js';
import { initV2 } from './v2.js';

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
  initHero({ gsap, reduceMotion });
  initMobileMenu();
  initV2();
}

window.addEventListener('load', () => {
  if (window.gsap) boot();
  else { const i = setInterval(() => { if (window.gsap) { clearInterval(i); boot(); } }, 30); }
});
