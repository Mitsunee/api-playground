import { getFileName } from "@foxkit/node-util/path";

export function attachApiCache(api, cache, tracker = false) {
  // if up-to-date read from cache instead
  api.on("prefetch", async ({ url }) => {
    const key = getFileName(url);
    console.log(`checking cache for ${key}`);
    if (!tracker || !tracker.hasUpdate(key)) {
      console.log(`reading cache for ${key}`);
      return await cache.read(key);
    }
  });

  api.on("success", async ({ url, data }) => {
    const key = getFileName(url);
    console.log(`writing cache for ${key}`);
    await cache?.write(key, data);
    tracker?.setUpdated(key);
  });
}
