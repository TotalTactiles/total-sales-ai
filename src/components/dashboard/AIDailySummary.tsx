import React, { useState } from 'react';

interface AIDailySummaryProps {
  summary: string;
}

export const AIDailySummary: React.FC<AIDailySummaryProps> = ({ summary }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🤖</span>AI Daily Summary
        </h3>
        <span className="text-blue-200 text-sm">⚡ Live</span>
      </div>
      <p className="text-blue-100 mb-3">
        {expanded ? summary + " Additional insights: Focus on Enterprise accounts between 2-4 PM for optimal response rates. Consider scheduling follow-ups for warm leads within 24 hours." : summary}
      </p>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-blue-200 hover:text-white text-sm transition-colors"
      >
        {expanded ? 'Show less ▲' : 'Read more ▼'}
      </button>
    </div>
  );
};
