const path = require("path");
const appRootDir = require('app-root-dir').get();

let executablePath;

switch (process.platform) {
  case "win32":
    executablePath = path.join(appRootDir, "bin/win32/unrar.exe");
    break;
  case "linux":
    executablePath = path.join(appRootDir, "bin/linux/unrar-" + process.arch);
    break;
  case "darwin":
    executablePath = path.join(appRootDir, "bin/darwin/unrar");
    break;
  default:
    throw new Error("this package is incompatible with platform " + process.platform);
}

module.exports = executablePath;

