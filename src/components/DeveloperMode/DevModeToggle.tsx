
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DevModeToggle: React.FC = () => {
  const navigate = useNavigate();

  const handleDevModeToggle = () => {
    // For testing purposes, navigate to developer dashboard
    navigate('/developer');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleDevModeToggle}
        variant="outline"
        size="sm"
        className="bg-slate-800 border-cyan-400 text-cyan-400 hover:bg-slate-700"
      >
        <Code className="h-4 w-4 mr-2" />
        Dev Mode
      </Button>
    </div>
  );
};

export default DevModeToggle;
