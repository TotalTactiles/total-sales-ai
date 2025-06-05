import { logger } from '@/utils/logger';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Copy, Loader2, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface RevealStepProps {
  settings: any;
  completeOnboarding: () => Promise<void>;
  isSubmitting: boolean;
}

const RevealStep: React.FC<RevealStepProps> = ({ settings, completeOnboarding, isSubmitting }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isGeneratingReferral, setIsGeneratingReferral] = useState(false);
  const { generateReferralLink, canUseMetaphoricalUI } = useOnboarding();
  
  // Generate referral animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateReferral = async () => {
    setIsGeneratingReferral(true);
    try {
      const code = await generateReferralLink();
      if (code) {
        setReferralCode(code);
        toast.success('Referral link generated successfully!');
      }
    } catch (error) {
      logger.error('Error generating referral:', error);
    } finally {
      setIsGeneratingReferral(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralCode) return;
    
    // Create the full URL for sharing
    const referralUrl = `${window.location.origin}/join?ref=${referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    toast.success('Referral link copied to clipboard!');
  };

  // Share the referral link
  const shareReferral = async () => {
    if (!referralCode) return;
    
    const referralUrl = `${window.location.origin}/join?ref=${referralCode}`;
    const shareText = `Join me on SalesOS with my customized setup: ${referralUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on SalesOS',
          text: 'Check out my customized SalesOS setup!',
          url: referralUrl,
        });
      } catch (error) {
        logger.error('Error sharing:', error);
        // Fallback to copying to clipboard
        copyReferralLink();
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyReferralLink();
    }
  };

  // Enhanced UI with metaphorical elements
  if (canUseMetaphoricalUI) {
    return (
      <motion.div 
        className="space-y-8"
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
          <h1 className="text-2xl font-bold">Your SalesOS is Ready!</h1>
          <p className="text-muted-foreground">
            We've crafted your perfect sales environment based on your preferences
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col items-center justify-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {!isRevealed ? (
            <motion.div 
              className="flex flex-col items-center space-y-4"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-primary animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-primary border-b-primary border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <p className="text-lg">Building your personalized sales system...</p>
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col items-center space-y-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                animate={{ 
                  boxShadow: [
                    '0 0 0 rgba(var(--primary), 0.4)',
                    '0 0 30px rgba(var(--primary), 0.6)',
                    '0 0 0 rgba(var(--primary), 0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <CheckCircle className="w-16 h-16" />
              </motion.div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">
                  Meet {settings.agent_name}
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Your AI sales assistant is configured for {settings.industry} with a {settings.tone.humor < 30 ? 'serious' : settings.tone.humor > 70 ? 'humorous' : 'balanced'} tone and {settings.tone.formality < 30 ? 'casual' : settings.tone.formality > 70 ? 'formal' : 'balanced'} style.
                </p>
              </div>

              {/* Dashboard Preview Card */}
              <motion.div 
                className="w-full max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="p-4 border border-primary/20">
                  <h3 className="text-lg font-medium mb-2">Your Personalized Dashboard</h3>
                  <ul className="space-y-2">
                    {settings.enabled_modules.dialer && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Smart Dialer with {settings.tone.pushiness > 70 ? 'assertive' : 'consultative'} scripts</span>
                      </li>
                    )}
                    {settings.enabled_modules.brain && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>AI Brain customized for {settings.industry}</span>
                      </li>
                    )}
                    {settings.enabled_modules.analytics && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Analytics Dashboard tracking your goals</span>
                      </li>
                    )}
                    {settings.enabled_modules.aiAgent && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{settings.agent_name} AI Assistant</span>
                      </li>
                    )}
                  </ul>
                </Card>
              </motion.div>
              
              {/* Referral Section */}
              {!referralCode ? (
                <motion.div 
                  className="w-full max-w-md mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGenerateReferral}
                    disabled={isGeneratingReferral}
                  >
                    {isGeneratingReferral ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Referral...
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4" />
                        Generate Referral Link
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Share your configured SalesOS with friends and colleagues
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="w-full max-w-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Input 
                      value={`${window.location.origin}/join?ref=${referralCode}`}
                      readOnly 
                      className="text-sm"
                    />
                    <Button size="icon" onClick={copyReferralLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={shareReferral}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Share this link to give others your SalesOS configuration
                  </p>
                </motion.div>
              )}
              
              <motion.div 
                className="mt-4 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
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
                  Your dashboard will be ready in moments
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }
  
  // Fallback UI for browsers/devices that don't support advanced features
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
