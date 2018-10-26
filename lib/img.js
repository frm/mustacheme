const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const fileType = require('file-type');
const readChunk = require('read-chunk');

const RM_DELAY = process.env.RM_DELAY || 30000;

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

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

const deleteFiles = (file, ext) => {
  fs.unlink(file, () => {});
  fs.unlink(file + ext, () => {});
};

const delayedDeleteFiles = (file, ext) => {
  setTimeout(() => {
    deleteFiles(file, ext);
  }, RM_DELAY);
};

const convert = (file, callback) => {
  if (!validFileFormat(file)) {
    callback(null, null, 'invalid file type');
    deleteFiles(file.path, '');

    return;
  }

  const ext = path.extname(file.originalname);
  const output = file.path + ext;

  exec(
    `python3 ./lib/mustache/mustacheme.py ${file.path} -o ${output}`,
    err => {
      callback(output, ext, err);
      delayedDeleteFiles(file.path);
    }
  );
};

module.exports = { convert };
