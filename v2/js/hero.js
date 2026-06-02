export function initHero({ gsap, reduceMotion }) {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const lineEls = hero.querySelectorAll('.hero__line');
  const lead = hero.querySelector('.hero__lead');
  const packets = hero.querySelectorAll('.packet');
  const seal = hero.querySelector('.seal');

  // Only animate targets that actually exist (markup may vary across pages).
  const targets = [lineEls, lead, packets, seal].filter(
    (t) => t && (t.length === undefined ? true : t.length > 0)
  );

  if (reduceMotion) {
    gsap.set(targets, { opacity: 1, y: 0, scale: 1, clearProps: 'clipPath' });
    return;
  }

  // Initial hidden state
  gsap.set(lineEls, { opacity: 0, yPercent: 110 });
  if (lead) gsap.set(lead, { opacity: 0, y: 24 });
  gsap.set(packets, { opacity: 0, y: 60, scale: 0.6 });
  if (seal) gsap.set(seal, { opacity: 0, scale: 0.5, rotate: -30 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
  tl.to(lineEls, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.08 })
    .to(lead, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
    .to(packets, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.07 }, '-=0.55');
  if (seal) tl.to(seal, {
    opacity: 1, scale: 1, rotate: -10, duration: 0.6, ease: 'back.out(1.7)',
    onComplete: () => gsap.set(seal, { clearProps: 'transform,opacity' })
  }, '-=0.4');

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
