export function initCursor({ gsap, reduceMotion }) {
  const header = document.querySelector('header');
  const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > window.innerHeight * 0.85);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const touch = window.matchMedia('(hover: none)').matches;
  const cursor = document.querySelector('.cursor');
  if (touch || reduceMotion || !cursor) { if (cursor) cursor.style.display = 'none'; return; }
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); });
  const scaleTo = (v) => gsap.to(cursor, { scale: v, duration: 0.25, ease: 'power3', overwrite: 'auto' });
  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('is-active'); scaleTo(2.5); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('is-active'); scaleTo(1); });
  });
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }));
  });
}
