import { exec } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Config, createConfig } from "@utils/config";
import { error, info, success, warn } from "@utils/message";
import { getPackageManager } from "@utils/packageManager";
import chalk from "chalk";
import { Command } from "commander";
import prompts from "prompts";
import { z } from "zod";

const deps = ["react-aria-components", "tailwindcss", "tailwind-merge", "clsx"];

const optionsSchema = z.object({
  cwd: z.string().default(process.cwd),
});

export const init = new Command()
  .name("init")
  .description("configure your project for hera")
  .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd())
  .action(async (opts) => {
    const options = optionsSchema.parse(opts);

    const cwd = resolve(options.cwd);
    if (!existsSync(cwd)) {
      error(`The path ${cwd} does not exist. Exiting.`);
      process.exit(1);
    }

    // Check if there is a config already
    if (existsSync(join(cwd, "hera.json"))) {
      warn("An hera config was already found.");
      const res = await prompts({ type: "confirm", name: "override", message: "Do you want to override it?" });
      if (!res.override) {
        info("Exiting.");
        process.exit(0);
      }
      console.log("");
    }

    // Find the project package manager
    const packageManager = getPackageManager(cwd);
    if (!packageManager) {
      error(
        "Could not find a package manager to use. Are you sure you're in the root of the project you want to initialize?",
      );
      process.exit(1);
    }
    info(`Package manager found: ${chalk.green(packageManager)}`);

    const configData: Config = { directory: "" };

    // Find the destination directory
    const promptForPath = async () => {
      const res = await prompts({
        type: "text",
        name: "path",
        message: "Enter a relative path to a directory to add your components",
      });
      if (!res.path) {
        error("Incorrect path. Exiting.");
        process.exit(1);
      }
      const fullPath = join(cwd, res.path);
      if (existsSync(fullPath) && lstatSync(fullPath).isDirectory()) {
        configData.directory = res.path;
        console.log("");
      } else {
        error(`Couldn't find the destination ${fullPath}. Exiting.`);
        process.exit(1);
      }
    };

    if (existsSync(join(cwd, "src", "ui")) && lstatSync(join(cwd, "src", "ui")).isDirectory()) {
      info("Found the directory src/ui.");
      const confirm = await prompts({
        type: "confirm",
        name: "defaultDirectory",
        message: "Do you want to use it to add components?",
      });
      if (confirm.defaultDirectory) {
        configData.directory = "src/ui";
        console.log("");
      } else {
        await promptForPath();
      }
    } else {
      warn("Couldn't find a default ui directory.");
      await promptForPath();
    }

    // Create the config
    const configPrompt = await prompts({
      type: "confirm",
      name: "creation",
      message:
        "Do you want to save your configuration? If you don't you'll have to provide it manually on each component addition",
    });
    if (configPrompt.creation) {
      await createConfig(cwd, configData);
      console.log("");
      info(`Config ${chalk.cyan("hera.json")} successfully created!`);
    } else {
      console.log("");
    }

    // Install the dependencies
    info(`Installing the dependencies with ${chalk.green(packageManager)} ...`);

    try {
      await new Promise((resolve, reject) => {
        exec(`${packageManager} ${packageManager === "npm" ? "install" : "add"} ${deps.join(" ")}`, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
    } catch (e) {
      error(e as string);
      process.exit(1);
    }

    success("⚡Congrats, your project is now ready to have components added!");
  });
