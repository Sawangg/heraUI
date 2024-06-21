import chalk from "chalk";

const errorColor = chalk.hex("#dc2626");
export const error = (message: string) => console.log(chalk.bold(errorColor(`× ${message}\n`)));

const warningColor = chalk.hex("#FFA500");
export const warn = (message: string) => console.log(chalk.bold(warningColor(`! ${message}\n`)));

const infoColor = chalk.hex("#BAC2DD");
export const info = (message: string) => console.log(chalk.bold(infoColor(`${message}\n`)));

export const success = (message: string) => console.log(chalk.bold(chalk.green(message)));
