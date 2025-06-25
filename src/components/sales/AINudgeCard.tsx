
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, X } from 'lucide-react';
import { useAINudges } from '@/hooks/useAINudges';

const AINudgeCard: React.FC = () => {
  const { nudges, loading, markAsSeen, dismissNudge } = useAINudges();

  if (loading || nudges.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5" />
            <div>
              <p className="font-semibold">AI Coach</p>
              <p className="text-purple-100">Ready to help when you need it!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topNudge = nudges[0];

  const handleDismiss = () => {
    dismissNudge(topNudge.id);
  };

  const handleAction = () => {
    markAsSeen(topNudge.id);
    if (topNudge.action_url) {
      window.location.href = topNudge.action_url;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-semibold">{topNudge.title}</p>
              <p className="text-purple-100">{topNudge.message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {topNudge.action_url && (
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={handleAction}
            >
              Take Action
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AINudgeCard;
