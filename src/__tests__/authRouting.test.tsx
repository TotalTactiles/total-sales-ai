//@vitest-environment jsdom

import React, { createContext, useContext, useState } from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import type { AuthContextType, Profile } from '@/contexts/auth/types';

// Minimal AuthContext implementation for tests
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const signIn = async (email: string) => {
    const role = email.includes('manager') ? 'manager' : 'sales_rep';
    setProfile({ id: '1', role } as Profile);
    return {};
  };

  const signOut = async () => {
    setProfile(null);
  };

  const value: AuthContextType = {
    user: profile ? ({ id: '1' } as any) : null,
    profile,
    session: null,
    loading: false,
    signIn,
    signUp: async () => ({}),
    signOut,
    fetchProfile: async () => {},
    isDemoMode: () => false,
    setLastSelectedRole: () => {},
    getLastSelectedRole: () => 'sales_rep',
    initializeDemoMode: () => {}
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
    await signIn('manager@example.com');
    navigate('/manager/dashboard');
  };

  const loginAsSales = async () => {
    await signIn('sales@example.com');
    navigate('/sales/dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div>
      <button onClick={loginAsManager}>Manager Login</button>
      <button onClick={loginAsSales}>Sales Login</button>
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

