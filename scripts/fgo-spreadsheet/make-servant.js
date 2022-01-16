import { Command } from "commander/esm.mjs";
import { log, die } from "@foxkit/node-util/log";
import { readline } from "@foxkit/node-util/readline";

import { atlasConnector } from "../../utils/api/atlas/connector.js";
import { searchNiceServant } from "../../utils/fgo/searchNiceServant.js";
import { capitalize } from "../../utils/capitalize.js";

// scripts
import { makeServantData } from "./make-servant/makeServantData.js";
import { makeAscensionUsage } from "./make-servant/makeAscensionUsage.js";
import {
  makeSkillUsage,
  makeAppendUsage
} from "./make-servant/makeSkillUsage.js";
import { makeCostumeUsage } from "./make-servant/makeCostumeUsage.js";

// setup commander
const program = new Command();
program.version("0.0.1");
program.requiredOption("-s, --servant <id>", "Pick servant", arg => {
  if (isNaN(+arg)) {
    die("Servant ID/Collection Number must be numeric.");
  }
  return +arg;
});
program.option("-n, --name <name>", "Set servant nickname");
program.configureOutput({ writeErr: str => die(str.trim()) });

// setup menus
function makeSelectionMenu(servant) {
  const selections = [{ label: "Servant Data", value: makeServantData }];
  if (
    Object.keys(servant.ascensionMaterials).length > 0 &&
    Object.values(servant.ascensionMaterials).some(stage =>
      stage.items.some(({ item }) => item.type !== "eventItem")
    )
  ) {
    selections.push({ label: "Ascension", value: makeAscensionUsage });
  }
  if (Object.keys(servant.skillMaterials).length > 0) {
    selections.push({ label: "Skill Enhancement", value: makeSkillUsage });
  }
  if (Object.keys(servant.appendSkillMaterials).length > 0) {
    selections.push({
      label: "Append Skill Enhancement",
      value: makeAppendUsage
    });
  }
  if (Object.keys(servant.costumeMaterials).length > 0) {
    selections.push({ label: "Costume Unlock", value: makeCostumeUsage });
  }
  selections.push({ label: "Exit", value: "quit" });

  const text = `What data do you want to generate for ${servant.name}?`;

  return { selections, text };
}

async function main(opts) {
  const rl = readline();
  const atlasJp = await atlasConnector("JP");
  const niceServant = await atlasJp.getExport("nice_servant_lang_en");
  const atlasNa = await atlasConnector("NA");
  const niceServantNa = await atlasNa.getExport("nice_servant");
  let quit;

  // get servant by id or collectionNo
  const servant = searchNiceServant(niceServant, opts.servant);
  if (!servant) die(`Couldn't find servant '${opts.servant}'`);
  const servantNa = searchNiceServant(niceServantNa, opts.servant);
  if (servantNa) servant.name = servantNa.name; // this could probably be solved better...

  // print confirmation for user
  console.log(
    `Selected Servant:\n  [${servant.id}] ${servant.rarity}* ${capitalize(
      servant.className
    )} ${servant.name}${opts.name ? `\nNickname: ${opts.name}` : ""}`
  );

  while (!quit) {
    const { selections, text } = makeSelectionMenu(servant);
    const cb = await rl.menu(selections, text);
    if (typeof cb !== "function") {
      if (cb === false) log.error("Invalid Option");
      break;
    }
    await cb({ servant, rl, opts, atlasJp });
  }

  rl.close();
}

// run program
program.parse();
main(program.opts());
