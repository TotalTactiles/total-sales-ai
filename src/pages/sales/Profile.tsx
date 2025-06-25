
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Target, Brain, Mic, Settings, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { profile } = useAuth();
  const [salesStyle, setSalesStyle] = useState(profile?.sales_style || 'consultative');
  const [motivation, setMotivation] = useState(profile?.rep_motivation || 'achievement');
  const [aiTone, setAiTone] = useState([70]); // AI tone slider value
  const [notifications, setNotifications] = useState(true);

  const salesStyles = [
    { value: 'hunter', label: 'Hunter', description: 'Aggressive prospecting, high activity' },
    { value: 'educator', label: 'Educator', description: 'Teaching-focused, value-driven' },
    { value: 'consultative', label: 'Consultative', description: 'Relationship-building, solution-oriented' },
    { value: 'challenger', label: 'Challenger', description: 'Disruptive, insight-led approach' }
  ];

  const motivationTypes = [
    { value: 'achievement', label: 'Achievement', icon: '🏆' },
    { value: 'money', label: 'Financial', icon: '💰' },
    { value: 'recognition', label: 'Recognition', icon: '⭐' },
    { value: 'mastery', label: 'Mastery', icon: '🎯' }
  ];

  const goals = [
    { id: 1, title: 'Monthly Revenue Target', current: '$45,000', target: '$50,000', progress: 90 },
    { id: 2, title: 'Calls per Week', current: '47', target: '50', progress: 94 },
    { id: 3, title: 'Demo Conversion Rate', current: '25%', target: '30%', progress: 83 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Customize your sales experience and AI assistance</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="ai-preferences">AI Preferences</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        defaultValue={profile?.full_name || ''} 
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        defaultValue={profile?.email || ''} 
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      defaultValue={profile?.phone_number || ''} 
                      placeholder="Enter your phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sales Style */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Sales Style Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>What's your preferred sales approach?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {salesStyles.map((style) => (
                        <div 
                          key={style.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            salesStyle === style.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSalesStyle(style.value)}
                        >
                          <h4 className="font-semibold">{style.label}</h4>
                          <p className="text-sm text-gray-600">{style.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>What motivates you most?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {motivationTypes.map((type) => (
                      <div 
                        key={type.value}
                        className={`p-4 text-center border rounded-lg cursor-pointer transition-all ${
                          motivation === type.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setMotivation(type.value)}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <p className="font-medium">{type.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Personal Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{goal.title}</h4>
                        <Badge variant="outline">{goal.progress}%</Badge>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-gray-600">Current: {goal.current}</span>
                        <span className="text-sm text-gray-600">Target: {goal.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Add New Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-preferences">
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    AI Assistant Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>AI Communication Tone</Label>
                    <div className="mt-2 mb-4">
                      <Slider
                        value={aiTone}
                        onValueChange={setAiTone}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Direct & Concise</span>
                        <span>Supportive & Detailed</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Current: {aiTone[0] < 30 ? 'Direct' : aiTone[0] < 70 ? 'Balanced' : 'Supportive'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="aiName">AI Assistant Name</Label>
                    <Input 
                      id="aiName" 
                      defaultValue={profile?.assistant_name || 'AI Coach'} 
                      placeholder="Give your AI assistant a name"
                    />
                  </div>

                  <div>
                    <Label>Coaching Focus Areas</Label>
                    <div className="mt-2 space-y-2">
                      {['Objection Handling', 'Discovery Questions', 'Closing Techniques', 'Prospecting'].map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <Switch id={area} />
                          <Label htmlFor={area}>{area}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive AI nudges and reminders</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Call Recording</Label>
                    <p className="text-sm text-gray-600">Automatically record calls for AI analysis</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Sharing</Label>
                    <p className="text-sm text-gray-600">Share anonymized data to improve AI</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8">
          <Button size="lg" className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
