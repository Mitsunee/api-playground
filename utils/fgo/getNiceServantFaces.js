export function getNiceServantFaces(servant) {
  const faces = new Array();

  for (const category in servant.extraAssets.faces) {
    for (const key in servant.extraAssets.faces[category]) {
      faces.push([
        `${category}-${key}`,
        servant.extraAssets.faces[category][key]
      ]);
    }
  }

  return faces;
}
