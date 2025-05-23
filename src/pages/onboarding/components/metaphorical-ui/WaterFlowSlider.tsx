
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface WaterFlowSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
}

const WaterFlowSlider: React.FC<WaterFlowSliderProps> = ({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  leftLabel = 'Gentle',
  rightLabel = 'Intense',
}) => {
  // Determine wave intensity based on value
  const waveIntensity = Math.round((value - min) / (max - min) * 100);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {waveIntensity < 30 ? 'Gentle' : waveIntensity < 70 ? 'Balanced' : 'Intense'}
        </span>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            className="w-full h-10 rounded-lg overflow-hidden -mt-8 opacity-50"
            style={{
              background: `linear-gradient(90deg, 
                rgba(59, 130, 246, 0.2) 0%, 
                rgba(59, 130, 246, ${0.2 + waveIntensity/100}) ${waveIntensity}%, 
                rgba(59, 130, 246, 0.2) 100%)`
            }}
          >
            <motion.div 
              className="w-full h-full"
              animate={{
                backgroundPositionX: ["0%", "100%"],
              }}
              transition={{
                duration: 4 - (waveIntensity / 50), // Faster as intensity increases
                ease: "linear",
                repeat: Infinity,
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 ${5 - waveIntensity/20} 50 10 Q75 ${15 + waveIntensity/20} 100 10' stroke='rgba(59, 130, 246, 0.8)' fill='transparent' stroke-width='2'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat-x",
                backgroundSize: `${80 - waveIntensity/5}px 20px`,
              }}
            />
          </motion.div>
        </div>
        
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={1}
          onValueChange={(values) => onChange(values[0])}
          className="py-6 z-10 relative"
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default WaterFlowSlider;
