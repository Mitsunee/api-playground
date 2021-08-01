function makeMaterialRow(itemObj, servantData, nickname, note) {
  const {
    item: { name },
    amount
  } = itemObj;

  const row = [
    "=IFERROR(VLOOKUP(INDEX(B:B, ROW(), 1),'data/servants'!A:B,2, false))",
    nickname,
    "=IFERROR(VLOOKUP(INDEX(D:D, ROW(), 1),'data/materials'!B:D,3, false))",
    name,
    amount,
    "=VLOOKUP(INDEX(D:D,ROW(),1),Materials!B:G,6,false)<=0",
    note
  ];

  return row.join("\t");
}

function makeMaterialRows(stage, servantData, nickname, note) {
  const { items } = stage;

  const rows = items
    .filter(item => item.item.type !== "eventItem")
    .map(item => makeMaterialRow(item, servantData, nickname, note));

  return rows.join("\n");
}

module.exports = { makeMaterialRow, makeMaterialRows };
