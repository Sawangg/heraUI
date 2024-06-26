import { cn } from "./primitives/utils";

export type SkeletonProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <span
    className={cn(className, "animate-pulse bg-zinc-300")}
    role="status"
    aria-live="polite"
    aria-busy="true"
    {...props}
  />
);
