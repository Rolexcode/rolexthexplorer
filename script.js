const ASSETS = window.PROOF_ASSETS || {};

document.querySelectorAll('[data-asset]').forEach((img) => {
  const key = img.dataset.asset;
  if (ASSETS[key]) {
    img.src = ASSETS[key];
    img.decoding = 'async';
  }
});

// Project previews use real project artwork from the source repos. If the raw
// host fails on a network, retry through GitHub's alternate raw route.
document.querySelectorAll('.project-preview img').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackTried === '1') return;
    const source = img.currentSrc || img.src;
    const match = source.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/main\/(.+)$/);
    if (!match) return;
    img.dataset.fallbackTried = '1';
    img.src = `https://github.com/${match[1]}/${match[2]}/raw/refs/heads/main/${match[3]}`;
  });
});

const lightbox = document.getElementById('proof-lightbox');
const lightboxImage = document.getElementById('lightbox-image');

function openProof(key) {
  if (!lightbox || !lightboxImage || !ASSETS[key]) return;
  lightboxImage.src = ASSETS[key];
  lightbox.showModal();
}

document.querySelectorAll('[data-zoom]').forEach((card) => {
  card.addEventListener('click', () => openProof(card.dataset.zoom));
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProof(card.dataset.zoom);
    }
  });
});

document.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox?.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));