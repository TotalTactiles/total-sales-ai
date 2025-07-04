
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';

const QuickCommandBar: React.FC = () => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      // In demo mode, just show a toast or alert
      alert(`Command executed: ${command}`);
      setCommand('');
    }
  };

  return (
    <div className="sticky top-[120px] z-30 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Quick Command: 'Reassign Sarah's leads', 'Create new reward', 'View underperforming reps'..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-purple-200"
            />
          </div>
          <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QuickCommandBar;
