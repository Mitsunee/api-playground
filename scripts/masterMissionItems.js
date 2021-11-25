const niceItem = require("../cache/atlas_na/nice_item");
const niceMM = require("../cache/atlas_na/nice_master_mission");

/*** EDIT THIS LINE ***/
masterMissionId = 200077;

const masterMission = niceMM.find(({ id }) => id === masterMissionId);

if (!masterMission) {
  console.log("could not find mission ID " + masterMissionId);
  process.exit(1);
}

const itemMissions = masterMission.missions.filter(({ conds }) =>
  conds.some(
    ({ condType, detail }) =>
      condType === "missionConditionDetail" && detail.missionCondType === 12
  )
);
itemMissions.forEach(mission => {
  console.log(mission.detail.substring(mission.detail.indexOf("[-]") + 3));
  mission.conds
    .find(
      ({ condType, detail }) =>
        condType === "missionConditionDetail" && detail.missionCondType === 12
    )
    .detail.targetIds.forEach(id => {
      const item = niceItem.find(item => item.id === id);
      console.log(`  - ${item ? item.name : `[ID:${id}]`}`);
    });
  console.log("");
});
