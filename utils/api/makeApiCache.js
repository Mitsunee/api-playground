import { Cache } from "./Cache.js";
import { VersionTracker } from "./VersionTracker.js";

export async function makeApiCache({ name, current }) {
  const cache = new Cache({ name });
  const tracker = new VersionTracker(cache.dir);
  await tracker.prepare({ current });

  const saveVersions = async () => {
    await tracker.saveVersions();
    process.exit(0);
  };

  process.on("beforeExit", saveVersions);
  process.on("SIGINT", saveVersions);
  process.on("SIGTERM", saveVersions);

  return { cache, tracker };
}
