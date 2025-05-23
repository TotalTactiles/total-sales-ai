
// This file re-exports from the refactored auth context for backward compatibility
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthContextType, Profile, Role } from './auth/types';

export { AuthProvider, useAuth };
export type { AuthContextType, Profile, Role };
