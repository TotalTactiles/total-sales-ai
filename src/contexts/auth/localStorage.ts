
import { Role } from './types';

export const setLastSelectedRole = (role: Role): void => {
  localStorage.setItem('lastSelectedRole', role);
};

export const getLastSelectedRole = (): Role => {
  return (localStorage.getItem('lastSelectedRole') as Role) || 'sales_rep';
};

export const setLastSelectedCompanyId = (companyId: string): void => {
  localStorage.setItem('lastSelectedCompanyId', companyId);
};

export const getLastSelectedCompanyId = (): string | null => {
  return localStorage.getItem('lastSelectedCompanyId');
};
