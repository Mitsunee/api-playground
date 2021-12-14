import { atlasConnector } from "../../../utils/api/atlas/connector.js";
import { makeUsageRows, printUsageRows } from "./makeUsageRows.js";

async function costumeSelector({ profile, profileNa, rl }) {
  const costumes = Object.keys(profile.costume);
  if (costumes.length < 2) return costumes[0];

  const list = costumes.map(
    (costumeIndex, idx) =>
      `\n  ${idx}) ${
        profileNa?.costume[costumeIndex]?.name ||
        profile.costume[costumeIndex].name
      }`
  );
  const choice = await rl.question(
    `\nChoose costume:${list}\nOption (0-${costumes.length - 1})`
  );
  const costume = costumes[choice];

  return costume || null;
}

export async function makeCostumeUsage({ servant, rl, atlasJp }) {
  const { collectionNo, costumeMaterials } = servant;

  // get JP profile
  const niceServantLore = await atlasJp.getExport("nice_servant_lore_lang_en");
  const { profile } = niceServantLore.find(({ id }) => id === servant.id);

  // get NA profile
  const atlasNa = await atlasConnector("NA");
  const niceServantLoreNa = await atlasNa.getExport("nice_servant_lore");
  const profileNa = niceServantLoreNa.find(
    ({ id }) => id === servant.id
  )?.profile;

  // get user selection
  const key = await costumeSelector({ profile, profileNa, rl });
  if (key === null) return;

  const rows = new Array();
  const { items } = costumeMaterials[key];
  makeUsageRows({
    collectionNo,
    items,
    subject: `Costume Unlock: ${
      profileNa?.costume[key]?.shortName || profile.costume[key].shortName
    }`
  }).forEach(row => rows.push(row));

  printUsageRows(rows);
}
