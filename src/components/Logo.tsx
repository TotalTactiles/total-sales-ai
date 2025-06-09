import React from 'react';
interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
const Logo = ({
  size = "md",
  className = ""
}: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };
  return;
};
export default Logo;