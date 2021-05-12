// import your APIs here
const { atlasNA } = require("./apis/atlas_na");
const { atlasJP } = require("./apis/atlas_jp");

// leave this alone unless you want to rename the arg
const forceSetting =
  process.argv.includes("--force") || process.argv.includes("-f");

process.argv.forEach(arg => {
  // define your args to run the api updaters here
  switch (arg) {
    case "atlas_na":
      atlasNA.run(forceSetting);
      break;
    case "atlas_jp":
      atlasJP.run(forceSetting);
      break;
  }
});
