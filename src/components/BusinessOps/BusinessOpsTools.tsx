
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import BusinessOpsToolModal from './BusinessOpsToolModal';

interface BusinessTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
}

const BusinessOpsTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<BusinessTool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const businessTools: BusinessTool[] = [
    {
      id: 'revenue-projection',
      title: 'Revenue Projection',
      description: 'Forecast future revenue based on current trends and growth rates',
      icon: TrendingUp,
      category: 'Financial Planning'
    },
    {
      id: 'cost-analysis',
      title: 'Cost Analysis',
      description: 'Analyze fixed and variable costs to optimize spending',
      icon: Calculator,
      category: 'Cost Management'
    },
    {
      id: 'roi-calculator',
      title: 'ROI Calculator',
      description: 'Calculate return on investment for projects and campaigns',
      icon: DollarSign,
      category: 'Investment Analysis'
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Evaluate market size, competition, and opportunities',
      icon: BarChart3,
      category: 'Market Research'
    },
    {
      id: 'budget-planner',
      title: 'Budget Planner',
      description: 'Plan and allocate budgets across departments and projects',
      icon: PieChart,
      category: 'Financial Planning'
    },
    {
      id: 'performance-metrics',
      title: 'Performance Metrics',
      description: 'Track and analyze key performance indicators',
      icon: Target,
      category: 'Performance Analysis'
    }
  ];

  const handleToolClick = (tool: BusinessTool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const groupedTools = businessTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, BusinessTool[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">All Business Operations Actions</h2>
        <p className="text-gray-600">Select a tool to generate insights and reports</p>
      </div>

      {Object.entries(groupedTools).map(([category, tools]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              
              return (
                <Card 
                  key={tool.id} 
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleToolClick(tool)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      {tool.description}
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToolClick(tool);
                      }}
                    >
                      Use Tool
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {selectedTool && (
        <BusinessOpsToolModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          toolType={selectedTool.id}
          toolTitle={selectedTool.title}
        />
      )}
    </div>
  );
};

export default BusinessOpsTools;
