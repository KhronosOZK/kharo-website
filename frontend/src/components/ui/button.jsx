import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

// Kharo buttons: pills, press feedback, one accent. Hover is colour only.
const buttonVariants = cva(
  "pressable inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-bone disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-green text-ink hover:bg-green-hover",
        outline: "border border-line-strong bg-surface text-ink hover:bg-surface-2",
        secondary: "bg-surface-2 text-ink hover:bg-[#E6E6DF]",
        ghost: "text-ink hover:bg-surface-2",
        dark: "bg-ink text-white hover:bg-[#1B2A22]",
        onDark: "bg-white text-ink hover:bg-[#EDEDE8]",
        onDarkOutline: "border border-white/35 text-white hover:bg-white/10",
        link: "text-green underline-offset-4 hover:underline rounded-none",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-5 text-[14.5px]",
        sm: "h-9 px-4 text-[13.5px]",
        lg: "h-12 px-6 text-[15.5px]",
        icon: "h-11 w-11",
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
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
