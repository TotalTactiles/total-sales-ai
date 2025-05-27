
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const PersonalSetup: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    updateOnboardingData({
      personalInfo: {
        ...onboardingData.personalInfo,
        [field]: value
      }
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateOnboardingData({
          personalInfo: {
            ...onboardingData.personalInfo,
            photo: e.target?.result as string
          }
        });
        setIsUploading(false);
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <p className="text-gray-600">
          Complete your profile to get started
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={onboardingData.personalInfo?.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="John"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={onboardingData.personalInfo?.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Doe"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              value={onboardingData.personalInfo?.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label>Profile Photo</Label>
          <div className="mt-1 flex items-center gap-4">
            {onboardingData.personalInfo?.photo ? (
              <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden">
                <img
                  src={onboardingData.personalInfo.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
            
            <div>
              <Button
                variant="outline"
                disabled={isUploading}
                className="relative"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
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

      {onboardingData.personalInfo?.firstName && onboardingData.personalInfo?.lastName && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            Welcome, {onboardingData.personalInfo.firstName}! Your profile is looking great.
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalSetup;
