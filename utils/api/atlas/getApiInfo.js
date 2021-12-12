import { fetchJson } from "../../fetch.js";

// global memo
const apiInfo = fetchJson("https://api.atlasacademy.io/info");

export async function getApiInfo(region) {
  const info = await apiInfo;
  return info[region.toUpperCase()];
}
