
import React from 'react';

interface UserProfileProps {
  name: string;
  role: string;
  avatar?: string;
  xp?: number;
  level?: number;
}

const UserProfile = ({ 
  name = "Sam Smith", 
  role = "Sales Representative", 
  avatar = "/placeholder.svg",
  xp = 750,
  level = 12
}: UserProfileProps) => {
  // XP to next level (just a simple calculation for demo purposes)
  const nextLevelXp = 1000;
  const xpProgress = (xp / nextLevelXp) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-salesGreen text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {level}
        </div>
      </div>
      <div>
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-slate-500">{role}</div>
        <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
          <div 
            className="h-full bg-salesGreen rounded-full animate-progress-bar" 
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
