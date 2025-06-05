import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AuthPage from '@/pages/Auth';
import type { AuthContextType, Profile } from '@/contexts/auth/types';

// Mock the auth context to control auth state in tests
let mockAuth: AuthContextType;
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('role based routing', () => {
  const renderWithRouter = (initialPath: string) => {
    const history = createMemoryHistory({ initialEntries: [initialPath] });
    const view = render(
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/sales/dashboard" element={<div>Sales Dashboard</div>} />
          <Route path="/manager/dashboard" element={<div>Manager Dashboard</div>} />
        </Routes>
      </HistoryRouter>
    );
    return { history, ...view };
  };

  it('Sales users redirect to /sales/dashboard', async () => {
    mockAuth = {
      user: { id: '1' } as any,
      profile: { id: '1', role: 'sales_rep' } as Profile,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      fetchProfile: vi.fn(),
      isDemoMode: () => false,
      setLastSelectedRole: vi.fn(),
      getLastSelectedRole: () => 'sales_rep',
      initializeDemoMode: vi.fn(),
    };

    const { history } = renderWithRouter('/auth');
    await screen.findByText('Sales Dashboard');
    expect(history.location.pathname).toBe('/sales/dashboard');
  });

  it('Manager users redirect to /manager/dashboard', async () => {
    mockAuth = {
      user: { id: '2' } as any,
      profile: { id: '2', role: 'manager' } as Profile,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      fetchProfile: vi.fn(),
      isDemoMode: () => false,
      setLastSelectedRole: vi.fn(),
      getLastSelectedRole: () => 'manager',
      initializeDemoMode: vi.fn(),
    };

    const { history } = renderWithRouter('/auth');
    await screen.findByText('Manager Dashboard');
    expect(history.location.pathname).toBe('/manager/dashboard');
  });

  it('Logging out clears session and allows login as another role', async () => {
    // start as sales user
    mockAuth = {
      user: { id: '1' } as any,
      profile: { id: '1', role: 'sales_rep' } as Profile,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn().mockImplementation(async () => {
        mockAuth = { ...mockAuth, user: null, profile: null };
        localStorage.clear();
        sessionStorage.clear();
      }),
      fetchProfile: vi.fn(),
      isDemoMode: () => false,
      setLastSelectedRole: vi.fn(),
      getLastSelectedRole: () => 'sales_rep',
      initializeDemoMode: vi.fn(),
    };

    const { history, rerender } = renderWithRouter('/auth');
    await screen.findByText('Sales Dashboard');
    localStorage.setItem('foo', 'bar');

    // simulate logout
    await mockAuth.signOut();
    expect(localStorage.length).toBe(0);
    history.push('/auth');

    // login as manager now
    mockAuth = {
      ...mockAuth,
      user: { id: '2' } as any,
      profile: { id: '2', role: 'manager' } as Profile,
    };
    rerender(
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/sales/dashboard" element={<div>Sales Dashboard</div>} />
          <Route path="/manager/dashboard" element={<div>Manager Dashboard</div>} />
        </Routes>
      </HistoryRouter>
    );
    await screen.findByText('Manager Dashboard');
    expect(history.location.pathname).toBe('/manager/dashboard');
  });
});
