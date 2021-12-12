export function searchNiceServant(niceServant, id) {
  return niceServant.find(servant => {
    if (servant.type === "enemyCollectionDetail") return false;
    if (servant.id === id) return true;
    if (servant.collectionNo === id) return true;
    return false;
  });
}
