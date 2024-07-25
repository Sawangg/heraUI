export const DEPENDENCIES = ["react-aria-components", "tailwindcss", "tailwind-merge", "clsx"] as const;

export enum MANAGERS {
  npm = "package-lock.json",
  yarn = "yarn.lock",
  pnpm = "pnpm-lock.yaml",
  bun = "bun.lockb",
}

export enum FRAMEWORKS {
  astro = "astro.config",
  nextjs = "next.config",
}
