
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface SalesModelStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const SalesModelStep: React.FC<SalesModelStepProps> = ({ settings, updateSettings }) => {
  const salesModels = [
    { id: 'inbound', label: 'Inbound Sales', description: 'Customers contact you first' },
    { id: 'outbound', label: 'Outbound Sales', description: 'Your team contacts potential customers' },
    { id: 'self_service', label: 'Self-Service', description: 'Customers buy without sales rep assistance' },
    { id: 'inside_sales', label: 'Inside Sales', description: 'Remote sales transactions' },
    { id: 'field_sales', label: 'Field Sales', description: 'In-person sales meetings' },
    { id: 'channel', label: 'Channel Sales', description: 'Sales via third-party partners' },
    { id: 'consultative', label: 'Consultative Sales', description: 'Problem-solving approach focused on needs' },
    { id: 'enterprise', label: 'Enterprise Sales', description: 'Large deals with multiple stakeholders' },
  ];

  const toggleSalesModel = (id: string) => {
    const updatedModels = settings.sales_model?.includes(id)
      ? settings.sales_model.filter((item: string) => item !== id)
      : [...(settings.sales_model || []), id];
    
    updateSettings({ sales_model: updatedModels });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">How do you sell?</h1>
        <p className="text-muted-foreground">
          Select all the sales methods that apply to your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salesModels.map((model) => (
          <div 
            key={model.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
              settings.sales_model?.includes(model.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
            onClick={() => toggleSalesModel(model.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={settings.sales_model?.includes(model.id)} 
                onCheckedChange={() => toggleSalesModel(model.id)}
                id={`model-${model.id}`}
                className="mt-1"
              />
              <div>
                <Label 
                  htmlFor={`model-${model.id}`}
                  className="font-medium cursor-pointer"
                >
                  {model.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {model.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {settings.sales_model?.length === 0 && (
        <p className="text-amber-500 text-sm mt-4">
          Please select at least one sales model to continue
        </p>
      )}
    </div>
  );
};

export default SalesModelStep;
