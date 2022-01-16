import { nameServant } from "./nameServant.js";

export function servantDescriptor(servant, niceServant = []) {
  const paddedCollectionNo = `0000${servant.collectionNo}`.slice(-3);
  const named = nameServant({ servant, niceServant });
  const descriptor = `#${paddedCollectionNo} - ${named}`;

  return descriptor;
}
