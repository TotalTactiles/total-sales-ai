
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

interface NorthStarGoalProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

const NorthStarGoal: React.FC<NorthStarGoalProps> = ({
  value,
  onChange,
  label,
  placeholder
}) => {
  const [isActive, setIsActive] = useState(false);

  // Check if goal has meaningful content
  useEffect(() => {
    setIsActive(value.trim().length >= 20);
  }, [value]);

  return (
    <div className="space-y-4">
      <Label htmlFor="goal" className="text-base font-medium">{label}</Label>
      
      <div className="relative">
        <Textarea
          id="goal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-32 transition-all duration-300 z-10 relative bg-background"
        />
        
        {/* North Star Compass Animation */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
          <motion.div
            className="w-8 h-8"
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{ 
              opacity: isActive ? 1 : 0.4,
              scale: isActive ? 1.1 : 0.9,
            }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M12 2L12 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ 
                  rotate: isActive ? [0, 5, -5, 0] : 0 
                }}
                transition={{ 
                  duration: 1, 
                  repeat: isActive ? Infinity : 0, 
                  repeatDelay: 3 
                }}
              />
              <motion.path
                d="M2 12L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ 
                  rotate: isActive ? [0, -5, 5, 0] : 0 
                }}
                transition={{ 
                  duration: 1, 
                  repeat: isActive ? Infinity : 0, 
                  repeatDelay: 3,
                  delay: 0.5
                }}
              />
              <motion.circle
                cx="12"
                cy="12"
                r="4"
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                animate={{ 
                  scale: isActive ? [1, 1.2, 1] : 1,
                  opacity: isActive ? [0.7, 1, 0.7] : 0.7
                }}
                transition={{ 
                  duration: 2, 
                  repeat: isActive ? Infinity : 0,
                  repeatDelay: 1
                }}
              />
            </svg>
          </motion.div>
        </div>
        
        {/* Background glow effect when active */}
        {isActive && (
          <motion.div 
            className="absolute inset-0 bg-primary/5 rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        {!isActive 
          ? "Define a clear goal to activate your North Star compass" 
          : "Your North Star is guiding your SalesOS journey"
        }
      </p>
    </div>
  );
};

export default NorthStarGoal;
