const ASSETS = window.PROOF_ASSETS || {};

document.querySelectorAll('[data-asset]').forEach((img) => {
  const key = img.dataset.asset;
  if (ASSETS[key]) {
    img.src = ASSETS[key];
    img.decoding = 'async';
  }
});

// Project previews normally use raw GitHub assets. If that host fails on a
// network, retry through GitHub's own raw route before giving up.
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

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));