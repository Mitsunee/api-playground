// so apparently Object.is doesn't deepcompare, so I had to write this lol

export function deepEqual(objA, objB) {
  // compare variable type
  if (typeof objA !== typeof objB) return false;

  // compare strict equality
  if (objA === objB) return true;
  if (typeof objA !== "object") return false;

  // deep compare objects
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => {
    return deepEqual(objA[key], objB[key]);
  });
}
