const fs = require("fs");
const path = require("path");

function setExecutable(path) {
	const mode = fs.statSync(path).mode;
	const executableMode = mode | fs.constants.S_IXUSR; // set user executable bit
	console.log("setting executable mode on " + path);
	fs.chmodSync(path, executableMode);
}

const binSrcPath = path.join(__dirname, "bin");
const binDestPath = path.join(__dirname, "bin");
const binDestPathMac = path.join(__dirname, "bin", "darwin");
const binDestPathWin = path.join(__dirname, "bin", "win32");

fs.rename(binSrcPath, binDestPath, () => {
	fs.readdir(binDestPathMac, (err, files) => {
		if (err) throw err;
		files.forEach((file) => setExecutable(path.join(binDestPathMac, file)));
	});
	fs.readdir(binDestPathWin, (err, files) => {
		if (err) throw err;
		files.forEach((file) => setExecutable(path.join(binDestPathWin, file)));
	});
});
