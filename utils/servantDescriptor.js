export function servantDescriptor(
  { collectionNo, name, className }, // deconstructed servant
  niceServant // optional
) {
  const paddedCollectionNo = `0000${collectionNo}`.slice(-3);

  /* determine if we need to show the class
   * - either we have a niceServant and can check if there are more servants of the same name
   * - or not, so we just assume true
   */
  const showClass =
    niceServant instanceof Array
      ? niceServant.filter(s => s.name === name).length > 1
      : true; // assume true if nothing (or something invalid) was passed

  // capitalize className prop
  const capitalizedClass = className.replace(/^\w/, c => c.toUpperCase());

  // build constructor
  const descriptor = `#${paddedCollectionNo} - ${name}${
    showClass ? ` (${capitalizedClass})` : ""
  }`;

  return descriptor;
}
