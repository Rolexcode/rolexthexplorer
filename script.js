const cursor = document.querySelector('.cursor-light');

window.addEventListener('pointermove', (event) => {
  if (!cursor || window.matchMedia('(max-width: 640px)').matches) return;
  cursor.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.11 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

const proofModal = document.getElementById('proof-modal');
const proofImage = document.getElementById('proof-modal-image');
const proofTitle = document.getElementById('proof-modal-title');

document.querySelectorAll('[data-proof-image]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!proofModal || !proofImage || !proofTitle) return;
    proofImage.src = button.dataset.proofImage;
    proofTitle.textContent = button.dataset.proofTitle || 'Proof';
    proofModal.showModal();
  });
});

document.querySelector('.proof-close')?.addEventListener('click', () => proofModal?.close());

proofModal?.addEventListener('click', (event) => {
  if (event.target === proofModal) proofModal.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && proofModal?.open) proofModal.close();
});