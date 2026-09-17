const lightbox = document.getElementById('proof-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

// Use the real original screenshots for both the card crop and the full lightbox view.
// CSS handles the in-card crop; the lightbox shows the untouched full image.
document.querySelectorAll('[data-zoom]').forEach((card) => {
  const img = card.querySelector('img');
  if (!img) return;

  let key = '';
  try {
    key = new URL(img.getAttribute('src'), window.location.origin).searchParams.get('key') || '';
  } catch (_) {}

  if (key) {
    const original = `/api/proof?key=${encodeURIComponent(key)}&v=8`;
    img.dataset.fullSrc = original;
    img.src = original;
    img.removeAttribute('style');
  }

  const open = () => {
    if (!lightbox || !lightboxImage) return;
    const fullSrc = img.dataset.fullSrc || img.currentSrc || img.src;

    lightboxImage.src = fullSrc;
    lightboxImage.alt = img.alt || 'Proof screenshot';

    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      window.open(fullSrc, '_blank', 'noopener,noreferrer');
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

// Section reveal.
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

// Reading progress gives the page a quiet sense of movement without a marquee.
const progress = document.getElementById('scroll-progress');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Keep the nav oriented to where the visitor is in the story.
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { rootMargin: '-35% 0px -50%', threshold: [0, 0.1, 0.35] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

// Tiny perspective response on pointer devices. No effect on touch screens.
if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rx = y * -2.4;
      const ry = x * 2.4;
      card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
