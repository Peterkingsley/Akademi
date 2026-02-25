import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Since I don't have radix-ui installed, I'll implement a simple Button
// Actually, I'll just make a simple Button component without cva for now to save time/complexity
// or I can just use standard Tailwind classes in the components.
// Let's stick to simple components.

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-[#00D632] text-white hover:bg-[#00B52A] shadow-sm",
      secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
      outline: "border-2 border-[#00D632] text-[#00D632] hover:bg-[#00D632]/10",
      ghost: "hover:bg-gray-100 text-gray-700",
    }
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
    }
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-gray-100 bg-white text-gray-950 shadow-sm", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"
