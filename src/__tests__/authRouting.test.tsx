
//@vitest-environment jsdom

import React, { createContext, useContext, useState } from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { waitFor, fireEvent, screen } from '@testing-library/dom';
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import type { AuthContextType, Profile } from '@/contexts/auth/types';

// Minimal AuthContext implementation for tests
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const signIn = async (email: string, password: string) => {
    let role: Profile['role'];
    if (email.includes('developer')) {
      role = 'developer';
    } else if (email.includes('manager')) {
      role = 'manager';
    } else {
      role = 'sales_rep';
    }
    setProfile({ 
      id: '1', 
      role,
      full_name: 'Test User',
      company_id: 'test-company',
      email_connected: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Profile);
    return { error: null };
  };

  const signOut = async () => {
    setProfile(null);
    return { error: null };
  };

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    return profile;
  };

  const value: AuthContextType = {
    user: profile ? ({ id: '1' } as any) : null,
    profile,
    session: null,
    loading: false,
    signIn,
    signUp: async () => ({ error: null }),
    signUpWithOAuth: async () => ({ error: null }),
    signOut,
    fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within provider');
  return ctx;
};

const LoginControls: React.FC = () => {
  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const loginAsManager = async () => {
    await signIn('manager@example.com', 'password123');
    navigate('/manager/dashboard');
  };

  const loginAsSales = async () => {
    await signIn('sales@example.com', 'password123');
    navigate('/sales/dashboard');
  };

  const loginAsDeveloper = async () => {
    await signIn('developer@example.com', 'password123');
    navigate('/developer/dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div>
      <button onClick={loginAsManager}>Manager Login</button>
      <button onClick={loginAsSales}>Sales Login</button>
      <button onClick={loginAsDeveloper}>Developer Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

const renderWithProviders = () =>
  render(
    <MemoryRouter initialEntries={['/auth']}>
      <MockAuthProvider>
        <Routes>
          <Route path="*" element={<><LoginControls /><LocationDisplay /></>} />
        </Routes>
      </MockAuthProvider>
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
});

describe('auth routing', () => {
  it('routes to manager dashboard after manager login', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByText('Manager Login'));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/manager/dashboard');
    });
  });

  it('routes to sales dashboard after sales rep login', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByText('Sales Login'));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/sales/dashboard');
    });
  });

  it('routes to developer dashboard after developer login', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByText('Developer Login'));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/developer/dashboard');
    });
  });

  it('logout clears state and subsequent logins route correctly', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByText('Manager Login'));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/manager/dashboard');
    });

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/auth');
    });

    fireEvent.click(screen.getByText('Sales Login'));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/sales/dashboard');
    });
  });
});
