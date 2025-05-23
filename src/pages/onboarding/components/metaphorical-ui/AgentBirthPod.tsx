
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface AgentBirthPodProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  suggestions?: string[];
}

const AgentBirthPod: React.FC<AgentBirthPodProps> = ({
  value,
  onChange,
  label,
  suggestions = []
}) => {
  const [podStage, setPodStage] = useState<'dormant' | 'forming' | 'active'>('dormant');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Progress through pod stages based on input
  useEffect(() => {
    if (!value || value.length < 3) {
      setPodStage('dormant');
    } else {
      setPodStage('forming');
      const timer = setTimeout(() => {
        if (value && value.length >= 3) {
          setPodStage('active');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Handle selecting a suggestion
  const handleSelectSuggestion = (name: string) => {
    setSelectedSuggestion(name);
    onChange(name);
  };

  return (
    <div className="space-y-6">
      <Label className="text-base font-medium">{label}</Label>
      
      <div className="relative flex flex-col items-center justify-center py-6">
        {/* The pod/chamber that "grows" the AI agent */}
        <motion.div
          className="relative w-48 h-48 rounded-full flex items-center justify-center mb-8"
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ 
            opacity: podStage === 'dormant' ? 0.5 : 1,
            scale: podStage === 'dormant' ? 0.9 : 1.1,
          }}
          transition={{ duration: 1.2 }}
        >
          {/* Outer glow */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30"
            animate={{ 
              boxShadow: podStage === 'active' 
                ? ['0 0 20px 5px rgba(99, 102, 241, 0.4)', '0 0 40px 10px rgba(168, 85, 247, 0.5)', '0 0 20px 5px rgba(236, 72, 153, 0.4)']
                : '0 0 10px 2px rgba(99, 102, 241, 0.2)'
            }}
            transition={{ duration: 3, repeat: podStage === 'active' ? Infinity : 0, repeatType: 'reverse' }}
          />
          
          {/* Glass pod */}
          <motion.div 
            className="absolute inset-2 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 overflow-hidden"
            animate={{
              boxShadow: podStage === 'dormant' 
                ? 'inset 0 0 10px 0px rgba(255, 255, 255, 0.1)' 
                : 'inset 0 0 20px 5px rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Energy particles inside the pod */}
            {podStage !== 'dormant' && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-primary/50"
                    initial={{ 
                      x: Math.random() * 100 - 50, 
                      y: Math.random() * 100 - 50,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
          
          {/* AI Agent Icon/Symbol */}
          <motion.div
            className="relative z-10 text-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: podStage === 'dormant' ? 0 : podStage === 'forming' ? 0.5 : 1,
              scale: podStage === 'dormant' ? 0 : podStage === 'forming' ? 0.7 : 1
            }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {value ? (
              <div className="text-2xl font-bold">
                {value.substring(0, 1).toUpperCase()}
              </div>
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 8.1 19.33 6.66 18.12C6.23 17.78 5.96 17.28 5.96 16.76C5.96 14.08 8.3 12 12 12C15.7 12 18.04 14.08 18.04 16.76C18.04 17.28 17.77 17.78 17.34 18.12C15.9 19.33 14.03 20 12 20Z" fill="currentColor"/>
              </svg>
            )}
          </motion.div>
        </motion.div>

        {/* Name input */}
        <div className="w-full max-w-xs relative">
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setSelectedSuggestion(null);
            }}
            placeholder="Enter agent name"
            className="text-center"
          />
        </div>
        
        {/* Suggested names */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {suggestions.map((name) => (
              <motion.button
                key={name}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedSuggestion === name || value === name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                onClick={() => handleSelectSuggestion(name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {name}
              </motion.button>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        {podStage === 'dormant' && "Name your AI assistant to begin the creation process"}
        {podStage === 'forming' && "Your AI assistant is taking form..."}
        {podStage === 'active' && `${value} is ready to become your sales assistant`}
      </p>
    </div>
  );
};

export default AgentBirthPod;
