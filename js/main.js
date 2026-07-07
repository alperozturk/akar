import Lenis from './vendor/lenis.mjs';
import { initReveals } from './reveals.js';
import { initCounters } from './counters.js';
import { initCursor } from './cursor.js';
import { initHero } from './hero.js';
import { initV2 } from './v2.js';
import { initCarousel } from './carousel.js';
import { initFloaters } from './floaters.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  if (!gsap || !ST) return;
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
  initV2();
  initCarousel({ gsap });
  initFloaters();
}

window.addEventListener('load', () => {
  if (window.gsap && window.ScrollTrigger) {
    boot();
  } else {
    const i = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(i);
        boot();
      }
    }, 30);
  }
});
