import { existsSync, lstatSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { getConfig } from "@utils/config";
import { error, info, success, warn } from "@utils/message";
import { getRegistry } from "@utils/registry";
import { Command } from "commander";
import prompts from "prompts";
import { z } from "zod";

const optionsSchema = z.object({
  components: z.array(z.string()).optional(),
  all: z.boolean().default(false),
  cwd: z.string().default(process.cwd),
});

export const add = new Command()
  .name("add")
  .description("add components to your project")
  .argument("[components...]", "the components to add")
  .option("-a, --all", "add all available components", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd())
  .action(async (components, opts) => {
    const options = optionsSchema.parse({
      components,
      ...opts,
    });

    const cwd = resolve(options.cwd);
    if (!existsSync(cwd)) {
      error(`The path ${cwd} does not exist. Exiting.`);
      process.exit(1);
    }

    // Get install location
    const config = await getConfig(cwd);
    let targetDir: string;

    if (!config) {
      warn("The default config was not found. Did you run the init command?");
      const prompt = await prompts({
        type: "text",
        name: "path",
        message: "Enter a valid path to install your components",
      });
      console.log("");
      targetDir = join(cwd, prompt.path);
    } else {
      targetDir = join(cwd, config.directory);
    }

    if (!existsSync(targetDir) || !lstatSync(targetDir).isDirectory()) {
      error(`The path ${targetDir} is not valid to install components. Exiting.`);
      process.exit(1);
    }

    const registry = await getRegistry();

    const selectedComponents = options.all ? registry.map((entry) => entry.name) : options.components;

    if (!selectedComponents?.length) {
      warn("No components selected. Exiting.");
      process.exit(0);
    }

    const fullPath = resolve(targetDir, ".tsx");
    await writeFile(fullPath, "content");

    success("⚡Components successfully installed!");
  });
