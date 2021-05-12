const fs = require("fs");
const path = require("path");

function resolvePath(absolutePath) {
  return path.join(process.cwd(), absolutePath);
}

function fileExists(filePath) {
  return fs.existsSync(resolvePath(filePath));
}

function writeFile(filePath, content) {
  return fs.writeFileSync(resolvePath(filePath), content, "utf8");
}

function readFile(filePath) {
  return fs.readFileSync(resolvePath(filePath), "utf8");
}

function mkdir(dirPath) {
  fs.mkdirSync(resolvePath(dirPath));
}

module.exports = { fileExists, writeFile, readFile, mkdir };
