const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');

const img = require('./lib/img');

const upload = multer({
  dest: 'uploads/',
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getMimeType = ext =>
  ({
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
  }[ext] || 'application/octet-stream');

const sendImg = (res, output, ext, err) => {
  if (err) {
    console.error(err);
    res.sendStatus(400);
  } else {
    res.set('Content-Type', getMimeType(ext));
    res.sendFile(output, { root: __dirname });
  }
};

app.post('/', upload.single('image'), (req, res) => {
  img.convert(req.file, (output, ext, err) => {
    sendImg(res, output, ext, err);
  });
});

const start = () => {
  const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });

  const handleExit = () => {
    if (server) server.close();
  };

  const handleError = err => {
    if (err) console.error(err);

    process.exit(1);
  };

  process.on('exit', handleExit);
  process.on('SIGINT', () => handleError());
  process.on('uncaughtException', handleError);
};

if (require.main === module) {
  start();
} else {
  module.exports = {
    start,
  };
}
