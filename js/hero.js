export function initHero({ gsap, reduceMotion }) {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const lines = hero.querySelectorAll('.hero__line > span, .hero__line');
  const lineEls = hero.querySelectorAll('.hero__line');
  const eyebrow = hero.querySelector('.hero__eyebrow');
  const lead = hero.querySelector('.hero__lead');
  const ctas = hero.querySelectorAll('.hero__cta .btn');
  const chips = hero.querySelectorAll('.hero__stats .chip');
  const packets = hero.querySelectorAll('.packet');

  if (reduceMotion) {
    gsap.set([eyebrow, lineEls, lead, ctas, chips, packets], { opacity: 1, y: 0, scale: 1, clearProps: 'clipPath' });
    return;
  }

  // Initial hidden state
  gsap.set(eyebrow, { opacity: 0, y: 14 });
  gsap.set(lineEls, { opacity: 0, yPercent: 110 });
  gsap.set([lead, ctas, chips], { opacity: 0, y: 24 });
  gsap.set(packets, { opacity: 0, y: 60, scale: 0.6 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
  tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 })
    .to(lineEls, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.08 }, '-=0.25')
    .to(lead, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
    .to(ctas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
    .to(chips, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, '-=0.35')
    .to(packets, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.07 }, '-=0.55');

  // Gentle cursor-parallax on packets (skip on touch / reduced motion)
  const touch = window.matchMedia('(hover: none)').matches;
  if (!touch) {
    const setters = Array.from(packets).map((p, i) => ({
      x: gsap.quickTo(p, 'x', { duration: 0.6, ease: 'power3' }),
      y: gsap.quickTo(p, 'y', { duration: 0.6, ease: 'power3' }),
      f: 8 + (i % 3) * 5
    }));
    window.addEventListener('mousemove', (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      setters.forEach((s) => { s.x(dx * s.f); s.y(dy * s.f); });
    }, { passive: true });
  }
}

export function initMobileMenu() {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu__close');
  if (!burger || !menu) return;

  const focusable = () => menu.querySelectorAll('a, button');

  const open = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // defer to next frame so the menu is visible/focusable before moving focus
    requestAnimationFrame(() => (close || focusable()[0])?.focus());
  };
  const shut = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus(); // restore focus to the trigger
  };

  // Simple focus trap: keep Tab within the menu while it's open
  const onKeydown = (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') { shut(); return; }
    if (e.key !== 'Tab') return;
    const items = Array.from(focusable());
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  burger.addEventListener('click', open);
  close && close.addEventListener('click', shut);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', shut));
  document.addEventListener('keydown', onKeydown);
}
