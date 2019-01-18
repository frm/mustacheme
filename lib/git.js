const { execSync } = require('child_process');

const currentGitRev = () => execSync('git rev-parse --verify HEAD');

module.exports = { currentGitRev };
