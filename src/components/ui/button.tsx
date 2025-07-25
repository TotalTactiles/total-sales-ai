

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline: "border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300",
        secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-slate-600 underline-offset-4 hover:underline hover:text-slate-900",
      },
      size: {
        default: "h-7 px-2.5 py-1", /* Reduced from h-8 px-3 py-1.5 */
        sm: "h-6 rounded px-2 text-xs", /* Reduced from h-7 px-2.5 */
        lg: "h-8 rounded px-3.5", /* Reduced from h-9 px-4 */
        icon: "h-7 w-7", /* Reduced from h-8 w-8 */
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

