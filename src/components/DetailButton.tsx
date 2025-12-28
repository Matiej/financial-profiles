import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-mist";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
  }[size];
 
  const variants = {
    primary:
      "bg-brand-ink text-white hover:bg-brand-berry shadow-sm border border-brand-mist/70",
    secondary:
      "bg-white text-brand-ink hover:bg-brand-cloud border border-brand-mist/70",
  }[variant];

  return (
    <button className={`${base} ${sizes} ${variants} ${className}`} {...rest} />
  );
}
