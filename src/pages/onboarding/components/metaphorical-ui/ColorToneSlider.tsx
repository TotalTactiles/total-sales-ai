
import React, { useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ColorToneSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
}

const ColorToneSlider: React.FC<ColorToneSliderProps> = ({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  leftLabel,
  rightLabel,
  leftColor = 'rgba(59, 130, 246, 0.5)', // blue
  rightColor = 'rgba(236, 72, 153, 0.5)', // pink
}) => {
  // Calculate percentage for gradient
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Generate descriptive label based on value
  const getDescriptiveLabel = useMemo(() => {
    if (value < 30) return 'Low';
    if (value < 70) return 'Balanced';
    return 'High';
  }, [value]);
  
  // Generate wave SVG based on value
  const generateWave = useMemo(() => {
    const amplitude = 5 + (value / 10);
    const frequency = 20 - (value / 10);
    
    // Create SVG path for a wave
    let path = `M0 50 `;
    for (let i = 0; i <= 100; i += 10) {
      const y = 50 + amplitude * Math.sin((i / frequency) * Math.PI);
      path += `L${i} ${y} `;
    }
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${path}' stroke='%23ffffff' fill='none' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E`;
  }, [value]);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {getDescriptiveLabel}
        </span>
      </div>
      
      <div 
        className="h-8 rounded-md mb-1"
        style={{
          background: `linear-gradient(to right, ${leftColor} 0%, ${rightColor} 100%)`,
          backgroundImage: `url("${generateWave}")`,
          backgroundSize: '100px 100%',
          backgroundRepeat: 'repeat-x',
        }}
      />
      
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(values) => onChange(values[0])}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default ColorToneSlider;
