// Proof screenshots are stored in the repository as small JS data assets.
// Load those verified assets first, then render them directly. This avoids the
// malformed .webp files that previously caused broken images on the live site.
const proofFiles = [
  'asset-joe.js',
  'asset-menace.js',
  'asset-stakrr.js',
  'asset-robbie.js',
  'asset-joe-feedback.js',
  'asset-lib-praise.js',
  'asset-lib-payment.js'
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `./${src}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function proofImage(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
  img.style.borderRadius = '10px';
  img.style.background = '#080809';
  return img;
}

async function renderProof() {
  try {
    await Promise.all(proofFiles.map(loadScript));
    const assets = window.PROOF_ASSETS || {};

    // Community section: show the actual role screenshots individually so the
    // role labels remain readable instead of hiding them in a compressed collage.
    const communitySheet = document.querySelector('#community .proof-sheet');
    if (communitySheet) {
      communitySheet.removeAttribute('href');
      communitySheet.removeAttribute('target');
      communitySheet.style.cursor = 'default';
      communitySheet.innerHTML = '';

      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
      grid.style.gap = '8px';

      [
        ['joe', 'Joe Community Chat — Rolex moderator role'],
        ['menace', 'Menace Shrek — Rolex admin role'],
        ['stakrr', 'Stakrr — Rolex raider role'],
        ['robbie', '$ROBBIE Community CTO — Rolex admin role']
      ].forEach(([key, alt]) => {
        if (!assets[key]) return;
        const link = document.createElement('a');
        link.href = assets[key];
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.appendChild(proofImage(assets[key], alt));
        grid.appendChild(link);
      });

      communitySheet.appendChild(grid);
      const note = document.createElement('div');
      note.className = 'proof-sheet-note';
      note.innerHTML = '<span>Actual Telegram roles</span><b>Tap any screenshot ↗</b>';
      communitySheet.appendChild(note);
    }

    // Raid section: show all three actual conversations — feedback, trust and
    // payment — rather than pointing at the broken generated WebP.
    const raidSheet = document.querySelector('#raids .proof-sheet');
    if (raidSheet) {
      raidSheet.removeAttribute('href');
      raidSheet.removeAttribute('target');
      raidSheet.style.cursor = 'default';
      raidSheet.innerHTML = '';

      const stack = document.createElement('div');
      stack.style.display = 'grid';
      stack.style.gap = '8px';

      [
        ['joeFeedback', 'Telegram feedback confirming the raid was very good'],
        ['libPraise', 'Telegram feedback saying good work and great job on raids'],
        ['libPayment', 'Telegram conversation confirming payment after completed raid work']
      ].forEach(([key, alt]) => {
        if (!assets[key]) return;
        const link = document.createElement('a');
        link.href = assets[key];
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.appendChild(proofImage(assets[key], alt));
        stack.appendChild(link);
      });

      raidSheet.appendChild(stack);
      const note = document.createElement('div');
      note.className = 'proof-sheet-note';
      note.innerHTML = '<span>Actual conversations</span><b>Tap any screenshot ↗</b>';
      raidSheet.appendChild(note);
    }
  } catch (error) {
    console.error('Could not load proof screenshots', error);
  }
}

renderProof();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));