import { fetchJson } from "@foxkit/node-util/fetch";

// global memo
const apiInfo = fetchJson("https://api.atlasacademy.io/info");

export async function getApiInfo(region) {
  const info = await apiInfo;
  return info[region.toUpperCase()].timestamp;
}
