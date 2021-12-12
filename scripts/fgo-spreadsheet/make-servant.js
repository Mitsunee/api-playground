import { readline } from "../../utils/readline.js";
import { atlasConnector } from "../../utils/api/atlas/connector.js";
import { splitSkillValues } from "../../utils/fgo/splitSkillValues.js";

const { servantDescriptor } = require("../helpers/servantDescriptor");
const { makeMaterialRows } = require("./helpers/makeMaterialRows");
const { makeServantRow } = require("./helpers/makeServantRow");

// process input

async function main() {
  const rl = readline();
  const atlasJp = await atlasConnector("JP");
  const niceServant = await atlasJp.getExport("nice_servant_lang_en");
  let input;

  // Servant ID
  input = await rl.question("Servant ID or Collection Number");
  const requestedServant = Number(input);
  const servant = niceServant.find(
    ({ id, collectionNo }) =>
      id === +requestedServant || collectionNo === +requestedServant
  );

  // error handle
  if (!servant) {
    console.log(`Could not find servant ${requestedServant}`);
    return 1;
  }

  // Nickname
  const nickname = await rl.question("Servant Nickname");

  // output confirmation
  console.log(
    {
      requestedServant,
      nickname,
      servant: servantDescriptor(servant, niceServant)
    },
    "\n"
  );

  // Ascension
  input = await rl.question("Ascension (default: 0/4)");
  const [ascension, ascensionTarget] = splitSkillValues(
    input,
    "0/4",
    /[0-4]\/[0-4]/
  );

  // Skills
  const skills = {};
  const skillTarget = {};

  // skill 1
  input = await rl.question("Skill 1 (default: 1/10)");
  input = splitSkillValues(input, "1/10", /(10|[1-9])\/(10|[1-9])/);
  skills[1] = input[0];
  skillTarget[1] = input[1];

  // skill 2
  input = await rl.question("Skill 2 (default: 1/10)");
  input = splitSkillValues(input, "1/10", /(10|[1-9])\/(10|[1-9])/);
  skills[2] = input[0];
  skillTarget[2] = input[1];

  // skill 3
  input = await rl.question("Skill 3 (default: 1/10)");
  input = splitSkillValues(input, "1/10", /(10|[1-9])\/(10|[1-9])/);
  skills[3] = input[0];
  skillTarget[3] = input[1];

  // Append Skills
  const appends = {};
  const appendTarget = {};

  // skill 1
  input = await rl.question("Append Skill 1 (default: 1/1)");
  input = splitSkillValues(input, "1/1", /(10|[1-9])\/(10|[1-9])/);
  appends[1] = input[0];
  appendTarget[1] = input[1];

  // skill 2
  input = await rl.question("Append Skill 2 (default: 1/1)");
  input = splitSkillValues(input, "1/1", /(10|[1-9])\/(10|[1-9])/);
  appends[2] = input[0];
  appendTarget[2] = input[1];

  // skill 2
  input = await rl.question("Append Skill 3 (default: 1/1)");
  input = splitSkillValues(input, "1/1", /(10|[1-9])\/(10|[1-9])/);
  appends[3] = input[0];
  appendTarget[3] = input[1];

  // Output servant
  console.log("\n", makeServantRow(servant, nickname), "\n");

  // output ascension materials
  for (const ascensionIdx in servant.ascensionMaterials) {
    const ascStage = +ascensionIdx + 1;
    if (ascStage <= ascension || ascStage > ascensionTarget) continue;

    const materialRows = makeMaterialRows(
      servant.ascensionMaterials[ascensionIdx],
      servant,
      nickname,
      `Ascension ${ascStage}`
    );
    console.log(materialRows);
  }

  // output skill materials
  for (let skillNo = 1; skillNo < 4; skillNo++) {
    for (const skillIdx in servant.skillMaterials) {
      const skillStage = +skillIdx + 1;

      if (skillStage <= skills[skillNo] || skillStage > skillTarget[skillNo])
        continue;

      const skillRows = makeMaterialRows(
        servant.skillMaterials[skillIdx],
        servant,
        nickname,
        `Skill ${skillNo} to Lv. ${skillStage}`
      );
      console.log(skillRows);
    }
  }

  // output append skill materials
  for (let skillNo = 1; skillNo < 4; skillNo++) {
    for (const skillIdx in servant.appendSkillMaterials) {
      const skillStage = +skillIdx + 1;

      if (skillStage <= appends[skillNo] || skillStage > appendTarget[skillNo])
        continue;

      const appendRows = makeMaterialRows(
        servant.appendSkillMaterials[skillIdx],
        servant,
        nickname,
        `Append Skill ${skillNo} to Lv. ${skillStage}`
      );
      console.log(appendRows);
    }
  }
}

main()
  .then(err => process.exit(err ?? 0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
