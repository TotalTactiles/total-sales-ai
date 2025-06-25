
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import QuestionCard from './QuestionCard';
import { Question } from '@/constants/salesRepQuestions';

interface QuestionFlowProps {
  questions: Question[];
  userRole: 'sales_rep' | 'manager';
  title: string;
}

const QuestionFlow: React.FC<QuestionFlowProps> = ({ questions, userRole, title }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentStep];

  // Update profile with current answer
  const updateProfile = async (field: string, value: any) => {
    if (!user) return;

    try {
      const updateData: any = { [field]: value };
      
      // Handle special cases
      if (field === 'team_size' && typeof value === 'string') {
        // Convert team size to number for database
        const sizeMap: Record<string, number> = {
          '1': 1,
          '2–5': 3,
          '6–10': 8,
          '11+': 15
        };
        updateData.team_size = sizeMap[value] || 1;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      logger.info(`Updated profile field: ${field}`, { value, userId: user.id });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      toast.error(`Failed to save ${field}`);
    }
  };

  // Initialize or update company master AI
  const initializeCompanyMasterAI = async () => {
    if (!user || !profile?.company_id) return;

    try {
      // Check if company master AI exists
      const { data: existingAI } = await supabase
        .from('company_master_ai')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

      if (!existingAI) {
        // Create new company master AI
        const { error } = await supabase
          .from('company_master_ai')
          .insert({
            company_id: profile.company_id,
            top_weaknesses: answers.weakness ? [answers.weakness] : [],
            wishlist_tags: answers.wishlist ? [answers.wishlist] : [],
            most_clicked_features: []
          });

        if (error) throw error;
      } else {
        // Update existing company master AI
        const updatedWeaknesses = answers.weakness && !existingAI.top_weaknesses?.includes(answers.weakness)
          ? [...(existingAI.top_weaknesses || []), answers.weakness]
          : existingAI.top_weaknesses;

        const updatedWishlist = answers.wishlist && !existingAI.wishlist_tags?.includes(answers.wishlist)
          ? [...(existingAI.wishlist_tags || []), answers.wishlist]
          : existingAI.wishlist_tags;

        const { error } = await supabase
          .from('company_master_ai')
          .update({
            top_weaknesses: updatedWeaknesses,
            wishlist_tags: updatedWishlist,
            last_synced_at: new Date().toISOString()
          })
          .eq('company_id', profile.company_id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Failed to update company master AI:', error);
    }
  };

  const handleNext = async () => {
    const currentAnswer = answers[currentQuestion.id];
    
    if (!currentAnswer) {
      toast.error('Please answer the question to continue');
      return;
    }

    // Save current answer to database
    await updateProfile(currentQuestion.id, currentAnswer);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete onboarding
      setIsLoading(true);
      try {
        // Mark onboarding as complete
        await updateProfile('onboarding_complete', true);
        await updateProfile('launched_at', new Date().toISOString());
        
        // Initialize company master AI
        await initializeCompanyMasterAI();
        
        logger.info('Onboarding completed', { userRole, userId: user?.id, answers });
        toast.success(`Welcome to your personalized ${userRole === 'sales_rep' ? 'Sales Rep' : 'Manager'} OS!`);
        
        // Navigate to appropriate dashboard
        setTimeout(() => {
          if (userRole === 'manager') {
            navigate('/os/manager/dashboard');
          } else {
            navigate('/os/rep/dashboard');
          }
        }, 1000);
        
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        toast.error('Failed to complete onboarding');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">Let's customize your experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={currentStep === 0}
              isLast={currentStep === questions.length - 1}
              isLoading={isLoading}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestionFlow;
