
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MoodCheckIn from '@/components/sales/MoodCheckIn';
import TodaysKillList from '@/components/sales/TodaysKillList';
import RepQuickStats from '@/components/sales/RepQuickStats';
import AINudgeCard from '@/components/sales/AINudgeCard';
import AICoachDock from '@/components/sales/AICoachDock';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [currentMood, setCurrentMood] = useState<'fire' | 'neutral' | 'cold' | null>(null);

  const handleMoodSelect = (mood: 'fire' | 'neutral' | 'cold') => {
    setCurrentMood(mood);
    // TODO: Store mood in database and adjust AI tone accordingly
    console.log('Mood selected:', mood);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-gray-600">Ready to crush your goals today?</p>
        </div>

        {/* Mood Check-in */}
        <MoodCheckIn onMoodSelect={handleMoodSelect} />

        {/* AI Nudge */}
        <AINudgeCard />

        {/* Quick Stats */}
        <RepQuickStats />

        {/* Today's Kill List */}
        <TodaysKillList />

        {/* AI Coach Dock */}
        <AICoachDock />
      </div>
    </div>
  );
};

export default SalesRepDashboard;
