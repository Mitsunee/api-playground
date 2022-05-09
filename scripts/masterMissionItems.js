import { atlasConnector } from "../utils/api/atlas/connector.js";

async function main() {
  const atlasNa = await atlasConnector("NA");
  const niceMM = await atlasNa.getExport("nice_master_mission");
  const niceItem = await atlasNa.getExport("nice_item");

  for (const masterMission of niceMM) {
    if (masterMission.id === 10001) continue;

    // find missions with item conds
    const itemMissions = masterMission.missions.filter(({ conds }) =>
      conds.some(
        ({ condType, detail }) =>
          condType === "missionConditionDetail" && detail.missionCondType === 12
      )
    );

    // render info
    for (const mission of itemMissions) {
      // display mission detail
      const colorEnd = mission.detail.indexOf("[-]");
      console.log(mission.detail.substring(colorEnd > 0 ? colorEnd + 3 : 0));

      // display list
      const itemCond = mission.conds.find(
        ({ condType, detail }) =>
          condType === "missionConditionDetail" && detail.missionCondType === 12
      );

      for (const id of itemCond.detail.targetIds) {
        const item = niceItem.find(item => item.id === id);
        console.log(`  - ${item ? item.name : `[ID:${id}]`}`);
      }
    }
  }
}

main();
