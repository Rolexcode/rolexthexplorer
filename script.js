// Proof screenshot assets are loaded by the asset-*.js files before this script.
// Each asset file adds a real JPEG data URL to window.PROOF_ASSETS.
const proofAssets = window.PROOF_ASSETS || {};

// Attach each real screenshot to the matching <img data-asset="...">.
document.querySelectorAll('img[data-asset]').forEach((img) => {
  const key = img.dataset.asset;
  const src = proofAssets[key];

  if (!src) {
    console.error(`Missing proof asset: ${key}`);
    return;
  }

  img.src = src;
  img.loading = 'lazy';
  img.decoding = 'async';
});

// Proof lightbox.
const lightbox = document.getElementById('proof-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

function openProof(key, alt = 'Proof screenshot') {
  const src = proofAssets[key];
  if (!src || !lightbox || !lightboxImage) return;

  lightboxImage.src = src;
  lightboxImage.alt = alt;

  if (typeof lightbox.showModal === 'function') {
    lightbox.showModal();
  } else {
    window.open(src, '_blank', 'noopener,noreferrer');
  }
}

document.querySelectorAll('[data-zoom]').forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    openProof(card.dataset.zoom, img?.alt || 'Proof screenshot');
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const img = card.querySelector('img');
      openProof(card.dataset.zoom, img?.alt || 'Proof screenshot');
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

// Reveal animation.
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
