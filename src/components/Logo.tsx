import React from 'react';
import { cn } from '@/lib/utils';
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
  return (
    <span className={cn('font-bold text-primary', sizeClasses[size], className)}>
      SalesOS
    </span>
  );
};
export default Logo;
