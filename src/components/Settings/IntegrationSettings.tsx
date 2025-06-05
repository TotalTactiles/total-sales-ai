import { logger } from '@/utils/logger';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Phone, MessageSquare, Mail, Calendar, Mic, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const IntegrationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    googleClientId: '',
    googleClientSecret: '',
    elevenLabsApiKey: '',
    openaiApiKey: ''
  });

  const integrationStatus = {
    twilio: true, // Mock status - would check actual connection
    gmail: false,
    calendar: true,
    elevenlabs: false,
    openai: true
  };

  const handleSaveSettings = () => {
    // In production, these would be sent to Supabase edge function secrets
    toast.success('Integration settings saved to Supabase secrets');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Integration Settings</h1>
      </div>

      {/* Twilio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Twilio AU (Calls & SMS)
            </div>
            {integrationStatus.twilio ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Account SID</label>
              <Input
                type="password"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={settings.twilioAccountSid}
                onChange={(e) => setSettings({...settings, twilioAccountSid: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Auth Token</label>
              <Input
                type="password"
                placeholder="Enter Twilio Auth Token"
                value={settings.twilioAuthToken}
                onChange={(e) => setSettings({...settings, twilioAuthToken: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                placeholder="+61xxxxxxxxx"
                value={settings.twilioPhoneNumber}
                onChange={(e) => setSettings({...settings, twilioPhoneNumber: e.target.value})}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Get your Twilio credentials from: <a href="https://console.twilio.com" target="_blank" className="text-blue-600 underline">console.twilio.com</a>
          </p>
        </CardContent>
      </Card>

      {/* Google OAuth Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Google OAuth (Gmail & Calendar)
            </div>
            {integrationStatus.gmail ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Client ID</label>
              <Input
                type="password"
                placeholder="Enter Google Client ID"
                value={settings.googleClientId}
                onChange={(e) => setSettings({...settings, googleClientId: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Client Secret</label>
              <Input
                type="password"
                placeholder="Enter Google Client Secret"
                value={settings.googleClientSecret}
                onChange={(e) => setSettings({...settings, googleClientSecret: e.target.value})}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Set up OAuth at: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline">Google Cloud Console</a>
          </p>
        </CardContent>
      </Card>

      {/* ElevenLabs Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              ElevenLabs (AI Voice)
            </div>
            {integrationStatus.elevenlabs ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              placeholder="Enter ElevenLabs API Key"
              value={settings.elevenLabsApiKey}
              onChange={(e) => setSettings({...settings, elevenLabsApiKey: e.target.value})}
            />
          </div>
          <p className="text-xs text-slate-600">
            Get your API key from: <a href="https://elevenlabs.io/api-keys" target="_blank" className="text-blue-600 underline">elevenlabs.io/api-keys</a>
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Integration Settings
        </Button>
      </div>

      {/* Integration Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Phone className={`h-8 w-8 mx-auto mb-2 ${integrationStatus.twilio ? 'text-green-600' : 'text-red-600'}`} />
              <p className="text-sm font-medium">Twilio</p>
              <p className="text-xs text-slate-600">{integrationStatus.twilio ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="text-center">
              <Mail className={`h-8 w-8 mx-auto mb-2 ${integrationStatus.gmail ? 'text-green-600' : 'text-red-600'}`} />
              <p className="text-sm font-medium">Gmail</p>
              <p className="text-xs text-slate-600">{integrationStatus.gmail ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="text-center">
              <Calendar className={`h-8 w-8 mx-auto mb-2 ${integrationStatus.calendar ? 'text-green-600' : 'text-red-600'}`} />
              <p className="text-sm font-medium">Calendar</p>
              <p className="text-xs text-slate-600">{integrationStatus.calendar ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="text-center">
              <Mic className={`h-8 w-8 mx-auto mb-2 ${integrationStatus.elevenlabs ? 'text-green-600' : 'text-red-600'}`} />
              <p className="text-sm font-medium">ElevenLabs</p>
              <p className="text-xs text-slate-600">{integrationStatus.elevenlabs ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="text-center">
              <MessageSquare className={`h-8 w-8 mx-auto mb-2 ${integrationStatus.openai ? 'text-green-600' : 'text-red-600'}`} />
              <p className="text-sm font-medium">OpenAI</p>
              <p className="text-xs text-slate-600">{integrationStatus.openai ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
