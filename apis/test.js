import { Api } from "./BaseApi.js";
import { log } from "../utils/log.js";

const atlasNA = new Api({ name: "Atlas NA", url: "api.atlasacademy.io" });

atlasNA
  .registerEndpoint({
    name: "nice_item",
    path: "export/NA/nice_item.json"
  })
  .registerEndpoint({
    name: "nice_servant",
    path: "export/NA/nice_servant.json"
  })
  .registerEndpoint({
    name: "nice_master_mission",
    path: "export/NA/nice_master_mission.json"
  });

atlasNA
  .loadEndpoints(["nice_item"])
  .then(([nice]) => log(`nice_item: ${nice.length} Items`));

console.log(atlasNA);
