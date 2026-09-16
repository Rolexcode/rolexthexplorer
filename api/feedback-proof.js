const fs = require('fs');
const path = require('path');

const SOURCES = [
  'asset-lib-praise.js',
  'asset-joe-feedback.js',
  'asset-lib-payment.js'
];

function readImage(file) {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const match = source.match(/data:image\/jpeg;base64,([^"']+)/);
  if (!match) throw new Error(`No image data found in ${file}`);
  return `data:image/jpeg;base64,${match[1]}`;
}

module.exports = function handler(req, res) {
  try {
    const images = SOURCES.map(readImage);
    const labels = ['RAID FEEDBACK', 'TRUST + EXECUTION', 'PAID WORK'];
    const notes = ['Great job on raids', 'No need, I trust you', 'Payment received'];

    const cards = images.map((src, i) => {
      const x = 24 + i * 388;
      return `
        <clipPath id="clip${i}"><rect x="${x}" y="24" width="364" height="780" rx="22"/></clipPath>
        <rect x="${x}" y="24" width="364" height="850" rx="24" fill="#111214" stroke="#282a2e"/>
        <image href="${src}" x="${x}" y="24" width="364" height="780" preserveAspectRatio="xMidYMid meet" clip-path="url(#clip${i})"/>
        <text x="${x + 18}" y="830" fill="#8f9097" font-size="13" font-family="Arial,Helvetica,sans-serif" font-weight="700" letter-spacing="1.4">${labels[i]}</text>
        <text x="${x + 18}" y="856" fill="#f3f3f0" font-size="18" font-family="Arial,Helvetica,sans-serif" font-weight="700">${notes[i]}</text>
      `;
    }).join('');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
        <rect width="1200" height="900" fill="#080809"/>
        ${cards}
      </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(svg);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8').send(`Proof image unavailable: ${error.message}`);
  }
};