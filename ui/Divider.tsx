import { cn } from "./primitives/utils.ts";

export type DividerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement> & {
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ className, vertical = false, ...props }) => (
  <hr
    className={cn(vertical ? "h-full" : "w-full", "border border-zinc-950/10 dark:border-white/[0.2]", className)}
    role="presentation"
    {...props}
  />
);

