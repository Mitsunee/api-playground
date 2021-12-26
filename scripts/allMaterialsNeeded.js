import { atlasConnector } from "../utils/api/atlas/connector.js";
//import picocolors from "picocolors";

//const { yellow, cyan } = picocolors;

function mapAllMats(servant) {
  return [
    ...Object.values(servant.ascensionMaterials),
    ...Object.values(servant.skillMaterials),
    ...Object.values(servant.appendSkillMaterials),
    ...Object.values(servant.costumeMaterials)
  ];
}

function reduceMats(needs, { items }) {
  if (!needs) throw new Error("wtf man");
  if (!items) return needs;
  for (const { item, amount } of items) {
    const { name, type, priority } = item;

    // skip event item
    if (type === "eventItem") continue;

    // find index
    let idx = needs.findIndex(item => item.name === name);

    // create item if it's not there yet
    if (idx < 0) {
      idx = needs.length;
      needs.push({ amount: 0, priority, name });
    }

    // add amount
    needs[idx].amount = needs[idx].amount + amount;
  }

  return needs;
}

function sortByPriority(a, b) {
  return a.priority - b.priority;
}

function reduceToTable(table, { name, amount }) {
  table[name] = amount;

  return table;
}

function calcNeeds(nice) {
  return nice
    .filter(({ type }) => type !== "enemyCollectionDetail")
    .flatMap(mapAllMats)
    .reduce(reduceMats, new Array())
    .sort(sortByPriority)
    .reduce(reduceToTable, new Object());
}

async function main() {
  const atlasJP = await atlasConnector("JP");
  const niceServant = await atlasJP.getExport("nice_servant_lang_en");
  const atlasNA = await atlasConnector("NA");
  const niceServantNA = await atlasNA.getExport("nice_servant");

  const needsJP = calcNeeds(niceServant);
  const needsNA = calcNeeds(niceServantNA);

  console.log("JP:");
  console.table(needsJP);
  console.log("\nNA:");
  console.table(needsNA);
}

main();
