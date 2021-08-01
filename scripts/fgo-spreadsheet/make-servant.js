const niceServant = require("../../cache/atlas_jp/nice_servant_lang_en");
const { servantDescriptor } = require("../helpers/servantDescriptor");
const { makeMaterialRows } = require("./helpers/makeMaterialRows");
const { makeServantRow } = require("./helpers/makeServantRow");

// validate input
if (!process.argv[2] || !process.argv[3]) {
  console.log("Must enter servant id or collectionNo and nickname");
  process.exit(1);
}

// process input
const [, , requestedServant, nickname, ...levelsInput] = process.argv;
const servant = niceServant.find(
  ({ id, collectionNo }) =>
    id === +requestedServant || collectionNo === +requestedServant
);

// process input (levels)
const asc = levelsInput[0] ?? 0;
const ascTarget = levelsInput[1] ?? 4;
const skill = [, levelsInput[2] ?? 1, levelsInput[4] ?? 1, levelsInput[6] ?? 1];
const skillTarget = [
  ,
  levelsInput[3] ?? 10,
  levelsInput[5] ?? 10,
  levelsInput[7] ?? 10
];

// error handle
if (!servant) {
  console.log("Could not find servant " + requestedServant);
  process.exit(1);
}

// output confirmation
console.log(
  {
    requestedServant,
    nickname,
    servant: servantDescriptor(servant, niceServant)
  },
  "\n"
);

// output servant
console.log(makeServantRow(servant, nickname), "\n");

// output ascension materials
for (let ascensionIdx in servant.ascensionMaterials) {
  const ascStage = +ascensionIdx + 1;
  if (ascStage <= asc || ascStage > ascTarget) continue;

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
  for (let skillIdx in servant.skillMaterials) {
    const skillStage = +skillIdx + 1;

    if (skillStage <= skill[skillNo] || skillStage > skillTarget[skillNo])
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
