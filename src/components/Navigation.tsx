
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Logo from './Logo';
import UserProfile from './UserProfile';

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/' },
    { id: 'dialer', label: 'Smart Dialer', href: '/dialer' },
    { id: 'leads', label: 'Lead Management', href: '/leads' },
    { id: 'analytics', label: 'Analytics', href: '/analytics' },
    { id: 'training', label: 'Training', href: '/training' },
    { id: 'store', label: 'Store', href: '/store' },
  ];
  
  return (
    <div className="bg-salesBlue text-white">
      {/* Top navigation */}
      <div className="px-6 py-3 flex justify-between items-center border-b border-salesBlue-light">
        <Logo />
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
            <div className="relative">
              <span>☎️</span>
              <span className="absolute -top-1 -right-1 bg-salesRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
            <div className="relative">
              <span>📊</span>
              <span className="absolute -top-1 -right-1 bg-salesCyan rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                5
              </span>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
            <div className="relative">
              <span>🏆</span>
              <span className="absolute -top-1 -right-1 bg-salesGreen rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
            </div>
          </Button>
          <div className="pl-4 border-l border-salesBlue-light">
            <UserProfile />
          </div>
        </div>
      </div>
      
      {/* Menu navigation */}
      <div className="px-6 py-1 flex">
        {navItems.map((item) => (
          <Link 
            key={item.id}
            to={item.href}
            className={`px-4 py-3 font-medium transition-colors ${
              activeItem === item.id 
                ? 'text-white border-b-2 border-salesCyan' 
                : 'text-slate-300 hover:text-white'
            }`}
            onClick={() => setActiveItem(item.id)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
