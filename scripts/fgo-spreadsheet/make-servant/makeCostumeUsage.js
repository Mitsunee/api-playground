import { atlasConnector } from "../../../utils/api/atlas/connector.js";
import { log } from "../../../utils/log.js";
import { makeUsageRows, printUsageRows } from "./makeUsageRows.js";

async function costumeSelector({ profile, profileNa, rl }) {
  const costumes = Object.keys(profile.costume);
  if (costumes.length < 2) return costumes[0];

  const list = costumes.map(costumeKey => ({
    value: costumeKey,
    label:
      profileNa?.costume[costumeKey]?.shortName ||
      profile.costume[costumeKey].shortName
  }));

  return await rl.menu(list, `Choose costume`);
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
  if (!key) {
    if (key === false) log.error("Invalid Option");
    return;
  }

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
