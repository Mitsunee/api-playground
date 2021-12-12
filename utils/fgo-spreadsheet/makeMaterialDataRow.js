export function makeMaterialDataRow(material) {
  const row = [
    material.id,
    material.name,
    material.background,
    `=IMAGE("${material.icon}")`
  ];

  return row.join("\t");
}
