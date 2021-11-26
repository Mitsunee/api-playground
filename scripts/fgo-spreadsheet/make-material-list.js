const niceItem = require("../../cache/atlas_jp/nice_item_lang_en");

niceItem
  .filter(({ uses, id, type }) => {
    if (type === "eventItem") return false;
    if (uses.includes("skill")) return true; // gems, mats
    if (uses.includes("ascension")) return true; // pieces, monuments
    if (id === 7999) return true; // Holy Grail
  })
  .sort(({ priority: a }, { priority: b }) => a - b)
  .forEach(makeMaterialRow);

function makeMaterialRow(material) {
  const row = [
    material.id,
    material.name,
    material.background,
    `=IMAGE("${material.icon}")`
  ];

  console.log(row.join("\t"));
}
