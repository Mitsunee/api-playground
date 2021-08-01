const niceServant = require("../../cache/atlas_jp/nice_servant_lang_en");

niceServant
  .map(servant => [
    ...Object.values(servant.ascensionMaterials),
    ...Object.values(servant.skillMaterials)
  ])
  .flat()
  .map(i => i.items)
  .flat()
  .map(i => i.item)
  .filter(
    (value, index, self) =>
      value.type !== "eventItem" &&
      self.findIndex(({ id }) => id === value.id) === index
  )
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
