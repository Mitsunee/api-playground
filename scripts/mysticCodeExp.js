import { atlasConnector } from "../utils/api/atlas/connector.js";
import picocolors from "picocolors";

const { yellow, cyan } = picocolors;

async function main() {
  const atlasJP = await atlasConnector("JP");
  const mysticCodes = await atlasJP.getExport("nice_mystic_code_lang_en");

  mysticCodes.forEach(mc =>
    console.log(
      `${yellow(mc.name)}: ${cyan(
        mc.expRequired[mc.expRequired.length - 1].toLocaleString()
      )} Exp total for Level ${cyan(mc.maxLv)}`
    )
  );

  console.log(
    `\nAll non-main Mystic codes added up take ${cyan(
      mysticCodes
        .reduce(
          (total, mc) =>
            mc.name.startsWith("Mystic Code: ")
              ? total
              : total + mc.expRequired[mc.expRequired.length - 1],
          0
        )
        .toLocaleString()
    )} Exp total for Level 10`
  );
}

main();
