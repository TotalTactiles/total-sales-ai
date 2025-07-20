
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BusinessOpsToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolType: string;
  toolTitle: string;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

const BusinessOpsToolModal: React.FC<BusinessOpsToolModalProps> = ({
  isOpen,
  onClose,
  toolType,
  toolTitle
}) => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewData, setPreviewData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getFormFields = (type: string): FormField[] => {
    switch (type) {
      case 'revenue-projection':
        return [
          { name: 'currentRevenue', label: 'Current Monthly Revenue ($)', type: 'number', required: true },
          { name: 'growthRate', label: 'Expected Growth Rate (%)', type: 'number', required: true },
          { name: 'timeframe', label: 'Projection Timeframe (months)', type: 'number', required: true },
          { name: 'marketFactors', label: 'Market Factors', type: 'textarea' }
        ];
      case 'cost-analysis':
        return [
          { name: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', required: true },
          { name: 'variableCosts', label: 'Variable Cost per Unit ($)', type: 'number', required: true },
          { name: 'volume', label: 'Production Volume', type: 'number', required: true },
          { name: 'category', label: 'Cost Category', type: 'select', options: ['Operations', 'Marketing', 'Sales', 'Development'] }
        ];
      case 'roi-calculator':
        return [
          { name: 'investment', label: 'Initial Investment ($)', type: 'number', required: true },
          { name: 'returns', label: 'Expected Returns ($)', type: 'number', required: true },
          { name: 'timeframe', label: 'Investment Period (years)', type: 'number', required: true },
          { name: 'riskLevel', label: 'Risk Level', type: 'select', options: ['Low', 'Medium', 'High'] }
        ];
      case 'market-analysis':
        return [
          { name: 'marketSize', label: 'Total Market Size ($)', type: 'number', required: true },
          { name: 'targetSegment', label: 'Target Market Segment', type: 'text', required: true },
          { name: 'competitors', label: 'Number of Competitors', type: 'number', required: true },
          { name: 'growthRate', label: 'Market Growth Rate (%)', type: 'number' }
        ];
      case 'budget-planner':
        return [
          { name: 'totalBudget', label: 'Total Budget ($)', type: 'number', required: true },
          { name: 'timeframe', label: 'Budget Period', type: 'select', options: ['Monthly', 'Quarterly', 'Annual'], required: true },
          { name: 'priorities', label: 'Business Priorities', type: 'textarea' }
        ];
      case 'performance-metrics':
        return [
          { name: 'kpiType', label: 'KPI Type', type: 'select', options: ['Revenue', 'Conversion Rate', 'Customer Acquisition', 'Retention Rate'], required: true },
          { name: 'currentValue', label: 'Current Value', type: 'number', required: true },
          { name: 'targetValue', label: 'Target Value', type: 'number', required: true },
          { name: 'timeframe', label: 'Measurement Period', type: 'select', options: ['Weekly', 'Monthly', 'Quarterly'] }
        ];
      default:
        return [];
    }
  };

  const formFields = getFormFields(toolType);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePreview = async () => {
    if (!user || !profile) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('business-ops-tools', {
        body: {
          toolType,
          fields: formData,
          userId: user.id,
          companyId: profile.company_id
        }
      });

      if (error) throw error;
      setPreviewData(data.previewData);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
    if (!user || !profile || !previewData) return;

    setIsGeneratingPDF(true);
    try {
      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/business-ops-tools/generate-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            toolType,
            fields: formData,
            userId: user.id,
            companyId: profile.company_id
          })
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${toolType}-report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setPreviewData(null);
    }
  }, [isOpen, toolType]);

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <Input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  const renderPreviewData = () => {
    if (!previewData) return null;

    return (
      <div className="space-y-4">
        {Object.entries(previewData).map(([key, value]) => (
          <div key={key} className="border-b pb-2">
            <div className="font-medium text-sm text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-lg font-semibold">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{toolTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderFormField(field)}
                </div>
              ))}
              
              <Button
                onClick={generatePreview}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Generate Preview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview Results</CardTitle>
            </CardHeader>
            <CardContent>
              {previewData ? (
                <div className="space-y-4">
                  {renderPreviewData()}
                  
                  <Button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF Report
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Fill in the form and click "Generate Preview" to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessOpsToolModal;
