document.title = 'Rolex — Websites, Community & Raids';

const lightbox = document.getElementById('proof-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

const proofCropPositions = {
  joe: 'center 70%',
  menace: 'center 61%',
  stakrr: 'center 48%',
  robbie: 'center 67%',
  lib_praise: 'center 22%',
  joe_feedback: 'center 61%',
  lib_payment: 'center 78%'
};

// Original proof images stay untouched; only the card viewport is cropped.
document.querySelectorAll('[data-zoom]').forEach((card) => {
  const img = card.querySelector('img');
  if (!img) return;

  let key = '';
  try {
    key = new URL(img.getAttribute('src'), window.location.origin).searchParams.get('key') || '';
  } catch (_) {}

  if (key) {
    const original = `/api/proof?key=${encodeURIComponent(key)}&v=9`;
    img.dataset.fullSrc = original;
    img.src = original;
    img.style.objectFit = 'cover';
    img.style.objectPosition = proofCropPositions[key] || 'center';
  }

  const open = () => {
    if (!lightbox || !lightboxImage) return;
    const fullSrc = img.dataset.fullSrc || img.currentSrc || img.src;
    lightboxImage.src = fullSrc;
    lightboxImage.alt = img.alt || 'Proof screenshot';

    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else window.open(fullSrc, '_blank', 'noopener,noreferrer');
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

// Reveal content once, then leave it alone.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));
} else {
  document.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));
}

// Section-aware reading meter. Desktop uses a vertical rail; mobile turns it into a thin edge rail.
const progressFrame = document.querySelector('.scroll-progress');
const progress = document.getElementById('scroll-progress');
let progressRaf = 0;

const updateProgress = () => {
  progressRaf = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  const pct = Math.round(ratio * 100);

  document.documentElement.style.setProperty('--page-progress', ratio.toFixed(4));
  if (progress) progress.dataset.progress = `${String(pct).padStart(2, '0')}%`;
  if (progressFrame && ratio < 0.035) progressFrame.dataset.section = 'INTRO';
};

const requestProgress = () => {
  if (!progressRaf) progressRaf = requestAnimationFrame(updateProgress);
};

window.addEventListener('scroll', requestProgress, { passive: true });
window.addEventListener('resize', requestProgress);
updateProgress();

// Keep navigation and meter label synced to the section in view.
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveSection = (id) => {
  const section = id || 'intro';
  document.body.dataset.section = section;
  if (progressFrame) progressFrame.dataset.section = section.toUpperCase();
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${section}`);
  });
};

setActiveSection('intro');

if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveSection(visible.target.id);
  }, { rootMargin: '-34% 0px -48%', threshold: [0, 0.12, 0.35, 0.6] });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

// Pointer-only depth. Touch devices stay clean.
const pointerFine = window.matchMedia('(pointer:fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (pointerFine) {
  document.querySelectorAll('[data-tilt], .work-card, .proof-card, .raid-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--spot-x', `${px}%`);
      card.style.setProperty('--spot-y', `${py}%`);

      if (!reducedMotion && card.hasAttribute('data-tilt')) {
        const x = px / 100 - 0.5;
        const y = py / 100 - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${y * -1.4}deg) rotateY(${x * 1.4}deg) translateY(-1px)`;
      }
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
      if (card.hasAttribute('data-tilt')) card.style.transform = '';
    });
  });
}
