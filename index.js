'use strict';
const spawn = require('./lib/spawn');
const EventEmitter = require('events');
const reg_progress = /([\d]+)%/;
const reg_archive = /Extracting from (.+\.part[\d+]\.rar)/;
const reg_password = /\nEnter password \(will not be echoed\)/;

class Unrar extends EventEmitter {
  unrar;
  kill() {
    if (this.unrar) this.unrar.kill();
  }

  /**
   * uncompress .rar file
   * @param {String} src source file path
   * @param {String} dest destination folder path
   * @param {String} [command='x'] command of unrar, default: x
   * @param {String[]} [switches] switches of unrar, default: []
   */
  uncompress({ src, dest, command = 'x', switches = [] }) {
    let errMsg = '';
    let currentArchive = '';
    let folders = [];

    return new Promise((resolve, reject) => {
      const unrar = spawn([command, ...switches, src, dest], {
        stdio: [0, 'pipe', 'pipe'],
      });
      this.unrar = unrar;

      unrar.stderr.on('data', (chunk) => {
        const data = chunk.toString();
        if (reg_password.test(data)) {
          unrar.kill();
          const error = new Error('Password protected file');
          return reject(error);
        }
        errMsg += data;
      });

      unrar.stdout.on('data', (chunk) => {
        const data = chunk.toString();
        const match = data.match(reg_progress);
        const archiveMatch = data.match(reg_archive);
        const re = new RegExp(`Extracting  ${dest}/(.+?)/.+`);
        const folderMatch = data.match(re);

        if (archiveMatch !== null) {
          currentArchive = archiveMatch[1];
          console.log('Extracting from: ', archiveMatch[1]);
        }
        if (folderMatch !== null) {
          if (folders.indexOf(folderMatch[1]) === -1) {
            folders.push(folderMatch[1]);
            console.log('Extracted to folders: ', folders);
          }
        }
        if (match !== null) this.emit('progress', Number(match[1]));
      });

      unrar.on('exit', (code) => {
        this.emit('folders', folders);
        if (code !== 0 || errMsg) {
          const error = new Error(errMsg);
          error.code = code;
          error.archive = currentArchive;
          return reject(error);
        }
        this.emit('progress', 100);
        resolve('over');
      });
    });
  }
}

const unrar = new Unrar();

module.exports = unrar;
