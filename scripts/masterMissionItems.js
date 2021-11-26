const niceItem = require("../cache/atlas_na/nice_item");
const niceMM = require("../cache/atlas_na/nice_master_mission");

for (let masterMission of niceMM) {
  if (masterMission.id === 10001) continue;

  // find missions with item conds
  const itemMissions = masterMission.missions.filter(({ conds }) =>
    conds.some(
      ({ condType, detail }) =>
        condType === "missionConditionDetail" && detail.missionCondType === 12
    )
  );

  // render info
  for (mission of itemMissions) {
    // display mission detail
    const colorEnd = mission.detail.indexOf("[-]");
    console.log(mission.detail.substring(colorEnd > 0 ? colorEnd + 3 : 0));

    // display list
    mission.conds
      .find(
        ({ condType, detail }) =>
          condType === "missionConditionDetail" && detail.missionCondType === 12
      )
      .detail.targetIds.forEach(id => {
        const item = niceItem.find(item => item.id === id);
        console.log(`  - ${item ? item.name : `[ID:${id}]`}`);
      });
  }
}
