const ASSETS = window.PROOF_ASSETS || {};

document.querySelectorAll('[data-asset]').forEach((img) => {
  const key = img.dataset.asset;
  if (ASSETS[key]) img.src = ASSETS[key];
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));