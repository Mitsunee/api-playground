import { die } from "@foxkit/node-util/log";
import { latinize } from "modern-diacritics";

import { atlasConnector } from "../utils/api/atlas/connector.js";
import { servantDescriptor } from "../utils/fgo/servantDescriptor.js";

const opts = {
  lowerCase: true,
  forceSingleSpace: true
};

class Matcher {
  constructor(arg) {
    this.arg = latinize(arg, opts);
  }

  match(subject) {
    return latinize(subject, opts).includes(this.arg);
  }
}

async function main(args) {
  if (args.length < 1) die("Please provide at least one argument");

  const atlasJp = await atlasConnector("Jp");
  const niceServant = await atlasJp.getExport("nice_servant_lang_en");

  const results = new Set();

  for (const arg of args) {
    const matcher = new Matcher(arg);
    niceServant
      .filter(
        servant =>
          matcher.match(servant.name) ||
          Object.values(servant.ascensionAdd.overWriteServantName)
            .flatMap(val => Object.values(val))
            .some(name => matcher.match(name))
      )
      .forEach(servant => results.add(servant));
  }

  for (const result of results) {
    console.log(servantDescriptor(result));
  }
}

const [, , ...args] = process.argv;
main(args);
