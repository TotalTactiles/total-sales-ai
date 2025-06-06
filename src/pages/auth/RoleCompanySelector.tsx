import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

interface Option {
  role: Role;
  company_id: string;
  company_name?: string;
}

const RoleCompanySelector: React.FC = () => {
  const { user, setLastSelectedRole, setLastSelectedCompanyId } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_company_roles')
        .select('role, company_id, company:company_id(name)')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching role/company options', error);
        return;
      }
      if (data && Array.isArray(data)) {
        const opts = data.map((d: any) => ({
          role: d.role as Role,
          company_id: d.company_id,
          company_name: d.company?.name || d.company_name || d.company_id,
        }));
        setOptions(opts);
        if (opts.length === 1) {
          handleSelect(opts[0]);
        }
      }
    };
    fetchOptions();
  }, [user]);

  const handleSelect = (opt: Option) => {
    setLastSelectedRole(opt.role);
    setLastSelectedCompanyId(opt.company_id);
    const url = getDashboardUrl({ role: opt.role });
    navigate(url, { replace: true });
  };

  if (options.length <= 1) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/80 dark:from-dark dark:to-dark/90">
      <Card className="max-w-md w-full p-6 space-y-4">
        <CardHeader>
          <CardTitle>Select Company & Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {options.map((o) => (
            <Button key={`${o.company_id}-${o.role}`} className="w-full" onClick={() => handleSelect(o)}>
              {o.company_name} – {o.role.replace('_', ' ')}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleCompanySelector;
