const { ApiManager } = require("../utils/ApiManager"); // import API Manager class

// Register API
const atlasJP = new ApiManager("atlas_jp", "https://api.atlasacademy.io");

// Register info endpoint for version comparison (optional!)
atlasJP.setInfoEndpoint("info", response => response.JP);

// Register endpoints to cache
atlasJP
  .addEndpoint("nice_item", "export/JP/nice_item.json")
  .addEndpoint("nice_item_lang_en", "export/JP/nice_item_lang_en.json")
  .addEndpoint("nice_servant", "export/JP/nice_servant.json")
  .addEndpoint("nice_servant_lang_en", "export/JP/nice_servant_lang_en.json");

// export for update script
module.exports = { atlasJP };
