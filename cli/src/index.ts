#!/usr/bin/env node

import { add } from "@commands/add";
import { init } from "@commands/init";
import { Command } from "commander";
import packageJson from "../package.json";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command();

program
  .name("hera")
  .description(packageJson.description)
  .version(packageJson.version, "-v, --version", "display the version number");

program.addCommand(init).addCommand(add);

program.parse(process.argv);
