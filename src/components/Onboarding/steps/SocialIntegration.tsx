
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SocialIntegration: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const handleSocialConnect = (platform: string, url: string) => {
    updateOnboardingData({
      socialAccounts: {
        ...onboardingData.socialAccounts,
        [platform]: url
      }
    });
  };

  const socialPlatforms = [
    { key: 'linkedin', name: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/yourcompany' },
    { key: 'facebook', name: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/yourcompany' },
    { key: 'instagram', name: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/yourcompany' },
    { key: 'twitter', name: 'Twitter/X', icon: '🐦', placeholder: 'https://twitter.com/yourcompany' },
    { key: 'tiktok', name: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@yourcompany' }
  ];

  const connectOAuth = (platform: string) => {
    toast.info(`OAuth integration for ${platform} will be available soon!`);
    // In production, this would initiate OAuth flow
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Link className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Connect Social Media</h3>
        <p className="text-gray-600">
          Link your social accounts to enhance AI insights and lead generation
        </p>
      </div>

      <div className="space-y-4">
        {socialPlatforms.map((platform) => (
          <Card key={platform.key} className="border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{platform.icon}</div>
                <div className="flex-1">
                  <Label htmlFor={platform.key} className="text-sm font-medium">
                    {platform.name}
                  </Label>
                  <Input
                    id={platform.key}
                    value={onboardingData.socialAccounts?.[platform.key as keyof typeof onboardingData.socialAccounts] || ''}
                    onChange={(e) => handleSocialConnect(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => connectOAuth(platform.name)}
                    className="text-xs"
                  >
                    Connect
                  </Button>
                  {onboardingData.socialAccounts?.[platform.key as keyof typeof onboardingData.socialAccounts] && (
                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Social media integration helps our AI understand your brand and find relevant leads.
          You can connect these accounts later in settings.
        </p>
      </div>
    </div>
  );
};

export default SocialIntegration;
