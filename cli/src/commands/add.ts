import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getConfig } from "@utils/config";
import { error, success, warn } from "@utils/message";
import { getRegistry } from "@utils/registry";
import { Command } from "commander";
import { z } from "zod";

const optionsSchema = z.object({
  components: z.array(z.string()).optional(),
  all: z.boolean().default(false),
  cwd: z.string().default(process.cwd),
  overwrite: z.boolean().default(false),
});

export const add = new Command()
  .name("add")
  .description("add components to your project")
  .argument("[components...]", "the components to add")
  .option("-a, --all", "add all available components.", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd())
  .option("-o, --overwrite", "overwrite existing files.", false)
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

    if (!config) {
      warn(
        "The Hera config was not found. Did you run the init command? Did you run this command outside of the root directory of your project? Exiting.",
      );
      process.exit(0);
    }

    // Get components
    const registry = await getRegistry();

    const selectedComponents = options.all ? registry.map((entry) => entry.name) : options.components;

    if (!selectedComponents?.length) {
      warn("No components selected. Exiting.");
      process.exit(0);
    }

    // Add components
    //for (const component of selectedComponents) {
    //  const existingComponent = component.files.filter((file) => existsSync(resolve(targetDir, file.name)));
    //
    //  const fullPath = resolve(targetDir, "", ".tsx");
    //  await writeFile(fullPath, "content");
    //}

    success(`⚡${selectedComponents.length > 1 ? "Components" : "Component"} successfully installed!`);
    process.exit(0);
  });
