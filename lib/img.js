const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const glob = require('glob');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const im = require('imagemagick');

const RM_DELAY = process.env.RM_DELAY || 30000;

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const promisifiedExec = command =>
  new Promise((resolve, reject) => {
    exec(command, err => (err ? reject(err) : resolve()));
  });

const getMimeType = file => {
  const buffer = readChunk.sync(file.path, 0, 4100);
  return fileType(buffer).mime;
};

const validFileFormat = file => {
  if (file.mimetype === 'application/octet-stream') {
    const mimeType = getMimeType(file);
    return SUPPORTED_MIME_TYPES.includes(mimeType);
  }

  return SUPPORTED_MIME_TYPES.includes(file.mimetype);
};

const isGif = file =>
  file.mimetype === 'image/gif' || getMimeType(file) === 'image/gif';

const deleteFiles = (file, ext) => {
  fs.unlink(file, () => {});
  fs.unlink(file + ext, () => {});
};

const delayedDeleteFiles = (file, ext) => {
  setTimeout(() => {
    deleteFiles(file, ext);
  }, RM_DELAY);
};

const joinGifFrames = (file, output) =>
  new Promise((resolve, reject) => {
    glob(`${file.path}_frame_*.converted.gif`, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      im.convert(
        ['-delay', '20', '-loop', '0', '-layers', 'OptimizeTransparency']
          .concat(files)
          .concat([output]),
        convertErr => (convertErr ? reject(convertErr) : resolve())
      );
    });
  });

const convertGifFrames = file =>
  new Promise((resolve, reject) => {
    glob(`${file.path}_frame_*.gif`, async (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const tasks = files.map(fileName => {
        const output = `${fileName}.converted.gif`;

        return promisifiedExec(
          `python3 ./lib/mustache/mustacheme.py ${fileName} -o ${output}`
        );
      });

      Promise.all(tasks)
        .then(resolve)
        .catch(reject);
    });
  });

const splitGifFrames = file =>
  new Promise((resolve, reject) => {
    im.convert(
      [file.path, '-coalesce', `${file.path}_frame_%03d.gif`],
      err => (err ? reject(err) : resolve())
    );
  });

const convertGif = async (file, callback) => {
  const ext = path.extname(file.originalname);
  const output = file.path + ext;

  await splitGifFrames(file);
  await convertGifFrames(file);
  await joinGifFrames(file, output);

  callback(output, ext);

  delayedDeleteFiles(file.path, output);
};

const convertStatic = (file, callback) => {
  const ext = path.extname(file.originalname);
  const output = file.path + ext;

  promisifiedExec(
    `python3 ./lib/mustache/mustacheme.py ${file.path} -o ${output}`
  )
    .then(() => {
      callback(output, ext);
    })
    .catch(err => {
      callback(null, null, err);
    })
    .finally(() => {
      deleteFiles(file.path);
    });
};

const convert = (file, callback) => {
  if (!validFileFormat(file)) {
    callback(null, null, 'invalid file type');
    deleteFiles(file.path, '');

    return;
  }

  if (isGif(file)) {
    convertGif(file, callback);
  } else {
    convertStatic(file, callback);
  }
};

module.exports = { convert };
