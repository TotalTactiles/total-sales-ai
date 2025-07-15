
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  User, 
  Brain, 
  Building2, 
  Mail, 
  Phone,
  Save
} from 'lucide-react';

const ManagerSettings: React.FC = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    assistant_name: profile?.assistant_name || 'AI Assistant',
    voice_style: profile?.voice_style || 'professional',
    industry: profile?.industry || '',
    management_style: profile?.management_style || '',
    team_size: profile?.team_size || '',
    business_goal: profile?.business_goal || '',
  });

  const handleSave = async () => {
    try {
      // TODO: Implement save to Supabase
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="management_style">Management Style</Label>
              <Select
                value={formData.management_style}
                onValueChange={(value) => setFormData(prev => ({ ...prev, management_style: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your management style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                  <SelectItem value="directive">Directive</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="delegating">Delegating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                type="number"
                value={formData.team_size}
                onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                placeholder="Number of team members"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="assistant_name">Assistant Name</Label>
              <Input
                id="assistant_name"
                value={formData.assistant_name}
                onChange={(e) => setFormData(prev => ({ ...prev, assistant_name: e.target.value }))}
                placeholder="AI Assistant"
              />
            </div>

            <div>
              <Label htmlFor="voice_style">Voice Style</Label>
              <Select
                value={formData.voice_style}
                onValueChange={(value) => setFormData(prev => ({ ...prev, voice_style: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="supportive">Supportive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="business_goal">Primary Business Goal</Label>
              <Textarea
                id="business_goal"
                value={formData.business_goal}
                onChange={(e) => setFormData(prev => ({ ...prev, business_goal: e.target.value }))}
                placeholder="Describe your main business objectives..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company ID</Label>
                <Input value={profile?.company_id || ''} disabled />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={profile?.role || ''} disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerSettings;
