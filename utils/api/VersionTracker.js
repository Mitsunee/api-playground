import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { joinPath } from "@foxkit/node-util/path";

import { deepEqual } from "../object.js";

export class VersionTracker {
  constructor(dir) {
    this.path = joinPath(dir, "__versions.json");
    this.current = null;
  }

  async prepare({ current = null }) {
    this.current = current;

    const versions = await readFileJson(this.path);

    if (!versions) {
      this.versions = new Object();
      return;
    }

    this.versions = versions;
  }

  hasUpdate(key) {
    if (this.current === null || this.versions[key] == null) {
      return true;
    }
    if (typeof this.current === "object") {
      return !deepEqual(this.current, this.versions[key]);
    }
    return this.current > this.versions[key];
  }

  setUpdated(key) {
    this.versions[key] = this.current;
  }

  async saveVersions() {
    await writeFile(this.path, this.versions);
  }
}
