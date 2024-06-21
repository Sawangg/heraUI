import { existsSync } from "node:fs";
import { join } from "node:path";

export const getPackageManager = (dir: string) => {
  const lockFiles = {
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnpm-lock.yaml",
    bun: "bun.lockb",
  };

  for (const [manager, file] of Object.entries(lockFiles)) {
    if (existsSync(join(dir, file))) return manager;
  }

  return null;
};
