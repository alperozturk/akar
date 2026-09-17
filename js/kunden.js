/* Homepage "Unsere Kunden": partner-logo carousel. The track is a native
   scroll-snap row; the arrows page it by one viewport width and wrap around
   at either end. It also auto-advances gently, pausing while hovered or
   focused, and stays still for reduced-motion users. */
(() => {
  const root = document.querySelector('.logo-carousel');
  if (!root) return;
  const viewport = root.querySelector('.logo-carousel__viewport');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const page = (dir) => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    const step = viewport.clientWidth;
    let next = viewport.scrollLeft + dir * step;
    if (dir > 0 && viewport.scrollLeft >= max - 2) next = 0;            // wrap to start
    else if (dir < 0 && viewport.scrollLeft <= 2) next = max;            // wrap to end
    viewport.scrollTo({ left: Math.max(0, Math.min(max, next)), behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  root.querySelectorAll('.logo-carousel__arrow').forEach((btn) => {
    btn.addEventListener('click', () => { page(Number(btn.dataset.dir) || 1); restart(); });
  });

  let timer = null;
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => { if (!reduceMotion && !timer) timer = setInterval(() => page(1), 5000); };
  const restart = () => { stop(); start(); };
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
})();
