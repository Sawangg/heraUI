import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { error } from "@utils/message";
import { z } from "zod";

const configScheme = z.object({
  $schema: z.string().optional(),
  directory: z.string(),
});

export type Config = z.infer<typeof configScheme>;

export const createConfig = async (path: string, data: Config) => {
  return writeFile(join(path, "hera.json"), JSON.stringify(data, null, 2));
};

export const getConfig = async (path: string): Promise<Config | null> => {
  try {
    const fullPath = join(path, "hera.json");
    if (!existsSync(fullPath)) return null;
    const data = await readFile(join(path));
    return configScheme.parse(data);
  } catch {
    error("Invalid configuration found. Exiting.");
    process.exit(1);
  }
};
