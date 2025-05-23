
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react'; // Note: This would require adding the lottie-react package

interface RevealStepProps {
  settings: any;
  completeOnboarding: () => void;
  isSubmitting: boolean;
}

const RevealStep: React.FC<RevealStepProps> = ({ settings, completeOnboarding, isSubmitting }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Simulated animation - in a real implementation, you'd use a Lottie animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Your SalesOS is Ready!</h1>
        <p className="text-muted-foreground">
          We've customized everything based on your preferences
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        {!isRevealed ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p>Building your personalized sales system...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle className="w-14 h-14" />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">
                Meet {settings.agent_name}
              </h2>
              <p className="text-muted-foreground max-w-md">
                Your AI sales assistant is configured for {settings.industry} with a {settings.tone.humor < 30 ? 'serious' : settings.tone.humor > 70 ? 'humorous' : 'balanced'} tone and {settings.tone.formality < 30 ? 'casual' : settings.tone.formality > 70 ? 'formal' : 'balanced'} style.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <Button 
                size="lg" 
                onClick={completeOnboarding}
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Launching SalesOS...
                  </>
                ) : (
                  'Launch My SalesOS'
                )}
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                You can always update your settings later
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevealStep;
