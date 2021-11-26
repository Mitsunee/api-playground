import { existsSync, readFileSync } from "fs";

import { resolvePath } from "./path.js";
import { die } from "./log.js";

function checkRoot() {
  if (process.cwd().includes("node_modules")) return false;

  const pkgJsonPath = resolvePath("package.json");
  if (!existsSync(pkgJsonPath)) return false;

  const pkg = readFileSync(pkgJsonPath, "utf8");
  if (JSON.parse(pkg).name === "api-playground") {
    return true;
  }
  return false;
}

export function isRoot() {
  if (!checkRoot()) {
    die("Please run from project root directory!");
  }
}
