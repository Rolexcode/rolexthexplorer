const fs = require('fs');
const path = require('path');

const FILES = {
  joe: '1003230269.jpg',
  menace: '1003230270.jpg',
  stakrr: '1003230281.jpg',
  robbie: '1003230292.jpg',
  joe_feedback: '1003230296.jpg',
  lib_payment: '1003230299.jpg',
  lib_praise: '1003230307.jpg'
};

module.exports = (req, res) => {
  const key = String(req.query.key || '');
  const file = FILES[key];

  if (!file) {
    res.status(404).send('Unknown proof image');
    return;
  }

  try {
    const image = fs.readFileSync(
      path.join(process.cwd(), 'assets', 'proof-originals', file)
    );

    if (image.length < 4 || image[0] !== 0xff || image[1] !== 0xd8) {
      res.status(500).send('Invalid JPEG data');
      return;
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(image);
  } catch (error) {
    console.error('proof image error', key, error);
    res.status(500).send('Unable to load proof image');
  }
};
