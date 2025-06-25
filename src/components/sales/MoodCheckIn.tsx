
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MoodCheckInProps {
  onMoodSelect: (mood: 'fire' | 'neutral' | 'cold') => void;
}

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'fire', emoji: '🔥', label: 'On Fire', color: 'bg-red-500' },
    { id: 'neutral', emoji: '😐', label: 'Steady', color: 'bg-yellow-500' },
    { id: 'cold', emoji: '🧊', label: 'Need Fuel', color: 'bg-blue-500' }
  ];

  const handleMoodSelect = (mood: 'fire' | 'neutral' | 'cold') => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">How are you feeling today?</h3>
        <div className="flex gap-3">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? 'default' : 'outline'}
              className={`flex-1 flex flex-col items-center gap-2 h-20 ${
                selectedMood === mood.id ? mood.color + ' text-white' : ''
              }`}
              onClick={() => handleMoodSelect(mood.id as 'fire' | 'neutral' | 'cold')}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-sm">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodCheckIn;
