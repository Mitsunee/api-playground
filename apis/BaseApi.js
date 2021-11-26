import { log } from "../utils/log.mjs";
import { fetchJson } from "../utils/fetch.mjs";
import { readFile, readFileJson, writeFile } from "../utils/fs.mjs";
import { joinPath } from "../utils/path.mjs";

class ApiEndpoint {
  constructor({ url, path, name, dir }) {
    this.name = name;
    this.link = `https://${url}/${path}`;
    this.dir = joinPath(dir, name);
  }

  async checkUpdate(version) {
    // no version set
    if (typeof version !== "number") return true;

    try {
      const versionInfoPath = joinPath(this.dir, "version");
      const localVersion = await readFile(versionInfoPath);
      if (!localVersion) return true;
      return localVersion !== `${version}`;
    } catch {
      return true;
    }
  }

  async readLocal() {
    const data = await readFileJson(joinPath(this.dir, "data.json"));
    if (!data) {
      log.error(`Local file for endpoint '${this.name}' corrupted`);
      return false;
    }
    log.success(`Read local cache for endpoint '${this.name}'`);
    return data;
  }

  async fetch(version) {
    const data = await fetchJson(this.link);
    if (!data) {
      log.error(`Could not fetch endpoint '${this.name}'`);
      return false;
    }
    await Promise.all(
      writeFile(joinPath(this.dir, "data.json"), data),
      writeFile(joinPath(this.dir, "version"), `${version}`)
    );
    log.complete(`Fetch updated data for endpoint '${this.name}'`);
    return data;
  }
}

export class Api {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
    this.endpoints = new Map();
    this.version = false;
    this.dir = joinPath("cache", name);
  }

  setVersion({ path, fn }) {
    this.versionPath = path;
    this.versionFn = fn;
    return this;
  }

  async getVersion() {
    if (!this.versionPath) return null;
    if (this.version) return this.version;
    const info = await fetchJson(`https://${this.url}/${this.versionPath}`);
    const version = this.versionFn ? this.versionFn(info) : info;
    this.version = version;
    return version;
  }

  registerEndpoint({ path, name }) {
    if (this.endpoints.get(name)) {
      log.warn(`Endpoint '${name}' was registered twice`);
      return this;
    }

    this.endpoints.set(
      name,
      new ApiEndpoint({ path, name, url: this.url, dir: this.dir })
    );
    return this;
  }

  async loadEndpoints([endpoints]) {
    const version = await this.getVersion();
    const data = [];

    for (let i = 0; i < endpoints.length; i += 0) {
      const endpoint = this.endpoints.get(endpoints[i]);

      if (!endpoint) {
        log.warn(
          `Endpoint '${endpoints[i]}' was not registered on '${this.name}'`
        );
        data.push(null);
        continue;
      }

      const hasUpdate = await endpoint.checkUpdate(version);
      const res = hasUpdate
        ? await endpoint.fetch()
        : await endpoint.readLocal();

      data.push(res ? res : null);
    }

    return data;
  }
}
