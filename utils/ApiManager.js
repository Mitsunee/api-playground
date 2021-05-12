const { fetchJson, writeFileJson, readFileJson } = require("./json");
const { fileExists, mkdir } = require("./fs");
const { areEqual } = require("./object");

class ApiEndpoint {
  constructor(name, endpoint) {
    this.name = name;
    this.filename = `${name}.json`;
    this.endpoint = endpoint;
  }
}

class ApiManager {
  constructor(name, url) {
    this.name = name.replace(/[^0-9a-z_-]/gi, "");
    this.url = url.endsWith("/") ? url : `${url}/`;
    this.path = `cache/${this.name}/`;

    // default values
    this.cachedEndpoints = [];
    this.infoEndpoint = null;
    this.infoCallback = null;
  }

  setInfoEndpoint(endpoint, callback) {
    this.infoEndpoint = new ApiEndpoint("info", endpoint);
    if (callback && typeof callback === "function")
      this.infoCallback = callback;

    return this;
  }

  addEndpoint(name, endpoint) {
    this.cachedEndpoints.push(new ApiEndpoint(name, endpoint));
    return this;
  }

  /* run + sub methods */

  // internally used
  touchDirs() {
    if (!fileExists("cache")) mkdir("cache");
    const path = this.path.substring(0, this.path.length - 1);
    if (!fileExists(path)) mkdir(path);
  }

  // internally used
  async getVersions() {
    // handle no endpoint
    if (!this.infoEndpoint) {
      return { localVersion: { version: -1 }, currentVersion: { version: 0 } };
    }

    const localVersion = readFileJson(this.path + "__version_info.json");
    let currentVersion = await fetchJson(this.url + this.infoEndpoint.endpoint);

    if (this.infoCallback) {
      currentVersion = this.infoCallback(currentVersion);
    }

    return { localVersion, currentVersion };
  }

  // internally used
  async updateEndpoint(endpoint) {
    const data = await fetchJson(this.url + endpoint.endpoint);
    writeFileJson(this.path + endpoint.filename, data);
    console.log(`Updated endpoint '${endpoint.name}' for ${this.name}`);
  }

  // internally used
  shouldUpdate(versions) {
    const { localVersion, currentVersion } = versions;

    // handle default values
    if (localVersion === null) return true;
    if (currentVersion === null) {
      throw new Error(`${this.name} could not read API Info Endpoint`);
      return false;
    }

    // actual version comparison
    return !areEqual(localVersion, currentVersion);
  }

  async run(force) {
    this.touchDirs();
    const versions = await this.getVersions();
    const shouldUpdate = this.shouldUpdate(versions);

    if (!force && !shouldUpdate) {
      console.log(
        `${this.name} was not updated because 'force' was not set and the versions don't differ`
      );
      return false;
    }

    // update endpoints
    let prom = [];
    for (let endpoint of this.cachedEndpoints) {
      prom.push(this.updateEndpoint(endpoint));
    }
    await Promise.all(prom);

    // write info
    if (this.infoEndpoint) {
      writeFileJson(this.path + "__version_info.json", versions.currentVersion);
      console.log(
        `Updated ${this.name} from`,
        versions.localVersion,
        "to",
        versions.currentVersion
      );
    } else {
      console.log(`Updated ${this.name}`);
    }
  }
}

module.exports = { ApiManager };
