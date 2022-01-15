import { atlasConnector } from "../../utils/api/atlas/connector.js";

function makeMcRow(mc) {
  const row = [
    mc.id,
    mc.name.replace(/^Mystic Code:/gi, "").trim(),
    `=IMAGE("${mc.extraAssets.item.female}")`
  ];

  return row.join("\t");
}

async function main() {
  const atlasJP = await atlasConnector("JP");
  const mysticCodes = await atlasJP.getExport("nice_mystic_code_lang_en");

  for (const mc of mysticCodes) {
    const row = makeMcRow(mc);
    console.log(row);
  }
}

main();
