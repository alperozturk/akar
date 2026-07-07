export function initFloaters() {
  const floaters = document.querySelectorAll('.floater');
  if (!floaters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
  }, { rootMargin: '80px' });
  floaters.forEach((el) => io.observe(el));
}
