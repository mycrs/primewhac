
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#0a0a0a]/60", className)}
      {...props}
    />
  )
}

export { Skeleton }
