import { existsSync, lstatSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";

export const projectSchema = z.object({
  srcDir: z.boolean(),
  uiDir: z.boolean(),
  utilsFile: z.boolean(),
  heraConf: z.boolean(),
  packageManager: z.enum(["npm", "yarn", "pnpm", "bun"]).nullable(),
});

export type Project = z.infer<typeof projectSchema>;

export const getProject = (): Project => {
  const srcDir = existsSync(resolve("./src")) && lstatSync(resolve("./src")).isDirectory();
  return {
    srcDir,
    uiDir: srcDir
      ? existsSync(resolve("./src/ui")) && lstatSync(resolve("./src/ui")).isDirectory()
      : existsSync("ui") && lstatSync(resolve("ui")).isDirectory(),
    utilsFile: srcDir ? existsSync(resolve("./src/lib/utils.ts")) : existsSync(resolve("./lib/utils.ts")),
    heraConf: existsSync(join("hera.json")),
    packageManager: getPackageManager(),
  };
};

const getPackageManager = () => {
  const lockFiles: { [key: string]: string } = {
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnpm-lock.yaml",
    bun: "bun.lockb",
  };

  for (const [manager, file] of Object.entries(lockFiles)) {
    if (existsSync(join(file))) return manager as "npm" | "yarn" | "pnpm" | "bun";
  }

  return null;
};
