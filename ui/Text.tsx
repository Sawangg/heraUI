import { cn } from "./primitives/utils.ts";

export type TextProps = React.DetailedHTMLProps<
  React.ParamHTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> & {
  as?: string;
};

export const Text: React.FC<TextProps> = ({ as, className, children, ...props }) => (
  <p
    className={cn("dark:text-zinc-400 text-base/6 text-zinc-500 data-[disabled]:opacity-50", className)}
    data-slot={as === "description" ? "description" : "text"}
    {...props}
  >
    {children}
  </p>
);

export const Strong: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  className,
  children,
  ...props
}) => (
  <strong className={cn("dark:text-white font-medium text-zinc-950", className)} {...props}>
    {children}
  </strong>
);

export type TextLinkProps = Omit<
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "ref"
> & {
  href: string;
  newTab?: boolean;
};

// Replace with custom Link component if you're using NextJS
export const TextLink: React.FC<TextLinkProps> = ({ href, newTab = true, className, children, ...props }) => (
  <a
    className={cn(
      "dark:text-white dark:decoration-white/50 dark:hover:decoration-white text-zinc-950 underline decoration-zinc-950/50 outline-none hover:decoration-zinc-950 focus:ring-2 focus:ring-blue-500",
      className,
    )}
    href={href}
    target={newTab ? "_blank" : undefined}
    rel={newTab ? "noopener noreferrer" : undefined}
    {...props}
  >
    {children}
  </a>
);

export const Code: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  className,
  children,
  ...props
}) => (
  <code
    className={cn(
      "rounded bg-zinc-950/[2.5%] px-0.5 text-sm font-medium text-zinc-950 sm:text-[0.8125rem]",
      "dark:bg-white/5 dark:text-white",
      "border border-zinc-950/10 dark:border-white/20",
      className,
    )}
    {...props}
  >
    {children}
  </code>
);
