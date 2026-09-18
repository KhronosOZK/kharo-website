import * as React from "react"

import { cn } from "@/lib/utils"

// 16px on every device so iOS never zooms in on focus; 12px radius; green ring.
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "field flex h-12 w-full rounded-lg border border-line-strong bg-surface px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-none focus-visible:border-green focus-visible:ring-[3px] focus-visible:ring-green/20 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
