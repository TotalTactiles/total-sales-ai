
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PhoneCall, Clock, Crown } from 'lucide-react';

interface ProfileCardProps {
  userName: string;
  userStats: {
    call_count: number;
    win_count: number;
  } | null;
  isFullUser: boolean;
  focusMode: boolean;
  onToggleFocusMode: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  userName, 
  userStats, 
  isFullUser, 
  focusMode, 
  onToggleFocusMode 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-salesBlue text-white">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{userName}</div>
            <div className="text-sm text-slate-500">Sales Representative</div>
            {isFullUser && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Pro User
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-center mb-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-salesBlue">{userStats?.call_count || 0}</p>
            <p className="text-xs text-slate-600">Total Calls</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-salesGreen">{userStats?.win_count || 0}</p>
            <p className="text-xs text-slate-600">Wins</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <PhoneCall className="h-4 w-4 mr-2" />
            Start Calling
          </Button>
          <Button 
            variant="outline" 
            className={`w-full justify-start ${
              focusMode ? 'bg-salesGreen text-white hover:bg-salesGreen-dark' : 'border-salesGreen text-salesGreen hover:bg-salesGreen-light'
            }`}
            onClick={onToggleFocusMode}
          >
            <Clock className="h-4 w-4 mr-2" />
            {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
