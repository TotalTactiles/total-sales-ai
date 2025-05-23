
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Headphones, LogIn, UserPlus, Info, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Role = 'manager' | 'sales_rep';

const Auth = () => {
  const { user, profile, signIn, signUp, setLastSelectedRole, getLastSelectedRole } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>(getLastSelectedRole());
  const [isVoiceLogin, setIsVoiceLogin] = useState(false);
  const [voiceRecognized, setVoiceRecognized] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
    if (user && profile) {
      const redirectPath = profile.role === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
      navigate(redirectPath);
    }
  }, [user, profile, navigate]);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setLastSelectedRole(role);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        setIsTransitioning(true);
        simulateLoginTransition();
      } else {
        if (!formData.fullName.trim()) {
          toast.error("Please enter your full name");
          return;
        }
        await signUp(formData.email, formData.password, formData.fullName, selectedRole);
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const simulateVoiceLogin = () => {
    setIsVoiceLogin(true);
    // Simulate voice recognition process
    setTimeout(() => {
      setVoiceRecognized(true);
      const userName = selectedRole === 'manager' ? 'John' : 'Sam';
      setWelcomeMessage(`Hey ${userName}, it's great to see you again!`);
      
      setTimeout(() => {
        setIsTransitioning(true);
        simulateLoginTransition();
      }, 1500);
    }, 2000);
  };

  const simulateLoginTransition = () => {
    // Simulate loading and transition to dashboard
    setTimeout(() => {
      const redirectPath = selectedRole === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
      navigate(redirectPath);
    }, 2000);
  };

  const handleDemoMode = () => {
    toast.info("Loading demo mode...");
    setTimeout(() => {
      // Set demo user in localStorage
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', selectedRole);
      
      // Navigate to appropriate dashboard
      const redirectPath = selectedRole === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
      navigate(redirectPath);
    }, 1500);
  };

  const fillDemoCredentials = () => {
    if (selectedRole === 'manager') {
      setFormData({
        email: 'manager@salesos.com',
        password: 'manager123',
        fullName: 'John Manager',
      });
    } else {
      setFormData({
        email: 'rep@salesos.com',
        password: 'sales123',
        fullName: 'Sam Sales',
      });
    }
  };

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-salesBlue-dark text-white">
        <div className="max-w-md w-full p-8 text-center">
          <div className="animate-pulse mb-8">
            <Logo />
          </div>
          
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesCyan mx-auto mb-6"></div>
          
          <div className="typewriter">
            <h2 className="text-xl font-medium mb-2">Loading your workspace...</h2>
            {selectedRole === 'manager' ? (
              <p className="text-salesCyan">Preparing manager dashboard and team analytics</p>
            ) : (
              <p className="text-salesCyan">Optimizing your sales toolkit for maximum results</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isVoiceLogin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-salesBlue text-white">
        <div className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-8">Voice Recognition</h2>
          
          {!voiceRecognized ? (
            <>
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-salesCyan rounded-full opacity-25 animate-ping"></div>
                <div className="relative flex items-center justify-center w-32 h-32 bg-salesCyan rounded-full">
                  <Headphones className="h-16 w-16" />
                </div>
              </div>
              <p className="text-lg">Listening...</p>
              <p className="text-sm text-slate-300 mt-2">Please state your name</p>
            </>
          ) : (
            <>
              <div className="mx-auto w-32 h-32 bg-salesGreen rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Headphones className="h-16 w-16" />
              </div>
              <p className="text-xl font-medium animate-fadeIn">{welcomeMessage}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Logo />
          <h2 className="text-2xl font-bold mt-4 text-salesBlue">Welcome to SalesOS</h2>
          <p className="text-slate-500 mt-1">Your AI-powered sales acceleration platform</p>
        </div>
      
        <Tabs 
          defaultValue={selectedRole} 
          value={selectedRole}
          onValueChange={(value) => handleRoleChange(value as Role)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="manager" className="flex items-center gap-2">
              Manager View
            </TabsTrigger>
            <TabsTrigger value="sales_rep" className="flex items-center gap-2">
              Sales Rep View
            </TabsTrigger>
          </TabsList>
        
          <div className="space-y-6">
            <div className="text-center p-4 mb-4 border border-dashed border-slate-300 rounded-lg">
              <h3 className="font-medium text-lg mb-1">
                {selectedRole === 'manager' ? 'Manager Dashboard' : 'Sales Rep Dashboard'}
              </h3>
              <p className="text-sm text-slate-500">
                {selectedRole === 'manager' 
                  ? 'Team analysis, performance tracking & AI coaching' 
                  : 'Smart dialer, call scripts & AI sales assistant'}
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              {isLogin ? (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-salesBlue hover:bg-salesBlue-dark">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-salesBlue hover:bg-salesBlue-dark">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </form>
              )}
              
              <div className="flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-salesBlue hover:text-salesBlue-dark"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </Button>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <Collapsible
                open={isCredentialsOpen}
                onOpenChange={setIsCredentialsOpen}
                className="w-full bg-slate-50 rounded-lg"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-between text-slate-600">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      <span>Demo Login Credentials</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isCredentialsOpen ? "transform rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-md">
                      <h4 className="font-medium mb-2">Manager Credentials</h4>
                      <p className="text-sm text-slate-600 mb-1"><strong>Email:</strong> manager@salesos.com</p>
                      <p className="text-sm text-slate-600"><strong>Password:</strong> manager123</p>
                    </div>
                    
                    <div className="p-3 bg-white border border-slate-200 rounded-md">
                      <h4 className="font-medium mb-2">Sales Rep Credentials</h4>
                      <p className="text-sm text-slate-600 mb-1"><strong>Email:</strong> rep@salesos.com</p>
                      <p className="text-sm text-slate-600"><strong>Password:</strong> sales123</p>
                    </div>
                    
                    <Button 
                      onClick={fillDemoCredentials}
                      className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Fill in {selectedRole === 'manager' ? 'Manager' : 'Sales Rep'} Credentials
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button 
                variant="outline" 
                onClick={simulateVoiceLogin} 
                className="w-full border-salesCyan text-salesCyan hover:bg-salesCyan hover:text-white"
              >
                <Headphones className="mr-2 h-4 w-4" /> Voice Login
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDemoMode} 
                className="w-full border-salesGreen text-salesGreen hover:bg-salesGreen hover:text-white"
              >
                Try Demo Mode <Badge className="ml-2 bg-white text-salesGreen">New</Badge>
              </Button>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
