const fs = require('fs');
const path = require('path');

const CHUNKS = {
  joe: ['joe-0.b64'],
  menace: ['menace-0.b64'],
  stakrr: ['stakrr-0.b64'],
  robbie: ['robbie-0.b64'],
  lib_praise: ['praise-0.b64', 'praise-1.b64'],
  joe_feedback: ['trust-0.b64', 'trust-1.b64'],
  lib_payment: ['payment-0.b64', 'payment-1.b64', 'payment-2.b64']
};

module.exports = (req, res) => {
  const key = String(req.query.key || '');
  const chunks = CHUNKS[key];

  if (!chunks) {
    res.status(404).send('Unknown proof preview');
    return;
  }

  try {
    const b64 = chunks
      .map((file) => fs.readFileSync(path.join(process.cwd(), 'assets', 'proof-preview', file), 'utf8'))
      .join('');
    const image = Buffer.from(b64, 'base64');

    if (
      image.length < 12 ||
      image.toString('ascii', 0, 4) !== 'RIFF' ||
      image.toString('ascii', 8, 12) !== 'WEBP'
    ) {
      res.status(500).send('Invalid WebP preview');
      return;
    }

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(image);
  } catch (error) {
    console.error('proof preview error', key, error);
    res.status(500).send('Unable to load proof preview');
  }
};
