import { getApiInfo } from "./getApiInfo.js";
import { makeApiCache } from "../makeApiCache.js";
import { Endpoint } from "../Endpoint.js";

export async function atlasConnector(region) {
  const name = `Atlas ${region.toUpperCase()}`;
  const current = await getApiInfo(region);
  const baseUrl = "https://api.atlasacademy.io";

  const { cache, tracker } = await makeApiCache({ name, current });

  // TODO: rewrite this to use picoapi
  // endpoints
  const exportEndpoint = new Endpoint({
    url: `${baseUrl}/export/${region.toUpperCase()}`,
    name: "export"
  });

  // return API
  return {
    getExport: async function (exportName) {
      return await exportEndpoint.getData({
        cache,
        tracker,
        query: `${exportName}.json`
      });
    }
  };
}
