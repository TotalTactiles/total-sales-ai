
import React from 'react';
import { Brain } from 'lucide-react';

interface AISummaryBannerProps {
  userStats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    mood_score: number | null;
  } | null;
  enabled: boolean;
}

const AISummaryBanner: React.FC<AISummaryBannerProps> = ({ userStats, enabled }) => {
  if (!enabled) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 mb-1">AI Summary - Your Performance Today</h3>
          <p className="text-sm text-blue-700 mb-2">
            You've made {userStats?.call_count || 0} calls with a {userStats?.win_count ? Math.round((userStats.win_count / userStats.call_count) * 100) : 0}% success rate. 
            {userStats?.current_streak && userStats.current_streak > 0 && ` Your ${userStats.current_streak}-day streak shows consistent performance.`}
          </p>
          <p className="text-sm font-medium text-blue-800">
            <strong>Next step:</strong> {userStats?.mood_score && userStats.mood_score < 70 ? 'Consider activating Recovery Mode to rebuild momentum' : 'Continue your current approach - it\'s working well!'} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default AISummaryBanner;
