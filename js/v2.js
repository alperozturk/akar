// V2 "candy-kingdom" interactions.
// Music toggle is visual-only: it flips the muted slash on the note icon.
export function initV2() {
  const toggle = document.querySelector('.music-toggle');
  if (!toggle) return;

  const sync = () => {
    const muted = toggle.classList.contains('is-muted');
    toggle.setAttribute('aria-pressed', String(!muted));
    toggle.setAttribute('aria-label', muted ? 'Musik an' : 'Musik aus');
  };

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-muted');
    sync();
  });

  sync();
}
