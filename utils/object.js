// so apparently Object.is doesn't deepcompare, so I had to write this lol

function areEqual(objA, objB) {
  // different variable types
  if (typeof objA !== typeof objB) return false;

  // same non-object types
  if (typeof objA !== "object") return objA === objB;

  // deep compare objects
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // different amount of keys
  if (keysA.length !== keysB.length) return false;

  // different values (or keys don't match)
  if (!keysA.every(key => keysB.includes(key) && objA[key] === objB[key]))
    return false;

  return true;
}

module.exports = { areEqual };
