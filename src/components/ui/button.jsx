import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#f6121d] to-[#c00812] text-primary-foreground shadow-[0_6px_24px_rgba(229,9,20,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] hover:from-[#ff2430] hover:to-[#d00913] hover:shadow-[0_8px_32px_rgba(229,9,20,0.45),inset_0_1px_0_rgba(255,255,255,0.22)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/15 bg-white/[0.04] text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/[0.09]",
        secondary:
          "bg-secondary text-secondary-foreground border border-white/10 hover:bg-secondary/80 hover:border-white/20",
        ghost: "hover:bg-white/[0.07] hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }