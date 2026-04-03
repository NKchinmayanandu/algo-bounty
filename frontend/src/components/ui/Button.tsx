import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "ghost-sakura";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary:
    "bg-gradient-to-r from-sakura-400 to-violet-500 text-white shadow-lg shadow-sakura-400/20 hover:shadow-sakura-400/30",
  secondary:
    "bg-surface-800 text-text-primary border border-border-subtle hover:bg-surface-700 hover:border-border-default",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-800",
  "ghost-sakura":
    "bg-transparent text-sakura-400 hover:text-sakura-300 hover:bg-sakura-400/10",
  outline:
    "bg-transparent border border-sakura-400/30 text-sakura-300 hover:bg-sakura-400/10 hover:border-sakura-400/50",
};

const sizes = {
  sm: "px-4 py-2 text-xs rounded-lg h-9",
  md: "px-6 py-3 text-sm rounded-xl h-11",
  lg: "px-8 py-4 text-base rounded-2xl h-14",
  icon: "p-2 rounded-lg w-10 h-10",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        inline-flex items-center justify-center gap-2.5 font-semibold
        transition-all duration-200 cursor-pointer whitespace-nowrap
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
