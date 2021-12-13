function makeUsageRow({ collectionNo, item, amount, subject }) {
  const row = [
    item.id, // item ID for lookup
    `=IFERROR(VLOOKUP(${collectionNo},'data/servants'!A:C,3,false))`, // servant icon
    `=IFERROR(VLOOKUP(${collectionNo},'data/servants'!A:B,2,false))`, // servant name
    "=IFERROR(VLOOKUP(INDEX(A:A,ROW(),1),'data/materials'!A:D,4,false))", // material icon
    "=IFERROR(VLOOKUP(INDEX(A:A,ROW(),1),'data/materials'!A:B,2,false))", // material name
    amount,
    "=IFERROR(VLOOKUP(INDEX(A:A,ROW(),1),'Materials (All Servants)'!A:G,7,false)<=0,FALSE)", // Can do
    subject
  ];

  return row.join("\t");
}

export function makeUsageRows({ collectionNo, items, subject }) {
  return items
    .filter(({ item }) => {
      if (item.type === "eventItem") return false;
      return true;
    })
    .map(({ item, amount }) => {
      return makeUsageRow({ collectionNo, item, amount, subject });
    });
}

export function printUsageRows(rows) {
  console.log(`\n${rows.join("\n")}`);
}
