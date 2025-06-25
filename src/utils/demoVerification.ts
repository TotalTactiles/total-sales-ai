
import { demoUsers, mockManagerLeads, mockSalesLeads, mockTSAMLogs, mockFeatureFlags } from '@/data/demo.mock.data';

export const verifyDemoSetup = () => {
  const results = {
    userCredentials: true,
    mockData: true,
    routing: true,
    errors: [] as string[]
  };

  // Verify demo users
  if (demoUsers.length !== 3) {
    results.userCredentials = false;
    results.errors.push('Demo users count mismatch');
  }

  // Verify mock data exists
  if (!mockManagerLeads.length || !mockSalesLeads.length || !mockTSAMLogs.length) {
    results.mockData = false;
    results.errors.push('Mock data missing or incomplete');
  }

  // Verify role separation
  const managerUser = demoUsers.find(u => u.role === 'manager');
  const salesUser = demoUsers.find(u => u.role === 'sales_rep');
  const devUser = demoUsers.find(u => u.role === 'developer');

  if (!managerUser || !salesUser || !devUser) {
    results.userCredentials = false;
    results.errors.push('Missing required demo user roles');
  }

  console.log('🧪 Demo Setup Verification:', results);
  return results;
};

export const logDemoLogin = (userRole: string, success: boolean) => {
  const timestamp = new Date().toISOString();
  console.log(`🎭 Demo Login [${timestamp}]:`, {
    role: userRole,
    success,
    tag: 'demo-seed-v1'
  });
};
