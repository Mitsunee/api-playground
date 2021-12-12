const ascending = (a, b) => a - b;
const descending = (a, b) => b - a;

export function sortById({ id: a }, { id: b }) {
  return ascending(a, b);
}

export function sortByIdDescending({ id: a }, { id: b }) {
  return descending(a, b);
}

export function sortByCollectionNo({ collectionNo: a }, { collectionNo: b }) {
  return ascending(a, b);
}

export function sortByCollectionNoDescending(
  { collectionNo: a },
  { collectionNo: b }
) {
  return descending(a, b);
}
