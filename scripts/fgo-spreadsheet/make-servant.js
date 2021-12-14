import { Command } from "commander/esm.mjs";
import { log, die } from "../../utils/log.js";
import { readline } from "../../utils/readline.js";
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
const menus = new Map([
  ["data", { text: "Servant Data", script: makeServantData }],
  ["ascension", { text: "Ascension", script: makeAscensionUsage }],
  ["skill", { text: "Skill Enhancement", script: makeSkillUsage }],
  ["append", { text: "Append Skill Enhancement", script: makeAppendUsage }],
  ["costume", { text: "Costume Unlock", script: makeCostumeUsage }],
  ["quit", { text: "Exit" }]
]);
function makeSelectionMenu(servant) {
  const selections = ["data"];
  if (
    Object.keys(servant.ascensionMaterials).length > 0 &&
    Object.values(servant.ascensionMaterials).some(stage =>
      stage.items.some(({ item }) => item.type !== "eventItem")
    )
  ) {
    selections.push("ascension");
  }
  if (Object.keys(servant.skillMaterials).length > 0) {
    selections.push("skill");
  }
  if (Object.keys(servant.appendSkillMaterials).length > 0) {
    selections.push("append");
  }
  if (Object.keys(servant.costumeMaterials).length > 0) {
    selections.push("costume");
  }
  selections.push("quit");

  const text = `\nWhat data do you want to generate for ${
    servant.name
  }?${selections
    .map((sel, i) => {
      const selection = menus.get(sel);
      if (!selection) return "";
      return `\n  ${i}) ${selection.text}`;
    })
    .join("")}\nOption (0-${selections.length - 1})`;

  const getCallback = input => {
    if (!input) return false;

    // get from selections and check for quit option
    const sel = selections[input];
    if (!sel) return null;
    if (sel === "quit") return false;

    // get from global map
    const selection = menus.get(sel);
    if (!selection) return null;
    if (!selection.script) return () => log.error(`Unimplemented: ${sel}`);

    // return callback
    return selection.script;
  };

  return { selections, text, getCallback };
}

async function main(opts) {
  const rl = readline();
  const atlasJp = await atlasConnector("JP");
  const niceServant = await atlasJp.getExport("nice_servant_lang_en");
  let quit;

  // get servant by id or collectionNo
  const servant = searchNiceServant(niceServant, opts.servant);
  if (!servant) die(`Couldn't find servant '${opts.servant}'`);

  // print confirmation for user
  console.log(
    `Selected Servant:\n  [${servant.id}] ${servant.rarity}* ${capitalize(
      servant.className
    )} ${servant.name}${opts.name ? `\nNickname: ${opts.name}` : ""}`
  );

  while (!quit) {
    const menu = makeSelectionMenu(servant);
    const input = await rl.question(menu.text);
    const cb = menu.getCallback(input);
    if (cb === null) {
      log.error("Invalid Option");
      continue;
    }
    if (cb === false) {
      quit = true;
      break;
    }
    await cb({ servant, rl, opts, atlasJp });
  }

  rl.close();
}

// run program
program.parse();
main(program.opts());
