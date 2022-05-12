import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { joinPath } from "@foxkit/node-util/path";

export class VersionTracker {
  constructor(dir) {
    this.path = joinPath(dir, "__versions.json");
    this.current = null;
  }

  static async create({ dir, current }) {
    const tracker = new VersionTracker(dir);
    await tracker.prepare(current);
    return tracker;
  }

  async prepare(current = 0) {
    this.current = current;

    const versions = await readFileJson(this.path);

    if (!versions) {
      this.versions = new Object();
      return;
    }

    this.versions = versions;
  }

  hasUpdate(key) {
    if (this.versions[key] == null) return true;
    return this.current > this.versions[key];
  }

  setUpdated(key) {
    this.versions[key] = this.current;
  }

  async saveVersions() {
    await writeFile(this.path, this.versions);
  }
}
