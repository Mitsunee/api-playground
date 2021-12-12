import { atlasConnector } from "../../utils/api/atlas/connector.js";
import { readline } from "../../utils/readline.js";
import { searchNiceServant } from "../../utils/fgo/searchNiceServant.js";
import { capitalize } from "../../utils/capitalize.js";
import { getNiceServantFaces } from "../../utils/fgo/getNiceServantFaces.js";
import { makeServantDataRow } from "../../utils/fgo-spreadsheet/makeServantDataRow.js";

/////////////////////////////////////////////
import { die } from "../utils/log.js";
die("This script is getting split up into 3 scripts");
/////////////////////////////////////////////

const rl = readline();

async function main() {
  const atlasJp = await atlasConnector("JP");
  const niceServant = await atlasJp.getExport("nice_servant_lang_en");
  let input;

  // get servant by id or collectionNo
  input = Number(await rl.question("Servant ID or Collection Number"));
  const servant = searchNiceServant(niceServant, input);
  if (!servant) die(`Couldn't find servant '${input}'`);

  // print confirmation for user
  console.log(
    `\n  ID: ${servant.id}\n  Name: ${servant.name}\n  ${
      servant.rarity
    }* ${capitalize(servant.className)}\n`
  );

  // ask for nickname
  input = await rl.question("Servant Nickname (optional)");
  const nickname = input || servant.name;

  // artwork picker
  console.log("\nAvailable Artworks:");
  const artworks = getNiceServantFaces(servant);
  for (let i = 0; i < artworks.length; i++) {
    console.log(`  ${i}) ${artworks[i][0]}`);
  }
  console.log("");
  input = Number(
    await rl.question(`\nPick Artwork (0-${artworks.length - 1})`)
  );
  const artwork = input ? (isNaN(+input) ? 0 : +input) : 0;
  const image = artworks[artwork][1];

  console.log(`\n\n${makeServantDataRow({ servant, nickname, image })}`);
}

main().then(() => rl.close());
