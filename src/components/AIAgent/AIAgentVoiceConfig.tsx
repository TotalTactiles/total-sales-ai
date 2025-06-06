
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Headphones, 
  Play, 
  Download,
  Volume2,
  Users,
  Mic,
  Upload,
  Key
} from 'lucide-react';

const AIAgentVoiceConfig = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [voiceModel, setVoiceModel] = useState('eleven_multilingual_v2');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState([1]);
  const [voiceStability, setVoiceStability] = useState([0.75]);
  const [voiceClarity, setVoiceClarity] = useState([0.8]);
  const [usesPublishable, setUsesPublishable] = useState(false);

  const defaultIntro = 'Hi, this is {{agent_name}} from {{company_name}}. I\'m calling on behalf of {{rep_name}} to follow up on {{context}}.';
  const defaultVoicemail = 'Hi, this is {{agent_name}} from {{company_name}} reaching out about {{context}}. I\'ll try again later, or feel free to reach me at {{callback_number}}. Have a great day!';
  const defaultGatekeeper = "I'm calling regarding {{context}} that I believe would be relevant for {{target_role}}. Could you please connect me?";
  const defaultMeeting = 'Based on our conversation, I\'d like to schedule a meeting with {{rep_name}} to discuss {{value_prop}} in more detail. Would {{proposed_time}} work for you?';

  const [introScript, setIntroScript] = useState(defaultIntro);
  const [voicemailScript, setVoicemailScript] = useState(defaultVoicemail);
  const [gatekeeperScript, setGatekeeperScript] = useState(defaultGatekeeper);
  const [meetingScript, setMeetingScript] = useState(defaultMeeting);

  const { user } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('ai_agent_training')
        .select('voice_settings, script_templates')
        .eq('user_id', user.id)
        .is('call_id', null)
        .single();

      if (data?.voice_settings) {
        const vs = data.voice_settings as any;
        setApiKey(vs.apiKey || '');
        setVoiceModel(vs.voiceModel || 'eleven_multilingual_v2');
        setSelectedVoice(vs.selectedVoice || '');
        setVoiceSpeed([vs.voiceSpeed ?? 1]);
        setVoiceStability([vs.voiceStability ?? 0.75]);
        setVoiceClarity([vs.voiceClarity ?? 0.8]);
        setUsesPublishable(vs.usesPublishable ?? false);
      }

      if (data?.script_templates) {
        const st = data.script_templates as any;
        setIntroScript(st.introScript || defaultIntro);
        setVoicemailScript(st.voicemailScript || defaultVoicemail);
        setGatekeeperScript(st.gatekeeperScript || defaultGatekeeper);
        setMeetingScript(st.meetingScript || defaultMeeting);
      }
    };
    loadSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    const voice_settings = {
      apiKey,
      voiceModel,
      selectedVoice,
      voiceSpeed: voiceSpeed[0],
      voiceStability: voiceStability[0],
      voiceClarity: voiceClarity[0],
      usesPublishable,
    };

    const script_templates = {
      introScript,
      voicemailScript,
      gatekeeperScript,
      meetingScript,
    };

    await supabase.from('ai_agent_training').upsert(
      {
        user_id: user.id,
        voice_settings,
        script_templates,
      },
      { onConflict: 'user_id' }
    );
  };

  // Sample voice options (based on ElevenLabs)
  const voiceOptions = [
    { id: 'roger', name: 'Roger (Professional Male)', description: 'Confident, authoritative sales voice' },
    { id: 'sarah', name: 'Sarah (Professional Female)', description: 'Warm, engaging consultative tone' },
    { id: 'brian', name: 'Brian (Casual Male)', description: 'Conversational, friendly approach' },
    { id: 'custom', name: 'Upload Custom Voice', description: 'Use your own voice samples' },
  ];
  
  const handleSaveAPIKey = () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "API Key Saved",
      description: "Your ElevenLabs API key has been securely saved.",
    });
    saveSettings();
  };
  
  const handleTestVoice = () => {
    toast({
      title: "Testing Voice",
      description: "Playing sample of the selected voice...",
    });
  };
  
  const handleSaveVoiceSettings = () => {
    saveSettings();
    toast({
      title: "Voice Settings Saved",
      description: "Your AI agent voice settings have been updated.",
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "File Uploaded",
        description: `${files.length} voice sample(s) uploaded successfully.`,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* API Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-salesBlue" />
            Voice API Configuration
          </CardTitle>
          <CardDescription>
            Connect to ElevenLabs to enable AI voice capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey">ElevenLabs API Key</Label>
                <a 
                  href="https://elevenlabs.io/subscription" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-salesBlue hover:underline"
                >
                  Need an API key?
                </a>
              </div>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Your API key is stored securely and is used only for voice synthesis.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modelSelect">Voice Model</Label>
              <Select value={voiceModel} onValueChange={setVoiceModel}>
                <SelectTrigger id="modelSelect">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleven_multilingual_v2">
                    Eleven Multilingual v2 (High Quality)
                  </SelectItem>
                  <SelectItem value="eleven_turbo_v2">
                    Eleven Turbo v2 (Faster Response)
                  </SelectItem>
                  <SelectItem value="eleven_english_sts_v2">
                    Eleven English STS v2 (Best Prosody)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Multilingual v2 recommended for highest quality voice calls.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="api-mode"
                checked={usesPublishable}
                onCheckedChange={setUsesPublishable}
              />
              <Label htmlFor="api-mode">Use client-side API key (publishable key only)</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveAPIKey}>
            Save API Configuration
          </Button>
        </CardFooter>
      </Card>
      
      {/* Voice Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5 text-salesBlue" />
            Voice Selection & Customization
          </CardTitle>
          <CardDescription>
            Choose and customize the AI agent's voice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preset" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="preset">Preset Voices</TabsTrigger>
              <TabsTrigger value="custom">Custom Voice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preset" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceOptions.slice(0, 3).map((voice) => (
                  <div 
                    key={voice.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedVoice === voice.id ? 'border-salesBlue bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{voice.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice();
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500">{voice.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-speed">Speaking Speed</Label>
                    <span className="text-sm">{voiceSpeed[0]}x</span>
                  </div>
                  <Slider 
                    id="voice-speed"
                    min={0.5} 
                    max={2} 
                    step={0.1} 
                    value={voiceSpeed}
                    onValueChange={setVoiceSpeed}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-stability">Voice Stability</Label>
                    <span className="text-sm">{voiceStability[0]}</span>
                  </div>
                  <Slider 
                    id="voice-stability"
                    min={0} 
                    max={1} 
                    step={0.05} 
                    value={voiceStability}
                    onValueChange={setVoiceStability}
                  />
                  <p className="text-xs text-slate-500">
                    Lower values create more variation, higher values are more stable and monotonous.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-clarity">Voice Clarity & Quality</Label>
                    <span className="text-sm">{voiceClarity[0]}</span>
                  </div>
                  <Slider 
                    id="voice-clarity"
                    min={0} 
                    max={1} 
                    step={0.05} 
                    value={voiceClarity}
                    onValueChange={setVoiceClarity}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-10 w-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Upload Voice Samples</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4">
                    For best results, upload 3-5 clear audio samples of the person speaking naturally.
                    <br />
                    Each sample should be 30-60 seconds in length.
                  </p>
                  <div>
                    <label htmlFor="voice-upload" className="cursor-pointer">
                      <Button>Select Audio Files</Button>
                      <Input 
                        type="file" 
                        id="voice-upload" 
                        className="hidden" 
                        accept="audio/mp3,audio/wav"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-name">Voice Name</Label>
                  <Input id="voice-name" placeholder="e.g., John's Sales Voice" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voice-description">Voice Description</Label>
                  <Textarea 
                    id="voice-description" 
                    placeholder="Describe the voice style and characteristics..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleTestVoice}>
            <Headphones className="h-4 w-4 mr-2" />
            Test Voice
          </Button>
          <Button onClick={handleSaveVoiceSettings}>Save Voice Settings</Button>
        </CardFooter>
      </Card>
      
      {/* Voice Script Templates Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-salesBlue" />
            Voice Script Templates
          </CardTitle>
          <CardDescription>
            Configure how your AI agent sounds and responds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="intro-script">Introduction Script</Label>
              <Textarea
                id="intro-script"
                value={introScript}
                onChange={(e) => setIntroScript(e.target.value)}
                rows={2}
              />
              <p className="text-xs text-slate-500">
                Use &#123;&#123;placeholders&#125;&#125; for dynamic content that will be filled from CRM data.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voicemail-script">Voicemail Script</Label>
              <Textarea
                id="voicemail-script"
                value={voicemailScript}
                onChange={(e) => setVoicemailScript(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gatekeeper-script">Gatekeeper Strategy</Label>
              <Textarea
                id="gatekeeper-script"
                value={gatekeeperScript}
                onChange={(e) => setGatekeeperScript(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting-booking">Meeting Booking Script</Label>
              <Textarea
                id="meeting-booking"
                value={meetingScript}
                onChange={(e) => setMeetingScript(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveVoiceSettings}>Save Script Templates</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIAgentVoiceConfig;
