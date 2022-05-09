import { atlasConnector } from "../../utils/api/atlas/connector.js";

function makeMaterialDataRow(material) {
  const row = [
    material.id,
    material.name,
    material.background,
    `=IMAGE("${material.icon}")`
  ];

  return row.join("\t");
}

async function main() {
  const atlasJp = await atlasConnector("JP");
  const niceItem = await atlasJp.getExport("nice_item_lang_en");

  const materials = niceItem
    .filter(({ uses, id, type }) => {
      if (type === "eventItem") return false;
      if (uses.includes("skill")) return true; // gems, mats
      if (uses.includes("ascension")) return true; // pieces, monuments
      if (id === 7999) return true; // Holy Grail
    })
    .sort(({ priority: a }, { priority: b }) => a - b);

  for (const material of materials) {
    const row = makeMaterialDataRow(material);
    console.log(row);
  }
}

main();
