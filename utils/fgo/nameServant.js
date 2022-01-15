import { capitalize } from "../capitalize.js";

const classNameMap = new Map([["alterEgo", "Alter Ego"]]);

export function nameServant({ servant, niceServant, niceServantNa }) {
  const servantNa = niceServantNa.find(s => s.id === servant.id);
  const servantName = servantNa?.name || servant.name;

  const nameAppears = niceServant
    .map(({ id, name }) => niceServantNa.find(s => s.id === id)?.name || name)
    .filter(name => name === servant.name).length;

  if (nameAppears < 2) return servantName;

  const className =
    classNameMap.get(servant.className) || capitalize(servant.className);

  return `${servantName} (${className})`;
}
