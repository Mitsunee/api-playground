import { slugify } from "modern-diacritics";
import { fetchJson } from "@foxkit/node-util/fetch";

export class Endpoint {
  constructor({ url, name }) {
    this.key = slugify(name);
    this.url = url;
  }

  async getData({ query = false, tracker = false, cache = false }) {
    const url = query
      ? `${this.url}${this.url.endsWith("/") ? "" : "/"}${query}`
      : this.url;
    const key = query ? `${this.key}/${query}` : this.key;

    if (cache) {
      if (!tracker || !tracker.hasUpdate(key)) {
        return await cache.read(key);
      }
    }

    const res = await fetchJson(url);
    await cache?.write(key, res);
    tracker?.setUpdated(key);

    return res;
  }
}
