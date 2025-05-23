
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingContext';
import NorthStarGoal from '../components/metaphorical-ui/NorthStarGoal';

interface GoalStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const GoalStep: React.FC<GoalStepProps> = ({ settings, updateSettings }) => {
  const { canUseMetaphoricalUI } = useOnboarding();

  const handleGoalChange = (goal: string) => {
    updateSettings({ original_goal: goal });
  };

  const goalExamples = [
    "Reduce our sales cycle by 20% through better qualification and objection handling",
    "Train new sales reps 50% faster with AI coaching and real-time guidance",
    "Increase deal conversion rates by improving our follow-up process",
    "Standardize our sales approach across the entire team",
    "Help our reps spend less time on admin work and more time selling"
  ];

  const useExample = (example: string) => {
    updateSettings({ original_goal: example });
  };

  // Enhanced UI with metaphorical elements
  if (canUseMetaphoricalUI) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">What's your North Star goal?</h1>
          <p className="text-muted-foreground">
            Define the guiding objective for your SalesOS journey
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <NorthStarGoal
            value={settings.original_goal}
            onChange={handleGoalChange}
            label="Your Goal"
            placeholder="Describe what you want to accomplish with SalesOS..."
          />
        </motion.div>

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Label>Need inspiration? Try one of these:</Label>
          <div className="mt-2 space-y-2">
            {goalExamples.map((example, index) => (
              <motion.div 
                key={index}
                className="border border-dashed rounded-lg p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => useExample(example)}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.05)" }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-sm">"{example}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Fallback UI for browsers/devices that don't support advanced features
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">What's your main goal?</h1>
        <p className="text-muted-foreground">
          Tell us what you want your SalesOS to help you achieve
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="goal">Your Goal</Label>
          <Textarea
            id="goal"
            placeholder="Describe what you want to accomplish with SalesOS..."
            value={settings.original_goal}
            onChange={(e) => handleGoalChange(e.target.value)}
            className="mt-1 h-32"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            We'll use this to customize your experience and track your progress over time.
          </p>
        </div>

        <div className="mt-8">
          <Label>Need inspiration? Try one of these:</Label>
          <div className="mt-2 space-y-2">
            {goalExamples.map((example, index) => (
              <div 
                key={index}
                className="border border-dashed rounded-lg p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => useExample(example)}
              >
                <p className="text-sm">"{example}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalStep;
