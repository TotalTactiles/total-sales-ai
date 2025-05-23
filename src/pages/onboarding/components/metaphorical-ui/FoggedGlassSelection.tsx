
import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FoggedGlassOption {
  id: string;
  label: string;
  description: string;
}

interface FoggedGlassSelectionProps {
  options: FoggedGlassOption[];
  selectedOptions: string[];
  onChange: (id: string) => void;
  label: string;
}

const FoggedGlassSelection: React.FC<FoggedGlassSelectionProps> = ({
  options,
  selectedOptions,
  onChange,
  label
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{label}</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          
          return (
            <motion.div 
              key={option.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer relative overflow-hidden transition-all duration-300",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border"
              )}
              onClick={() => onChange(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Fogged glass effect that reveals on selection */}
              <motion.div 
                className="absolute inset-0 backdrop-blur-md bg-white/30 dark:bg-black/30"
                initial={{ opacity: 1 }}
                animate={{ opacity: isSelected ? 0 : 0.6 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Fog particles effect */}
              {!isSelected && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="absolute w-16 h-16 rounded-full bg-white/20 dark:bg-white/5"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        x: [0, Math.random() * 30 - 15],
                        y: [0, Math.random() * 30 - 15],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-start gap-3 relative z-10">
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={() => onChange(option.id)}
                  id={`option-${option.id}`}
                  className="mt-1"
                />
                <div>
                  <Label 
                    htmlFor={`option-${option.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FoggedGlassSelection;
