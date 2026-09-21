/* Über-AKAR timeline: the centre line fills pink with the scroll position and
   each milestone dot lights up as the line reaches it. Without GSAP (or with
   reduced motion) the line simply stays full and every dot is lit.

   Layout: the cards alternate sides, and since they carry photos and full
   paragraphs they are tall. In pure CSS every milestone takes its own row, so
   half of each row stays empty. layout() pulls each milestone up next to its
   neighbour on the other side: a card starts GAP below the previous card on
   its own side, and at least STAGGER — or half the previous card's height,
   whichever is more — below the previous milestone. That keeps the dots in
   chronological order and leaves clear air between the milestones. Below 761px (one column) the
   margins are cleared and the CSS flow applies. */
(() => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const items = [...timeline.querySelectorAll('.timeline__item')];
  const bar = timeline.querySelector('.timeline__progress');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const list = timeline.querySelector('.timeline__list');
  const twoColumns = window.matchMedia('(min-width: 761px)');
  const GAP = 5;        /* rem between two cards on the same side */
  const STAGGER = 9;    /* rem minimum offset between consecutive milestones */
  const OVERLAP = .5;   /* a milestone starts no higher than this share of the previous card */
  const layout = () => {
    items.forEach((item) => { item.style.marginTop = ''; });
    list.style.paddingBottom = '';
    if (!twoColumns.matches) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const bottoms = [-Infinity, -Infinity];   /* lowest card edge per side */
    let prevTop = -Infinity;
    let prevHeight = 0;
    /* offsetTop/offsetHeight ignore the reveal transforms on the cards */
    items.forEach((item, i) => {
      const side = i % 2;
      item.style.marginTop = '0px';
      const natural = item.offsetTop;
      const top = i === 0 ? natural : Math.max(
        bottoms[side] + GAP * rem,
        prevTop + Math.max(STAGGER * rem, prevHeight * OVERLAP)
      );
      item.style.marginTop = `${top - natural}px`;
      prevHeight = item.offsetHeight;
      bottoms[side] = top + prevHeight;
      prevTop = top;
    });
    /* the last card on the other side may reach below the final milestone */
    const overflow = Math.max(...bottoms) - (list.offsetTop + list.offsetHeight);
    if (overflow > 0) list.style.paddingBottom = `${overflow}px`;
  };
  let relayoutTimer = 0;
  const relayout = () => {
    clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(() => {
      layout();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 120);
  };
  layout();
  window.addEventListener('resize', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
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
    layout();
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
