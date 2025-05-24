
import React from 'react';
import { 
  Home,
  Headphones,
  Users,
  BarChart,
  Briefcase,
  BookOpen,
  ShoppingBag,
  FileText,
  Shield,
  Settings
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const createNavItems = (getDashboardUrl: () => string): NavItem[] => [
  { id: 'dashboard', label: 'Dashboard', href: getDashboardUrl(), icon: <Home className="h-5 w-5" /> },
  { id: 'dialer', label: 'Smart Dialer', href: '/dialer', icon: <Headphones className="h-5 w-5" /> }, 
  { id: 'leads', label: 'Lead Management', href: '/leads', icon: <Users className="h-5 w-5" /> },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <BarChart className="h-5 w-5" /> },
  { id: 'missions', label: 'Agent Missions', href: '/agent-missions', icon: <Briefcase className="h-5 w-5" /> }, 
  { id: 'brain', label: 'Company Brain', href: '/company-brain', icon: <BookOpen className="h-5 w-5" /> }, 
  { id: 'tools', label: 'Agent Tools', href: '/tools', icon: <ShoppingBag className="h-5 w-5" /> }, 
  { id: 'reports', label: 'Reports', href: '/reports', icon: <FileText className="h-5 w-5" /> },
  { id: 'access', label: 'Access Control', href: '/access', icon: <Shield className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> }, 
  { id: 'ai-agent', label: '🧠 AI Agent (Beta)', href: '/ai-agent', icon: null },
];
