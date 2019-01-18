const { execSync } = require('child_process');

const { HEROKU_SLUG_COMMIT } = process.env;

const currentGitRev = () =>
  HEROKU_SLUG_COMMIT || execSync('git rev-parse --verify HEAD');

module.exports = { currentGitRev };
