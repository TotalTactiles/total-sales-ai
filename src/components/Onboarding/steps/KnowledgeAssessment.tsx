
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle } from 'lucide-react';

const KnowledgeAssessment: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      question: "How would you rate your sales experience?",
      options: [
        { value: 'beginner', label: 'Beginner (0-1 years)' },
        { value: 'intermediate', label: 'Intermediate (2-5 years)' },
        { value: 'advanced', label: 'Advanced (5+ years)' }
      ]
    },
    {
      question: "Which area would you like to improve most?",
      options: [
        { value: 'prospecting', label: 'Lead Generation & Prospecting' },
        { value: 'closing', label: 'Closing Techniques' },
        { value: 'objections', label: 'Handling Objections' },
        { value: 'relationships', label: 'Building Relationships' }
      ]
    },
    {
      question: "What's your primary sales method?",
      options: [
        { value: 'phone', label: 'Phone Calls' },
        { value: 'email', label: 'Email Outreach' },
        { value: 'social', label: 'Social Selling' },
        { value: 'meetings', label: 'In-Person Meetings' }
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion === 0) {
      updateOnboardingData({ knowledgeLevel: answer as 'beginner' | 'intermediate' | 'advanced' });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Assessment complete - determine recommended features
      const recommendedFeatures = generateRecommendations(newAnswers);
      updateOnboardingData({ preferredFeatures: recommendedFeatures });
    }
  };

  const generateRecommendations = (userAnswers: Record<number, string>) => {
    const features = [];
    
    // Based on experience level
    if (userAnswers[0] === 'beginner') {
      features.push('ai-coaching', 'guided-scripts', 'academy');
    } else if (userAnswers[0] === 'advanced') {
      features.push('advanced-analytics', 'automation', 'ai-insights');
    }

    // Based on improvement area
    if (userAnswers[1] === 'prospecting') {
      features.push('lead-scoring', 'prospecting-tools');
    } else if (userAnswers[1] === 'closing') {
      features.push('closing-playbooks', 'deal-coaching');
    }

    // Based on sales method
    if (userAnswers[2] === 'phone') {
      features.push('call-analytics', 'voice-ai');
    } else if (userAnswers[2] === 'email') {
      features.push('email-templates', 'sequence-automation');
    }

    return features;
  };

  const isComplete = currentQuestion >= questions.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Knowledge Assessment</h3>
        <p className="text-gray-600">
          Help us understand your experience to personalize your learning path
        </p>
      </div>

      {!isComplete ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentQuestion
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {answers[index] ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
              ))}
            </div>
            <h4 className="text-lg font-medium mb-6">
              {questions[currentQuestion].question}
            </h4>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <Card
                key={option.value}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50"
                onClick={() => handleAnswer(option.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h4 className="text-lg font-semibold">Assessment Complete!</h4>
          <p className="text-gray-600">
            Based on your answers, we've personalized SalesOS for your experience level: 
            <span className="font-semibold text-indigo-600 ml-1">
              {onboardingData.knowledgeLevel?.charAt(0).toUpperCase() + onboardingData.knowledgeLevel?.slice(1)}
            </span>
          </p>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-700">
              We'll focus on features that match your experience and goals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeAssessment;
