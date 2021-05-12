const fetch = require("node-fetch");
const { Headers } = require("node-fetch");
const { readFile, writeFile } = require("./fs");

fetchHeader = new Headers();
fetchHeader.append("pragma", "no-cache");
fetchHeader.append("cache-control", "no-cache");
fetchInit = {
  method: "GET",
  headers: fetchHeader
};

async function fetchJson(url) {
  try {
    const response = await fetch(url, fetchInit);
    return await response.json();
  } catch (e) {
    return null;
  }
}

function readFileJson(path) {
  try {
    const content = readFile(path);
    const data = JSON.parse(content);
    return data;
  } catch (e) {
    return null;
  }
}

function writeFileJson(path, jsonData) {
  writeFile(path, JSON.stringify(jsonData));
}

module.exports = { fetchJson, readFileJson, writeFileJson };
