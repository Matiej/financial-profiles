import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
};

export default function Button({ variant = "primary", size = "md", className = "", ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
  }[size];

  // Brand: granat + złoto
  const variants = {
    primary:
      "bg-[#0f1e3a] text-white ring-[#d4af37] hover:bg-[#0b172d] shadow-sm border border-[#d4af37]/70",
    secondary:
      "bg-white text-[#0f1e3a] ring-[#d4af37] hover:bg-zinc-50 border border-[#d4af37]/60",
  }[variant];

  return <button className={`${base} ${sizes} ${variants} ${className}`} {...rest} />;
}