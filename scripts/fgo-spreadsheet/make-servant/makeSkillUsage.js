import { splitSkillValues } from "../../../utils/fgo/splitSkillValues.js";
import { makeUsageRows, printUsageRows } from "./makeUsageRows.js";

export async function makeSkillUsage({ servant, rl, append = false }) {
  const { collectionNo } = servant;
  const skillMaterials = append
    ? servant.appendSkillMaterials
    : servant.skillMaterials;
  const rows = new Array();
  let input;

  input = await rl.question("Current Skill Levels (default: 1/1/1)");
  const currentLevels = splitSkillValues(input, "1/1/1");
  const targetDefaults = append ? currentLevels.join("/") : "9/9/9";
  input = await rl.question(`Target Skill Levels (default: ${targetDefaults})`);
  const targetLevels = splitSkillValues(input, targetDefaults);

  for (let num = 1; num <= 3; num++) {
    const currentLevel = currentLevels[num - 1];
    const targetLevel = targetLevels[num - 1];

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
