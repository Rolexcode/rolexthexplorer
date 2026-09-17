const fs = require('fs');
const path = require('path');

const FILES = {
  joe: 'asset-joe.js',
  menace: 'asset-menace.js',
  stakrr: 'asset-stakrr.js',
  robbie: 'asset-robbie.js',
  lib_praise: 'asset-lib-praise.js',
  joe_feedback: 'asset-joe-feedback.js',
  lib_payment: 'asset-lib-payment.js'
};

module.exports = (req, res) => {
  const key = String(req.query.key || '');
  const file = FILES[key];

  if (!file) {
    res.status(404).send('Unknown proof image');
    return;
  }

  try {
    const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const match = source.match(/data:image\/jpeg;base64,([^\"]+)/);

    if (!match) {
      res.status(500).send('Proof image data missing');
      return;
    }

    const image = Buffer.from(match[1], 'base64');

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
