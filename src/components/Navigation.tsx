
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Logo from './Logo';
import UserProfile from './UserProfile';
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Zap, MessageCircle } from "lucide-react";

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/' },
    { id: 'dialer', label: 'Dialer Queue', href: '/dialer' }, // Updated name
    { id: 'leads', label: 'Lead Management', href: '/leads' },
    { id: 'analytics', label: 'Analytics', href: '/analytics' },
    { id: 'training', label: 'Agent Academy', href: '/training' }, // Updated name
    { id: 'store', label: 'Agent Tools', href: '/store' }, // Updated name
  ];
  
  return (
    <div className="bg-salesBlue text-white shadow-lg">
      {/* Top navigation */}
      <div className="px-6 py-3 flex justify-between items-center border-b border-salesBlue-light">
        <Logo />
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-salesBlue-light rounded-full p-2">
            <div className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-salesRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                3
              </Badge>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-salesBlue-light rounded-full p-2">
            <div className="relative">
              <Calendar className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-salesCyan rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                5
              </Badge>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-salesBlue-light rounded-full p-2">
            <div className="relative">
              <Zap className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-salesGreen rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                2
              </Badge>
            </div>
          </Button>
          
          <div className="h-8 border-l border-salesBlue-light mx-2"></div>
          
          {/* Gamification Bar */}
          <div className="hidden md:flex items-center gap-3 bg-salesBlue-dark px-3 py-1.5 rounded-full text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-salesGreen" />
              <span>Level 12</span>
            </div>
            <div className="h-3 border-l border-salesBlue-light"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-salesCyan">🔥 3 Day Streak</span>
            </div>
            <div className="h-3 border-l border-salesBlue-light"></div>
            <div>
              <span>250 Credits</span>
            </div>
          </div>
          
          <div className="h-8 border-l border-salesBlue-light mx-2"></div>
          
          {/* User Profile */}
          <div>
            <UserProfile name="Sam Smith" role="Sales Representative" />
          </div>
        </div>
      </div>
      
      {/* Menu navigation */}
      <div className="px-6 py-1 flex overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <Link 
            key={item.id}
            to={item.href}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeItem === item.id 
                ? 'text-white border-b-2 border-salesCyan' 
                : 'text-slate-300 hover:text-white'
            }`}
            onClick={() => setActiveItem(item.id)}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Focus Mode Button */}
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-salesCyan text-salesCyan hover:bg-salesBlue-light hover:text-white flex items-center gap-1.5 my-1.5"
          >
            <MessageCircle className="h-4 w-4" />
            Focus Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
