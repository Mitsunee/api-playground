import { Command } from "commander/esm.mjs";
import { die } from "@foxkit/node-util/log";

import { atlasConnector } from "../../utils/api/atlas/connector.js";
import { searchNiceServant } from "../../utils/fgo/searchNiceServant.js";

const program = new Command();
program.version("0.0.1");
program.requiredOption("-c, --ce <id>", "Pick Craft Essence", arg => {
  if (isNaN(+arg)) {
    die("Craft Essence ID/Collection Number must be numeric.");
  }
  return +arg;
});
program.option("-n, --name <name>", "Set custom name");
program.configureOutput({ writeErr: str => die(str.trim()) });

function makeCeRow({ ce, name }) {
  const row = [
    ce.id,
    name,
    `=IMAGE("${ce.extraAssets.faces.equip[ce.id]}")`,
    `=IMAGE("${ce.extraAssets.equipFace.equip[ce.id]}")`,
    ce.rarity,
    ce.cost
  ];

  return row.join("\t");
}

async function main(opts) {
  const atlasJp = await atlasConnector("JP");
  const niceCE = await atlasJp.getExport("nice_equip_lang_en");
  const ce = searchNiceServant(niceCE, opts.ce); // ignore that the function is meant for servants, it works for CEs as well... lol

  // check that a ce was found
  if (!ce) die(`Couldn't find craft essence '${opts.ce}'`);

  // print confirmation for user
  console.log(
    `Selected CE:\n  [${ce.id}] ${ce.rarity}* ${ce.name}${
      opts.name ? `\nCustom Name: ${opts.name}` : ""
    }\n`
  );

  const row = makeCeRow({ ce, name: opts.name || ce.name });
  console.log(row);
}

// run program
program.parse();
main(program.opts());
