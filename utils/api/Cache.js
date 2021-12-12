import { slugify } from "modern-diacritics";
import { joinPath } from "../path.js";
import { readFileJson, writeFile } from "../fs.js";
import { isRoot } from "../isRoot.js";

isRoot();

const forceExt = key => (key.endsWith(".json") ? key : `${key}.json`);

export class Cache {
  constructor({ name }) {
    this.name = name;
    this.slug = slugify(name);
    this.dir = joinPath("cache", this.slug);
  }

  // async!
  read(key) {
    return readFileJson(joinPath(this.dir, forceExt(key)));
  }

  // async!
  write(key, data) {
    return writeFile(joinPath(this.dir, forceExt(key)), data);
  }
}
