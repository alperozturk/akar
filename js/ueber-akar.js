/* Über-AKAR timeline: the centre line fills pink with the scroll position and
   each milestone dot lights up as the line reaches it. Without GSAP (or with
   reduced motion) the line simply stays full and every dot is lit. */
(() => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const items = [...timeline.querySelectorAll('.timeline__item')];
  const bar = timeline.querySelector('.timeline__progress');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lightAll = () => items.forEach((item) => item.classList.add('is-passed'));

  const start = () => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST) return false;
    if (reduceMotion) { lightAll(); return true; }

    gsap.registerPlugin(ST);
    /* the fill's tip travels along the 60% viewport line, the same line the
       dots are tested against — so a dot lights exactly when the fill hits it */
    gsap.fromTo(bar, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 60%', end: 'bottom 60%', scrub: true }
    });
    items.forEach((item) => {
      ST.create({
        trigger: item.querySelector('.timeline__dot'),
        start: 'center 60%',
        onEnter: () => item.classList.add('is-passed'),
        onLeaveBack: () => item.classList.remove('is-passed')
      });
    });
    return true;
  };

  window.addEventListener('load', () => {
    if (start()) return;
    let tries = 0;
    const timer = setInterval(() => {
      if (start() || ++tries > 100) {
        clearInterval(timer);
        if (tries > 100) lightAll();
      }
    }, 30);
  });
})();
