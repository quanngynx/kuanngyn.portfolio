import { HTMLAttributes } from "react";
import { cn } from "@/common/utils/ui";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60 dark:bg-muted/40",
        className,
      )}
      {...props}
    />
  );
}
