
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Building, Globe } from 'lucide-react';
import { toast } from 'sonner';

const CompanySetup: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    updateOnboardingData({ [field]: value });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Convert to base64 for preview (in production, you'd upload to storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        updateOnboardingData({ companyLogo: e.target?.result as string });
        setIsUploading(false);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Company Information</h3>
        <p className="text-gray-600">
          Let's set up your company profile
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={onboardingData.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter your company name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website">Company Website</Label>
          <div className="relative mt-1">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="website"
              value={onboardingData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourcompany.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label>Company Logo</Label>
          <div className="mt-1 flex items-center gap-4">
            {onboardingData.companyLogo ? (
              <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden">
                <img
                  src={onboardingData.companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Building className="h-6 w-6 text-gray-400" />
              </div>
            )}
            
            <div>
              <Button
                variant="outline"
                disabled={isUploading}
                className="relative"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {onboardingData.companyName && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            Great! We'll help you build your SalesOS for {onboardingData.companyName}.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanySetup;
