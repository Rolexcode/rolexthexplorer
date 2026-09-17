const lightbox = document.getElementById('proof-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('[data-zoom]').forEach((card) => {
  const open = () => {
    const img = card.querySelector('img');
    if (!img || !lightbox || !lightboxImage) return;

    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || 'Proof screenshot';

    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      window.open(img.currentSrc || img.src, '_blank', 'noopener,noreferrer');
    }
  };

  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });

  card.tabIndex = 0;
  card.setAttribute('role', 'button');
});

lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox?.open) lightbox.close();
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));
} else {
  document.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));
}
