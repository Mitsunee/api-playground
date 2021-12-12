import { capitalize } from "../capitalize.js";

export function makeServantDataRow({ servant, nickname, image }) {
  const row = [
    servant.collectionNo,
    nickname,
    `=IMAGE("${image}")`,
    servant.rarity,
    capitalize(servant.className)
  ];

  return row.join("\t");
}
