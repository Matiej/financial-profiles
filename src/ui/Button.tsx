import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-mist";

  const sizes: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-6 py-2.5",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-brand-ink text-white border border-brand-mist/70 shadow-sm " +
      "hover:bg-brand-berry " +
      "disabled:opacity-60 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-brand-ink border border-brand-mist/70 shadow-sm " +
      "hover:bg-brand-cloud " +
      "disabled:opacity-60 disabled:cursor-not-allowed",
    outline:
      "bg-white text-brand-ink border border-brand-mist/70 " +
      "hover:bg-brand-cloud " +
      "disabled:opacity-60 disabled:cursor-not-allowed",
    danger:
      "bg-red-50 text-red-700 border border-red-200 shadow-sm " +
      "hover:bg-red-100 " +
      "disabled:opacity-60 disabled:cursor-not-allowed",
    ghost:
      "text-brand-ink " +
      "hover:bg-brand-cloud " +
      "disabled:opacity-60 disabled:cursor-not-allowed",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}
