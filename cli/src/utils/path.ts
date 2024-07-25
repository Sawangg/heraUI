import { existsSync, lstatSync } from "node:fs";
import { join } from "node:path";
import { error } from "@utils/message";
import prompts from "prompts";

/**
 * Prompt the user for a relative path
 * @param message - The message you want to show up in the prompt
 * @param [directory=false] - Check if the path should be a directory, by default checks if it's a valid file
 * @returns The relative path the user entered
 */
export const promptForPath = async (message: string, directory = false): Promise<string> => {
  const prompt = await prompts({
    type: "text",
    name: "path",
    message,
  });
  if (!prompt.path) {
    error("Incorrect path. Exiting.");
    process.exit(1);
  }
  const fullPath = join(prompt.path);
  if (existsSync(fullPath) && (directory ? lstatSync(fullPath).isDirectory() : lstatSync(fullPath).isFile())) {
    console.log("");
    return `./${prompt.path}`;
  }
  error(`Couldn't find the destination ${fullPath}. Exiting.`);
  process.exit(1);
};
