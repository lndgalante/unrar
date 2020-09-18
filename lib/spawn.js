const path = require('path');
const { spawn } = require('child_process');
const unrarPath = require('./unrar-binaries');

/**
* @param {String[]} args
*/
module.exports = function (...args) {
  return spawn(unrarPath, ...args);
}
