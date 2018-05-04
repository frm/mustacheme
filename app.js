const express = require('express');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const upload = multer({
  dest: 'uploads/',
});

const app = express();

const PORT = process.env.PORT || 3000;
const RM_DELAY = process.env.RM_DELAY || 5000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getMimeType = ext =>
  ({
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
  }[ext] || 'application/octet-stream');

const delayedDeleteFiles = (file, ext) => {
  setTimeout(() => {
    fs.unlink(file, () => {});
    fs.unlink(file + ext, () => {});
  }, RM_DELAY);
};

const sendImg = (res, file, { output, ext }) => err => {
  if (err) {
    console.error(err);
    res.sendStatus(500);
  } else {
    res.set('Content-Type', getMimeType(ext));
    res.sendFile(output, { root: __dirname });
    delayedDeleteFiles(file.path, ext);
  }
};

app.post('/', upload.single('image'), (req, res) => {
  const ext = path.extname(req.file.originalname);
  const output = req.file.path + ext;

  exec(
    `python3 ./lib/mustacheme.py ${req.file.path} -o ${output}`,
    sendImg(res, req.file, { output, ext })
  );
});

const start = () => {
  const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });

  const handleExit = () => {
    if (server) server.close();
  };

  const handleError = err => {
    if (err) {
      console.error(err);
    }

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
