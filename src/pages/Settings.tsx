
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  MessageSquare, 
  Volume2, 
  Shield, 
  Bell, 
  User, 
  Layout, 
  Headphones
} from 'lucide-react';

const Settings = () => {
  // State for various settings
  const [aiVoice, setAiVoice] = useState("professional");
  const [focusMode, setFocusMode] = useState(false);
  const [complianceMode, setComplianceMode] = useState(true);
  const [autoTranscripts, setAutoTranscripts] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-salesBlue flex items-center">
              <SettingsIcon className="mr-2 h-7 w-7" />
              Settings
            </h1>
            <p className="text-slate-500">Customize your Sales OS experience</p>
          </div>
          
          <Tabs defaultValue="ai" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="interface">Interface</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant Preferences</CardTitle>
                  <CardDescription>
                    Customize how the AI assistant interacts with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ai-voice">AI Voice Tone</Label>
                      <Select value={aiVoice} onValueChange={setAiVoice}>
                        <SelectTrigger id="ai-voice" className="w-full">
                          <SelectValue placeholder="Select a voice style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly and Casual</SelectItem>
                          <SelectItem value="direct">Direct and Concise</SelectItem>
                          <SelectItem value="supportive">Supportive Coach</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-sm text-slate-500">
                        This affects how the AI phrases responses and suggestions
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="focus-mode">Focus Mode</Label>
                        <p className="text-sm text-slate-500">
                          Minimize distractions when on calls or preparing
                        </p>
                      </div>
                      <Switch 
                        id="focus-mode" 
                        checked={focusMode} 
                        onCheckedChange={setFocusMode} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-transcripts">Automatic Transcripts</Label>
                        <p className="text-sm text-slate-500">
                          Create and save transcripts for all calls
                        </p>
                      </div>
                      <Switch 
                        id="auto-transcripts" 
                        checked={autoTranscripts} 
                        onCheckedChange={setAutoTranscripts} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-prompts">Custom AI Prompts</Label>
                      <Textarea 
                        id="custom-prompts" 
                        placeholder="Enter custom prompts for your AI assistant to use..."
                        className="min-h-24"
                      />
                      <p className="mt-1 text-sm text-slate-500">
                        Add specific phrases or approaches you want your AI to use
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">AI Skills</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Real-time Coaching</div>
                            <div className="text-xs text-slate-500">Basic feedback during calls</div>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Enabled
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Volume2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Voice Analysis</div>
                            <div className="text-xs text-slate-500">Tone and pace feedback</div>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Enabled
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Headphones className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Call Summarization</div>
                            <div className="text-xs text-slate-500">Auto-generate call notes</div>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Enabled
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium">Advanced Sentiment Analysis</div>
                            <div className="text-xs text-slate-500">Detailed emotional tracking</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Control when and how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                      <p className="text-sm text-slate-500">
                        Master toggle for all system notifications
                      </p>
                    </div>
                    <Switch 
                      id="notifications-enabled" 
                      checked={notificationsEnabled} 
                      onCheckedChange={setNotificationsEnabled} 
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Notification Types</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Lead Updates</Label>
                          <p className="text-sm text-slate-500">
                            When leads are updated or new leads are assigned
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Calendar Reminders</Label>
                          <p className="text-sm text-slate-500">
                            Upcoming calls and meeting reminders
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Team Announcements</Label>
                          <p className="text-sm text-slate-500">
                            Important updates from management
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Achievement Alerts</Label>
                          <p className="text-sm text-slate-500">
                            When you earn badges or complete missions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Time Preferences</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                        <Input type="time" id="quiet-start" defaultValue="18:00" />
                      </div>
                      <div>
                        <Label htmlFor="quiet-end">Quiet Hours End</Label>
                        <Input type="time" id="quiet-end" defaultValue="08:00" />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Only critical notifications will be sent during quiet hours
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-effects">Notification Sounds</Label>
                      <p className="text-sm text-slate-500">
                        Play sounds for incoming notifications
                      </p>
                    </div>
                    <Switch 
                      id="sound-effects" 
                      checked={soundEffects} 
                      onCheckedChange={setSoundEffects} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interface" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interface Preferences</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your Sales OS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger id="theme" className="w-full">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dashboard-layout">Default Layout</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="dashboard-layout" className="w-full">
                        <SelectValue placeholder="Select a layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="expanded">Expanded</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-sm text-slate-500">
                      Changes how widgets are arranged on your dashboard
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">Interface Animations</Label>
                      <p className="text-sm text-slate-500">
                        Enable smooth transitions between screens
                      </p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Dashboard Configuration</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Layout className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-medium">LeadQueue Widget</div>
                          </div>
                        </div>
                        <Select defaultValue="visible">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visible">Visible</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Layout className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-medium">Performance Chart</div>
                          </div>
                        </div>
                        <Select defaultValue="visible">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visible">Visible</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Layout className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-medium">Game Progress</div>
                          </div>
                        </div>
                        <Select defaultValue="visible">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visible">Visible</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compliance" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Settings</CardTitle>
                  <CardDescription>
                    Configure call monitoring and compliance features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compliance-mode">Compliance Mode</Label>
                      <p className="text-sm text-slate-500">
                        Enforce regulatory compliance for calls and messages
                      </p>
                    </div>
                    <Switch 
                      id="compliance-mode" 
                      checked={complianceMode} 
                      onCheckedChange={setComplianceMode} 
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Compliance Information</h4>
                    <p className="text-sm text-blue-600 mb-2">
                      Compliance mode automatically ensures your calls follow regulatory guidelines:
                    </p>
                    <ul className="text-sm text-blue-600 list-disc pl-5 space-y-1">
                      <li>All calls are recorded with proper disclosures</li>
                      <li>Required compliance statements are added to communications</li>
                      <li>Real-time flagging of potential compliance issues</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Call Monitoring</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Call Recording</Label>
                          <p className="text-sm text-slate-500">
                            Automatically record all calls for training
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Disclosure Announcement</Label>
                          <p className="text-sm text-slate-500">
                            Play recording disclosure at call start
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Compliance Alerts</Label>
                          <p className="text-sm text-slate-500">
                            Real-time alerts for compliance issues
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Data Retention</h3>
                    
                    <div>
                      <Label htmlFor="retention-period">Call Data Retention</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="retention-period" className="w-full">
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-sm text-slate-500">
                        How long call recordings and transcripts are stored
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your personal account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Sam Smith</h3>
                      <p className="text-sm text-slate-500">Sales Representative</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Profile Picture
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue="Sam" />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue="Smith" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="sam.smith@example.com" />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Time Zone & Language</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select defaultValue="america_new_york">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america_new_york">Eastern Time (ET)</SelectItem>
                            <SelectItem value="america_chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="america_denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="america_los_angeles">Pacific Time (PT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Password</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
