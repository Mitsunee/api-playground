function makeServantRow(servant, nickname) {
  const row = [
    nickname,
    `=IMAGE("${servant.extraAssets.faces.ascension[1]}")`,
    `${servant.rarity}⭐ ${servant.className.replace(/^[a-z]/i, c =>
      c.toUpperCase()
    )}`
  ];

  return row.join("\t");
}

module.exports = { makeServantRow };
