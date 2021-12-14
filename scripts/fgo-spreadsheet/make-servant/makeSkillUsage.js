import { splitSkillValues } from "../../../utils/fgo/splitSkillValues.js";
import { makeUsageRows, printUsageRows } from "./makeUsageRows.js";

export async function makeSkillUsage({ servant, rl, append = false }) {
  const { collectionNo } = servant;
  const skillMaterials = append
    ? servant.appendSkillMaterials
    : servant.skillMaterials;
  const rows = new Array();
  const defaultStage = `1/${append ? 1 : 9}`;

  for (let num = 1; num <= 3; num++) {
    const input = await rl.question(
      `${
        num === 1 ? "\n" : ""
      }Skill ${num} Current/Target (default: ${defaultStage})`
    );
    const [currentLevel, targetLevel] = splitSkillValues(input, defaultStage);

    if (currentLevel >= Math.min(10, targetLevel)) continue;

    for (let stage = currentLevel; stage < targetLevel; stage++) {
      const { items } = skillMaterials[stage];
      makeUsageRows({
        collectionNo,
        items,
        subject: `${append ? "Append " : ""}Skill ${num} ${stage} to ${
          stage + 1
        }`
      }).forEach(row => rows.push(row));
    }
  }

  if (rows.length > 0) printUsageRows(rows);
}

// returns promise!
export function makeAppendUsage({ servant, rl }) {
  return makeSkillUsage({ servant, rl, append: true });
}
