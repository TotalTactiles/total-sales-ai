import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Eye, User, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const RetentionActions: React.FC = () => {
  const customers = [
    {
      id: 'cust-001',
      name: 'Acme Corp',
      riskLevel: 'High',
      phone: '+1-555-0123',
      lastContact: '2024-01-10',
      revenue: '$25,000',
      status: 'At Risk'
    },
    {
      id: 'cust-002',
      name: 'TechStart Inc',
      riskLevel: 'Medium',
      phone: '+1-555-0456',
      lastContact: '2024-01-12',
      revenue: '$15,000',
      status: 'Stable'
    },
    {
      id: 'cust-003',
      name: 'GlobalSoft Ltd',
      riskLevel: 'Low',
      phone: '+1-555-0789',
      lastContact: '2024-01-15',
      revenue: '$45,000',
      status: 'Growing'
    }
  ];

  const handleCall = (customer: any) => {
    // Trigger native call or "Send to Phone" action
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = `tel:${customer.phone}`;
    } else {
      toast.success(`Sending ${customer.name} call request to your phone: ${customer.phone}`);
    }
  };

  const handleViewDetails = (customer: any) => {
    // Keep current functioning lead profile view
    toast.success(`Opening ${customer.name} profile view`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'At Risk': return 'bg-red-100 text-red-800';
      case 'Stable': return 'bg-blue-100 text-blue-800';
      case 'Growing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">High Risk</p>
                <p className="text-2xl font-bold text-red-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Due for Contact</p>
                <p className="text-2xl font-bold text-yellow-900">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Growing</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{customer.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getRiskColor(customer.riskLevel)}>
                    {customer.riskLevel} Risk
                  </Badge>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold">{customer.revenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Contact</p>
                    <p className="font-semibold">{customer.lastContact}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{customer.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleCall(customer)}
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button 
                    onClick={() => handleViewDetails(customer)}
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RetentionActions;
