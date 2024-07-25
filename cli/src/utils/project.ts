import { existsSync, lstatSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { FRAMEWORKS, MANAGERS } from "@utils/constant";

export const projectSchema = z.object({
  srcDir: z.boolean(),
  uiDir: z.boolean(),
  utilsFile: z.boolean(),
  heraConf: z.boolean(),
  packageManager: z.enum(Object.keys(MANAGERS) as [keyof typeof MANAGERS]).nullable(),
  framework: z.enum(Object.keys(FRAMEWORKS) as [keyof typeof FRAMEWORKS]).optional(),
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
    heraConf: existsSync(resolve("hera.json")),
    packageManager: getPackageManager(),
    framework: getFramework(),
  };
};

const getPackageManager = () => {
  for (const manager in MANAGERS) {
    const key = manager as keyof typeof MANAGERS;
    if (existsSync(resolve(MANAGERS[key]))) return key;
  }
  return null;
};

const getFramework = () => {
  const extensions = [".js", ".mjs", ".cjs", "ts"];
  for (const framework in FRAMEWORKS) {
    const key = framework as keyof typeof FRAMEWORKS;
    for (const ext of extensions) {
      const fileName = `${FRAMEWORKS[key]}${ext}`;
      if (existsSync(resolve(fileName))) {
        return key;
      }
    }
  }
};
