import { Cache } from "./Cache.js";
import { VersionTracker } from "./VersionTracker.js";

export async function makeApiCache({ name, current }) {
  const cache = new Cache({ name });
  const tracker = new VersionTracker(cache.dir);
  await tracker.prepare({ current });

  process.on("beforeExit", async () => {
    await tracker.saveVersions();
    process.exit(0);
  });

  return { cache, tracker };
}
