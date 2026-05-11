import { cn } from "../utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-md bg-stone-100", className)}
      {...props}
    />
  )
}

export { Skeleton }
