// Load the verified screenshot assets already stored in this repository.
// These are real JPEG data URLs and replace the malformed generated WebP files.
const proofFiles = [
  'asset-joe.js','asset-menace.js','asset-stakrr.js','asset-robbie.js',
  'asset-joe-feedback.js','asset-lib-praise.js','asset-lib-payment.js'
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `./${src}?v=3`;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function makeImage(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.cssText = 'width:100%;height:auto;display:block;border-radius:10px;background:#080809';
  return img;
}

function makeLinkedImage(src, alt) {
  const a = document.createElement('a');
  a.href = src;
  a.target = '_blank';
  a.rel = 'noreferrer';
  a.appendChild(makeImage(src, alt));
  return a;
}

async function renderProof() {
  try {
    await Promise.all(proofFiles.map(loadScript));
    const a = window.PROOF_ASSETS || {};

    const community = document.querySelector('#community .proof-sheet');
    if (community) {
      community.removeAttribute('href');
      community.removeAttribute('target');
      community.style.cursor = 'default';
      community.innerHTML = '';
      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px';
      [
        ['joe','Joe Community Chat — Rolex moderator role'],
        ['menace','Menace Shrek — Rolex admin role'],
        ['stakrr','Stakrr — Rolex raider role'],
        ['robbie','$ROBBIE Community CTO — Rolex admin role']
      ].forEach(([key,alt]) => { if (a[key]) grid.appendChild(makeLinkedImage(a[key],alt)); });
      community.appendChild(grid);
      const note = document.createElement('div');
      note.className = 'proof-sheet-note';
      note.innerHTML = '<span>Actual Telegram roles</span><b>Tap any screenshot ↗</b>';
      community.appendChild(note);
    }

    const raids = document.querySelector('#raids .proof-sheet');
    if (raids) {
      raids.removeAttribute('href');
      raids.removeAttribute('target');
      raids.style.cursor = 'default';
      raids.innerHTML = '';
      const stack = document.createElement('div');
      stack.style.cssText = 'display:grid;gap:8px';
      [
        ['joe_feedback','Telegram feedback confirming the raid was very good'],
        ['lib_praise','Telegram feedback saying good work and great job on raids'],
        ['lib_payment','Telegram conversation confirming payment after completed raid work']
      ].forEach(([key,alt]) => { if (a[key]) stack.appendChild(makeLinkedImage(a[key],alt)); });
      raids.appendChild(stack);
      const note = document.createElement('div');
      note.className = 'proof-sheet-note';
      note.innerHTML = '<span>Actual conversations</span><b>Tap any screenshot ↗</b>';
      raids.appendChild(note);
    }
  } catch (err) {
    console.error('Proof screenshots failed to load', err);
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