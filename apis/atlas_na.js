const { ApiManager } = require("../utils/ApiManager"); // import API Manager class

// Register API
const atlasNA = new ApiManager("atlas_na", "https://api.atlasacademy.io");

// Register info endpoint for version comparison (optional!)
atlasNA.setInfoEndpoint("info", response => response.NA);

// Register endpoints to cache
atlasNA
  .addEndpoint("nice_item", "export/NA/nice_item.json")
  .addEndpoint("nice_servant", "export/NA/nice_servant.json");

// export for update script
module.exports = { atlasNA };
