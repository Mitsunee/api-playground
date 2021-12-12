import { die } from "../utils/log.js";
die("Script not ported to new API utils");
/// NOT PORTED TO NEW API UTILS

const niceServant = require("../cache/atlas_jp/nice_servant_lang_en");
const { servantDescriptor } = require("./helpers/servantDescriptor");
const { sortByCollectionNo } = require("./helpers/sorting");

findChargeFunc = ({ funcTargetTeam, funcType, funcTargetType, svals }) =>
  funcTargetTeam === "player" &&
  funcType === "gainNp" &&
  (funcTargetType === "ptOne" || funcTargetType === "ptAll") &&
  svals[9].Value >= 2000;

const chargeServants = niceServant
  .filter(({ skills }) =>
    skills.some(({ functions }) => functions.some(findChargeFunc))
  )
  .sort(sortByCollectionNo);

chargeServants.forEach(servant => {
  const skill = servant.skills.find(skill =>
    skill.functions.some(findChargeFunc)
  );

  console.log(
    servantDescriptor(servant, niceServant) + ` - #${skill.num} - ${skill.name}`
  );
});
