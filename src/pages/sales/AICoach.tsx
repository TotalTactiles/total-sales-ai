
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, Play, ChevronRight, Award } from 'lucide-react';

const AICoach: React.FC = () => {
  const [currentDrill, setCurrentDrill] = useState(0);

  const objectionDrills = [
    {
      objection: "Your solution is too expensive.",
      category: "Price",
      difficulty: "Beginner",
      aiResponse: "Focus on ROI and value. Ask about their current costs and pain points.",
      practiceScript: "I understand price is a concern. Can you tell me what you're spending on your current solution, including the hidden costs of inefficiency?"
    },
    {
      objection: "We don't have budget right now.",
      category: "Budget",
      difficulty: "Intermediate",
      aiResponse: "Explore the cost of inaction. Help them find the budget by showing value.",
      practiceScript: "I hear that often. What would happen if you don't address this issue? Sometimes the cost of doing nothing is higher than the investment."
    },
    {
      objection: "We need to think about it.",
      category: "Hesitation",
      difficulty: "Advanced",
      aiResponse: "Uncover the real concern. This usually means something specific is holding them back.",
      practiceScript: "Absolutely, this is an important decision. Is there a specific aspect you'd like to think through? I might be able to help clarify."
    }
  ];

  const recentCalls = [
    {
      date: "Today, 2:30 PM",
      contact: "Sarah Chen",
      duration: "23 min",
      sentiment: "Positive",
      aiInsight: "Strong engagement, mentioned budget availability. Follow up with proposal."
    },
    {
      date: "Yesterday, 4:15 PM",
      contact: "Mike Rodriguez",
      duration: "18 min",
      sentiment: "Neutral",
      aiInsight: "Some hesitation about implementation. Send case study about similar company."
    }
  ];

  const currentDrillData = objectionDrills[currentDrill];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Coach</h1>
          <p className="text-gray-600">Objection drills, call reviews, and live assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Objection Practice */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Objection Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{currentDrillData.category}</Badge>
                  <Badge className={
                    currentDrillData.difficulty === 'Beginner' ? 'bg-green-500' :
                    currentDrillData.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {currentDrillData.difficulty}
                  </Badge>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-medium text-red-800 mb-2">Objection:</p>
                  <p className="text-red-700">"{currentDrillData.objection}"</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-800 mb-2">AI Strategy:</p>
                  <p className="text-blue-700">{currentDrillData.aiResponse}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800 mb-2">Practice Response:</p>
                  <p className="text-green-700">"{currentDrillData.practiceScript}"</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentDrill((prev) => (prev + 1) % objectionDrills.length)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Next Drill
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Mic className="h-4 w-4 mr-2" />
                    Practice Speaking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Reviews */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Recent Call Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{call.contact}</p>
                        <p className="text-sm text-gray-600">{call.date} • {call.duration}</p>
                      </div>
                      <Badge className={
                        call.sentiment === 'Positive' ? 'bg-green-500' :
                        call.sentiment === 'Neutral' ? 'bg-yellow-500' : 'bg-red-500'
                      }>
                        {call.sentiment}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-700">{call.aiInsight}</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Play className="h-4 w-4 mr-2" />
                      Review Full Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
