import { atlasConnector } from "./utils/api/atlas/connector.js";
import { log } from "./utils/log.js";

atlasConnector("NA").then(atlasNA => {
  atlasNA
    .getExport("nice_item")
    .then(niceItem => log(`[NA] nice_item: ${niceItem.length} Items`));
});

atlasConnector("JP").then(atlasJP => {
  atlasJP
    .getExport("nice_servant_lang_en")
    .then(niceServant =>
      log(
        `[JP] nice_servant: ${
          niceServant.filter(({ type }) => type === "normal").length + 1
        } Servants`
      )
    );
});
