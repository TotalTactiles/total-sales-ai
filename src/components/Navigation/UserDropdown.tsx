
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';
import { toast } from 'sonner';

interface UserDropdownProps {
  userRole?: 'sales_rep' | 'manager' | 'admin';
  userAvatar?: string;
  onLogout?: () => void | Promise<void>;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ 
  userRole, 
  userAvatar, 
  onLogout 
}) => {
  const { profile, user } = useAuth();
  const { logout } = useOptimizedLogout();
  const navigate = useNavigate();

  const displayName = profile?.full_name || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await logout();
      }
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-blue-200 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 bg-white shadow-lg border rounded-lg p-2" 
        align="end"
        sideOffset={5}
      >
        {/* User Info Header */}
        <div className="flex items-center gap-3 p-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium text-sm text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 capitalize">
              {profile?.role?.replace('_', ' ') || 'User'}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem 
          onClick={handleProfile}
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer"
        >
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleSettings}
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer"
        >
          <Settings className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 py-2 px-3 hover:bg-red-50 rounded cursor-pointer text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
