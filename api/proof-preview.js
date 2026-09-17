const fs = require('fs');
const path = require('path');

const PROOFS = {
  joe: { file: '1003230269.jpg', y: 0.70, ratio: 2.5 },
  menace: { file: '1003230270.jpg', y: 0.61, ratio: 2.5 },
  stakrr: { file: '1003230281.jpg', y: 0.48, ratio: 2.5 },
  robbie: { file: '1003230292.jpg', y: 0.67, ratio: 2.5 },
  lib_praise: { file: '1003230307.jpg', y: 0.22, ratio: 1.4 },
  joe_feedback: { file: '1003230296.jpg', y: 0.61, ratio: 1.4 },
  lib_payment: { file: '1003230299.jpg', y: 0.78, ratio: 1.4 }
};

module.exports = (req, res) => {
  const key = String(req.query.key || '');
  const proof = PROOFS[key];

  if (!proof) {
    res.status(404).send('Unknown proof preview');
    return;
  }

  try {
    const image = fs.readFileSync(
      path.join(process.cwd(), 'assets', 'proof-originals', proof.file)
    );

    if (image.length < 4 || image[0] !== 0xff || image[1] !== 0xd8) {
      res.status(500).send('Invalid JPEG data');
      return;
    }

    const width = 691;
    const height = 1536;
    const cropWidth = width;
    const cropHeight = Math.round(width / proof.ratio);
    const centerY = Math.round(height * proof.y);
    const cropY = Math.max(0, Math.min(height - cropHeight, centerY - Math.round(cropHeight / 2)));
    const encoded = image.toString('base64');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${cropY} ${cropWidth} ${cropHeight}" width="${cropWidth}" height="${cropHeight}">
  <image href="data:image/jpeg;base64,${encoded}" x="0" y="0" width="${width}" height="${height}"/>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(svg);
  } catch (error) {
    console.error('proof preview error', key, error);
    res.status(500).send('Unable to load proof preview');
  }
};
