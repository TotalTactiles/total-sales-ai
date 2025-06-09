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
  return <div className={`font-bold ${sizeClasses[size]} text-salesBlue flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-salesBlue to-salesCyan flex items-center justify-center text-white font-bold">
        S
      </div>
      <span>TSAM</span>
    </div>;
};
export default Logo;