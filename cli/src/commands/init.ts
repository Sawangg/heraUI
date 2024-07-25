import { exec } from "node:child_process";
import { appendFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { type Config, createConfig } from "@utils/config";
import { DEPENDENCIES } from "@utils/constant";
import { error, info, success, warn } from "@utils/message";
import { promptForPath } from "@utils/path";
import { getProject } from "@utils/project";
import chalk from "chalk";
import { Command } from "commander";
import prompts from "prompts";
import { z } from "zod";

const optionsSchema = z.object({
  cwd: z.string().default(process.cwd),
  overwrite: z.boolean().default(false),
});

export const init = new Command()
  .name("init")
  .description("configure your project for hera. Run it at the root of your project or specify a valid directory.")
  .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd())
  .option("-o, --overwrite", "overwrite existing files.", false)
  .action(async (opts) => {
    const options = optionsSchema.parse(opts);

    const cwd = resolve(options.cwd);
    if (!existsSync(cwd)) {
      error(`The path ${cwd} does not exist. Exiting.`);
      process.exit(1);
    }

    // Customize the experience according to the project structure
    const project = getProject();

    if (!project.packageManager) {
      error(
        "Could not find a package manager to use. Are you sure you're in the root of the project you want to initialize?",
      );
      process.exit(1);
    }
    info(`Package manager found: ${chalk.green(project.packageManager)}`);

    if (project.heraConf && !options.overwrite) {
      warn("An hera config was already found.");
      const res = await prompts({ type: "confirm", name: "override", message: "Do you want to override it?" });
      console.log("");
      if (!res.override) {
        info("Exiting.");
        process.exit(0);
      }
    }

    const configData: Config = { $schema: "", directory: "", utils: "" };

    // Find the destination directory
    if (project.uiDir) {
      info(`Found the directory ${project.srcDir ? "src/ui" : "ui"}.`);
      const confirm = await prompts({
        type: "confirm",
        name: "uiDir",
        message: "Do you want to use it to add components?",
      });
      if (confirm.uiDir) configData.directory = project.srcDir ? "./src/ui" : "./ui";
      console.log("");
    } else {
      warn("Couldn't find a default ui directory.");
    }
    if (!configData.directory) {
      configData.directory = await promptForPath("Enter a relative path to a directory to add your components", true);
    }

    // Find the utils file
    if (project.utilsFile) {
      info(`Found the ${project.srcDir ? "src/lib/utils.ts" : "lib/utils.ts"} file.`);
      const confirm = await prompts({
        type: "confirm",
        name: "defaultUtils",
        message: "Do you want to append our config to it?",
      });
      if (confirm.defaultUtils) {
        configData.utils = project.srcDir ? "./src/lib/utils.ts" : "./lib/utils.ts";
        console.log("");
      }
    } else {
      warn("Couldn't find the default utils file.");
    }
    if (!configData.utils) {
      const path = await promptForPath("Enter the path of a Typescript file you want to add the utils to");
      if (path.split(".").pop()?.toLowerCase() !== "ts") {
        error("The file doesn't end with the .ts extension. Exiting.");
        process.exit(1);
      }
      configData.utils = path;
    }

    // Write the utils content
    const utilsContent =
      '\nimport { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));';

    console.log(
      `${chalk.cyan(" ")} Appending to ${chalk.cyan(configData.utils)}\n ${chalk.bgRgb(28, 68, 40).bold(utilsContent.replaceAll("\n", "\n+ "))}\n`,
    );

    // TODO: Handle dupplicate code inside the file if the command is run twice
    appendFileSync(configData.utils, utilsContent);

    // Framework detection
    if (!project.framework) {
      warn("Couldn't find a supported framework. Skipping.");
    } else {
      info(`Found the supported framework ${chalk.green(project.framework)}.`);
      configData.framework = project.framework;
    }

    // Create the config
    await createConfig(cwd, configData);
    info(`Config ${chalk.cyan("hera.json")} successfully created!`);

    // Install the dependencies to the project
    info(`Installing the dependencies with ${chalk.green(project.packageManager)} ...`);

    try {
      await new Promise((resolve, reject) => {
        exec(`${project.packageManager} install ${DEPENDENCIES.join(" ")}`, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
    } catch (e) {
      error(e as string);
      process.exit(1);
    }

    success("⚡Congrats, your project is now ready to have components added to it!");
    process.exit(0);
  });
