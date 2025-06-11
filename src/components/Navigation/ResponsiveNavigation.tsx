
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Menu, 
  X, 
  Brain, 
  Activity, 
  TestTube, 
  Settings,
  Database,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface ResponsiveNavigationProps {
  tabs: NavigationTab[];
  defaultTab?: string;
  className?: string;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  tabs,
  defaultTab,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn("flex h-screen w-full", className)}>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col bg-background border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">Relevance AI</span>
              <Badge variant="outline" className="text-xs">
                v1
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isCollapsed ? "px-2" : "px-3"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {!isCollapsed && <span className="truncate">{tab.label}</span>}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="p-4 border-t">
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">AI Active</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-semibold">Relevance AI</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute top-0 left-0 w-64 h-full bg-background border-r">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Relevance AI</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTabData && (
          <div className="h-full overflow-y-auto">
            {activeTabData.component}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveNavigation;
