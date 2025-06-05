import { describe, it, expect } from 'vitest';
import { getDashboardUrl } from '../src/components/Navigation/navigationUtils';

const managerProfile = { role: 'manager' } as any;
const salesProfile = { role: 'sales_rep' } as any;
const adminProfile = { role: 'admin' } as any;

describe('getDashboardUrl', () => {
  it('returns manager dashboard for manager role', () => {
    expect(getDashboardUrl(managerProfile)).toBe('/manager/dashboard');
  });

  it('returns sales dashboard for sales rep role', () => {
    expect(getDashboardUrl(salesProfile)).toBe('/sales/dashboard');
  });

  it('treats admin role as manager dashboard', () => {
    expect(getDashboardUrl(adminProfile)).toBe('/manager/dashboard');
  });

  it('defaults to sales dashboard when profile is null', () => {
    expect(getDashboardUrl(null)).toBe('/sales/dashboard');
  });
});
