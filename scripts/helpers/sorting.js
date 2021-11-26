const ascending = (a, b) => a - b;
const descending = (a, b) => b - a;

function sortById({ id: a }, { id: b }) {
  return ascending(a, b);
}

function sortByIdDescending({ id: a }, { id: b }) {
  return descending(a, b);
}

function sortByCollectionNo({ collectionNo: a }, { collectionNo: b }) {
  return ascending(a, b);
}

function sortByCollectionNoDescending(
  { collectionNo: a },
  { collectionNo: b }
) {
  return descending(a, b);
}

module.exports = {
  sortById,
  sortByIdDescending,
  sortByCollectionNo,
  sortByCollectionNoDescending
};
