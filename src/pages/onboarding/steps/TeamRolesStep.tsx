
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TeamRolesStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const TeamRolesStep: React.FC<TeamRolesStepProps> = ({ settings, updateSettings }) => {
  const [customRole, setCustomRole] = React.useState('');
  
  const commonRoles = [
    { id: 'sdr', label: 'Sales Development Rep (SDR)', description: 'Prospecting and qualifying leads' },
    { id: 'bdr', label: 'Business Development Rep (BDR)', description: 'Generating new business opportunities' },
    { id: 'account_exec', label: 'Account Executive', description: 'Closing deals and managing accounts' },
    { id: 'account_manager', label: 'Account Manager', description: 'Maintaining client relationships' },
    { id: 'sales_manager', label: 'Sales Manager', description: 'Leading sales teams and strategies' },
    { id: 'sales_ops', label: 'Sales Operations', description: 'Optimizing sales processes and systems' },
    { id: 'presales', label: 'Pre-Sales / Solutions Engineer', description: 'Technical demonstrations and support' },
  ];

  const toggleTeamRole = (id: string) => {
    const updatedRoles = settings.team_roles?.includes(id)
      ? settings.team_roles.filter((item: string) => item !== id)
      : [...(settings.team_roles || []), id];
    
    updateSettings({ team_roles: updatedRoles });
  };

  const addCustomRole = () => {
    if (customRole.trim() && !settings.team_roles.includes(customRole.trim())) {
      updateSettings({
        team_roles: [...(settings.team_roles || []), customRole.trim()]
      });
      setCustomRole('');
    }
  };

  const removeRole = (role: string) => {
    updateSettings({
      team_roles: settings.team_roles.filter((r: string) => r !== role)
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Who's on your sales team?</h1>
        <p className="text-muted-foreground">
          Select the roles that make up your sales organization
        </p>
      </div>

      <div className="space-y-4">
        {commonRoles.map((role) => (
          <div 
            key={role.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
              settings.team_roles?.includes(role.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
            onClick={() => toggleTeamRole(role.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={settings.team_roles?.includes(role.id)} 
                onCheckedChange={() => toggleTeamRole(role.id)}
                id={`role-${role.id}`}
                className="mt-1"
              />
              <div>
                <Label 
                  htmlFor={`role-${role.id}`}
                  className="font-medium cursor-pointer"
                >
                  {role.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {role.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom roles section */}
      <div className="border-t pt-4 mt-6">
        <Label>Add Custom Roles</Label>
        
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Enter custom role"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomRole();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addCustomRole}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Custom role chips */}
        {settings.team_roles?.filter((role: string) => !commonRoles.map(r => r.id).includes(role)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {settings.team_roles
              .filter((role: string) => !commonRoles.map(r => r.id).includes(role))
              .map((role: string) => (
                <div 
                  key={role}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {role}
                  <button 
                    onClick={() => removeRole(role)}
                    className="ml-1 hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {settings.team_roles?.length === 0 && (
        <p className="text-amber-500 text-sm mt-4">
          Please select at least one team role to continue
        </p>
      )}
    </div>
  );
};

export default TeamRolesStep;
