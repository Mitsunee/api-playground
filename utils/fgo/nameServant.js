import { capitalize } from "../capitalize.js";

const classNameMap = new Map([["alterEgo", "Alter Ego"]]);

export function nameServant({
  servant,
  niceServant = [],
  niceServantNa = [],
  force = false
}) {
  const servantNa = niceServantNa?.find(s => s.id === servant.id);
  const servantName = servantNa?.name || servant.name;
  const isForced = force || niceServant.length < 1;

  const nameAppears = niceServant
    .map(({ id, name }) => niceServantNa?.find(s => s.id === id)?.name || name)
    .filter(name => name === servant.name).length;

  if (nameAppears < 2 && !isForced) return servantName;

  const className =
    classNameMap.get(servant.className) || capitalize(servant.className);

  return `${servantName} (${className})`;
}
