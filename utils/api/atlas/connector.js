import "picoapi/node-polyfill";
import { createApi } from "picoapi";

import { getApiInfo } from "./getApiInfo.js";
import { makeApiCache } from "../makeApiCache.js";
import { attachApiCache } from "../attachApiCache.js";

export async function atlasConnector(region) {
  region = region.toUpperCase();
  const name = `Atlas ${region}`;
  const current = await getApiInfo(region);
  const baseUrl = "https://api.atlasacademy.io";

  const { cache, tracker } = await makeApiCache({ name, current });

  // export endpoint (kinda hacky for now but oh well)
  const exportEndpoint = createApi(`${baseUrl}/export`);
  attachApiCache(exportEndpoint, cache, tracker);
  const getExport = async fileName => {
    return exportEndpoint[region](
      fileName.endsWith(".json") ? fileName : `${fileName}.json`
    );
  };

  // return API
  return {
    getExport,
    nice: createApi(`${baseUrl}/nice/${region}`),
    basic: createApi(`${baseUrl}/basic/${region}`)
  };
}
