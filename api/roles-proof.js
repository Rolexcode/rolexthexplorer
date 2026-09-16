const fs = require('fs');
const path = require('path');

const SOURCES = [
  'asset-joe.js',
  'asset-menace.js',
  'asset-stakrr.js',
  'asset-robbie.js'
];

function readImage(file) {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const match = source.match(/data:image\/jpeg;base64,([^"']+)/);
  if (!match) throw new Error(`No image data found in ${file}`);
  return `data:image/jpeg;base64,${match[1]}`;
}

function esc(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = function handler(req, res) {
  try {
    const images = SOURCES.map(readImage);
    const labels = [
      ['Joe Community Chat', 'MODERATOR'],
      ['Menace Shrek', 'ADMIN'],
      ['Stakrr', 'RAIDER'],
      ['$ROBBIE Community CTO', 'ADMIN']
    ];

    const cards = images.map((src, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 24 + col * 588;
      const y = 24 + row * 864;
      const clipId = `clip${i}`;
      const [name, role] = labels[i];
      return `
        <clipPath id="${clipId}"><rect x="${x}" y="${y}" width="564" height="760" rx="22"/></clipPath>
        <rect x="${x}" y="${y}" width="564" height="818" rx="24" fill="#111214" stroke="#282a2e"/>
        <image href="${src}" x="${x}" y="${y}" width="564" height="760" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>
        <rect x="${x}" y="${y + 704}" width="564" height="56" fill="url(#fade)" clip-path="url(#${clipId})"/>
        <text x="${x + 20}" y="${y + 790}" fill="#f3f3f0" font-size="21" font-family="Arial,Helvetica,sans-serif" font-weight="700">${esc(name)}</text>
        <text x="${x + 544}" y="${y + 790}" fill="#b9ff66" text-anchor="end" font-size="14" font-family="Arial,Helvetica,sans-serif" font-weight="700" letter-spacing="1">${role}</text>
      `;
    }).join('');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1752" viewBox="0 0 1200 1752">
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".82"/></linearGradient>
        </defs>
        <rect width="1200" height="1752" fill="#080809"/>
        ${cards}
      </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(svg);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8').send(`Proof image unavailable: ${error.message}`);
  }
};