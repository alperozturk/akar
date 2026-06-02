export function initReveals({ gsap, ST, reduceMotion }) {
  const reveals = gsap.utils.toArray('[data-reveal]');
  reveals.forEach((el) => {
    if (reduceMotion) { gsap.set(el, { opacity: 1, y: 0, clipPath: 'none' }); return; }
    const type = el.dataset.reveal || 'up';
    const from = { opacity: 0, y: type === 'up' ? 40 : 0, scale: type === 'scale' ? 0.9 : 1 };
    gsap.fromTo(el, from, {
      opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    const items = group.children;
    if (reduceMotion) { gsap.set(items, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(items, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 80%' }
    });
  });
  if (reduceMotion) return;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.2;
    gsap.to(el, { yPercent: -speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
