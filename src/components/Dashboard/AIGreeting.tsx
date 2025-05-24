
import React from 'react';

interface AIGreetingProps {
  userName: string;
  streak?: number;
}

const AIGreeting: React.FC<AIGreetingProps> = ({ userName, streak }) => {
  return (
    <div className="mb-6 bg-gradient-to-r from-primary to-dashBlue p-4 rounded-xl text-primary-foreground animate-fade-in shadow-md">
      <div className="flex items-center">
        <span className="text-3xl mr-3 animate-float">👋</span>
        <div>
          <h2 className="text-xl font-semibold">Good morning, {userName}!</h2>
          <p className="text-primary-foreground/90">
            {streak ? 
              `You're on a ${streak} day winning streak! 🔥 Your conversion rate is up 15% this week!` : 
              'You have 5 high priority leads and 2 missions today. Ready to make some calls?'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIGreeting;
