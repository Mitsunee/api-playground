import { isRoot } from "../utils/isRoot.js";
import { readline } from "../utils/readline.js";
import { readdir, rm } from "fs/promises";
import { resolvePath } from "../utils/path.js";
import { readFileJson, writeFile } from "../utils/fs.js";
import { die, log } from "../utils/log.js";

isRoot();

async function main() {
  const rl = readline();
  const caches = await readdir(resolvePath("cache"));

  const cache = await rl.menu(caches, "Choose cache");

  // if user picked no valid option quit
  if (cache == null) {
    rl.close();
    return;
  }

  // get versions file
  const versions = await readFileJson(
    resolvePath("cache", cache, "__versions.json")
  );
  if (!versions) die(`Couldn't find version file for cache '${cache}'`);

  const target = await rl.menu(
    ["all"].concat(Object.keys(versions)),
    "Choose cache file to invalidate"
  );

  switch (target) {
    case null: {
      log("No cache file was chosen");
      rl.close();
      return;
    }

    case "all": {
      await rm(resolvePath("cache", cache, "__versions.json"));
      log.success(`Invalidated all cached files for cache '${cache}'`);
      rl.close();
      return;
    }

    default: {
      delete versions[target];
      await writeFile(resolvePath("cache", cache, "__versions.json"), versions);
      log.success(`Invalidated '${target}' for cache '${cache}'`);
      rl.close();
      return;
    }
  }
}

main();
