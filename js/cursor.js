/* The custom cursor dot is gone — the native pointer is used everywhere.
   What remains here is the magnetic pull on [data-magnetic] buttons. */
export function initCursor({ gsap, reduceMotion }) {
  const touch = window.matchMedia('(hover: none)').matches;
  if (touch || reduceMotion) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }));
  });
}
