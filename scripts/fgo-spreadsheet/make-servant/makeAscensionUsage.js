import { splitAscensionValues } from "../../../utils/fgo/splitAscensionValues.js";
import { makeUsageRows, printUsageRows } from "./makeUsageRows.js";

export async function makeAscensionUsage({ servant, rl }) {
  const { collectionNo, ascensionMaterials } = servant;
  const input = await rl.question("\nCurrent/Target (default: 0/4)");
  const [currentAscension, ascensionTarget] = splitAscensionValues(
    input,
    "0/4"
  );

  // handle bad input
  if (currentAscension >= Math.min(4, ascensionTarget)) return;

  // make rows
  const rows = new Array();
  for (let stage = currentAscension; stage < ascensionTarget; stage++) {
    const { items } = ascensionMaterials[stage];
    makeUsageRows({
      collectionNo,
      items,
      subject: `Ascension ${stage} to ${stage + 1}`
    }).forEach(row => rows.push(row));
  }

  printUsageRows(rows);
}
