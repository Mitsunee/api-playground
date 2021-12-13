import { getNiceServantFaces } from "../../../utils/fgo/getNiceServantFaces.js";
import { capitalize } from "../../../utils/capitalize.js";

function makeServantDataRow({ servant, nickname, image }) {
  const row = [
    servant.collectionNo,
    nickname,
    `=IMAGE("${image}")`,
    servant.rarity,
    capitalize(servant.className)
  ];

  return row.join("\t");
}

export async function makeServantData({ servant, opts, rl }) {
  let input;

  // ask for nickname
  input = opts.name || (await rl.question("\nServant Nickname (optional)"));
  const nickname = input || servant.name;

  // artwork picker
  console.log("\nAvailable Artworks:");
  const artworks = getNiceServantFaces(servant);
  for (let i = 0; i < artworks.length; i++) {
    console.log(`  ${i}) ${artworks[i][0]}`);
  }
  input = Number(
    await rl.question(`\nPick Artwork (0-${artworks.length - 1})`)
  );
  const artwork = input ? (isNaN(+input) ? 0 : +input) : 0;
  const image = artworks[artwork][1];

  console.log(`\n${makeServantDataRow({ servant, nickname, image })}`);
}
