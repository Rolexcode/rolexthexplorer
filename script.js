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

const projects = {
  floor: {
    label: '01 / HOLDING THE FLOOR',
    title: 'Holding The Floor',
    image: 'https://raw.githubusercontent.com/Rolexcode/holdingthefloor/main/public/images/og-image.jpg',
    description: 'A Web3 project site built to give the community something to do, not just something to read. The standout piece is an in-site image meme generator so members can make project-native content and take it straight back to the timeline.',
    features: ['Web3 landing experience', 'Image meme generator', 'Community utility', 'Responsive interface'],
    repo: 'https://github.com/Rolexcode/holdingthefloor'
  },
  peepee: {
    label: '02 / PEEPEE',
    title: 'PeePee',
    image: 'https://raw.githubusercontent.com/Rolexcode/peepee/main/public/og-image.jpg',
    description: 'A meme-project website where the creative tool is part of the product. The Meme Lab and PFP Lab let a user bring in a profile image, frame it, and generate 1080×1080 assets ready to post on X.',
    features: ['PFP Lab', 'Meme Lab', '1080×1080 output', 'Image positioning controls'],
    repo: 'https://github.com/Rolexcode/peepee'
  },
  shred: {
    label: '03 / SHREDDED CHEEZ',
    title: 'Shredded Cheez',
    image: 'https://raw.githubusercontent.com/Rolexcode/shred/main/images/memes/original-shredded-banner.webp',
    description: 'A meme-project website with a complete visual language, a meme gallery and its own playable mini-game. The point was to make visiting the site feel like entering the project’s joke instead of reading another token template.',
    features: ['Playable mini-game', 'Meme gallery', 'Custom visual system', 'Responsive experience'],
    repo: 'https://github.com/Rolexcode/shred'
  },
  shrek: {
    label: '04 / MENACE SHREK',
    title: 'Menace Shrek',
    image: 'https://raw.githubusercontent.com/Rolexcode/shrek/main/image.png',
    description: 'This one connects both sides of what I offer: I shipped the project website and also operated inside the Telegram community as an admin. The build and the community were not separate worlds to me.',
    features: ['Project website', 'Web3 branding', 'Community admin', 'Mobile responsive'],
    repo: 'https://github.com/Rolexcode/shrek'
  }
};

const caseModal = document.getElementById('case-modal');
const caseImage = document.getElementById('case-image');
const caseLabel = document.getElementById('case-label');
const caseTitle = document.getElementById('case-title');
const caseDescription = document.getElementById('case-description');
const caseFeatures = document.getElementById('case-features');
const caseRepo = document.getElementById('case-repo');

function openProject(key) {
  const project = projects[key];
  if (!project || !caseModal) return;
  caseImage.src = project.image;
  caseImage.alt = `${project.title} project artwork`;
  caseLabel.textContent = project.label;
  caseTitle.textContent = project.title;
  caseDescription.textContent = project.description;
  caseFeatures.innerHTML = project.features.map((feature) => `<span>${feature}</span>`).join('');
  caseRepo.href = project.repo;
  caseModal.showModal();
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openProject(button.dataset.project));
});

document.querySelector('.modal-close')?.addEventListener('click', () => caseModal.close());
caseModal?.addEventListener('click', (event) => {
  if (event.target === caseModal) caseModal.close();
});

const proofModal = document.getElementById('proof-modal');
const proofImage = document.getElementById('proof-modal-image');
const proofTitle = document.getElementById('proof-modal-title');

document.querySelectorAll('[data-proof-image]').forEach((button) => {
  button.addEventListener('click', () => {
    proofImage.src = button.dataset.proofImage;
    proofTitle.textContent = button.dataset.proofTitle || 'Proof';
    proofModal.showModal();
  });
});

document.querySelector('.proof-close')?.addEventListener('click', () => proofModal.close());
proofModal?.addEventListener('click', (event) => {
  if (event.target === proofModal) proofModal.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (caseModal?.open) caseModal.close();
  if (proofModal?.open) proofModal.close();
});