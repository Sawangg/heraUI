# @hera/cli

A CLI to install your HeraUI components easily.

## Usage

You can run the CLI with your favorite package manager. Use init to configure your project for Hera
```sh
npx @hera/cli init
bunx @hera/cli init
```

### add
You can use the `add` command to add any of Hera's components to your project.
```sh
npx @hera/cli add [component]
bunx @hera/cli add [component]
```

## Development

You need [bun](https://bun.sh/) installed on your machine. After cloning the repo, you need to link the package to be able to run the CLI.
```sh
bun run build
bun link
bun link @hera/cli
hera add [component]
```

You can then invoke and modify any command from the CLI.
