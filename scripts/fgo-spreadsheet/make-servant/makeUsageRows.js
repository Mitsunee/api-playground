function makeUsageRow({ collectionNo, item, amount, subject }) {
  const row = [
    item.id, // item ID for lookup
    `=IFERROR(VLOOKUP(${collectionNo},Servants,3,false),"?")`, // servant icon
    `=IFERROR(VLOOKUP(${collectionNo},Servants,2,false),"Unknown Servant")`, // servant name
    `=IFERROR(VLOOKUP(INDEX(A:A,ROW(),1),Materials,4,false),"?")`, // material icon
    `=IFERROR(VLOOKUP(INDEX(A:A,ROW(),1),Materials,2,false),"Unknown Item")`, // material name
    amount,
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
