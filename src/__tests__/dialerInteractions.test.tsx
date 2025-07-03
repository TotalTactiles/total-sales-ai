
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Dialer from '@/pages/Dialer';

// Mock the hooks
vi.mock('@/hooks/useLeads', () => ({
  useLeads: () => ({
    leads: [],
    isLoading: false,
    error: null
  })
}));

vi.mock('@/hooks/useMockData', () => ({
  useMockData: () => ({
    leads: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-123-4567',
        company: 'TechCorp',
        status: 'new',
        priority: 'high',
        source: 'Website',
        score: 72,
        conversionLikelihood: 86,
        lastContact: '2025-06-28T10:00:00Z',
        speedToLead: 12,
        tags: ['enterprise'],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-07-01T15:20:00Z',
        companyId: 'demo-company',
        isSensitive: false,
        value: 64589,
        lastActivity: 'Called 2 days ago',
        aiPriority: 'High',
        nextAction: 'Follow up with email by Friday',
        lastAIInsight: 'Proposal opened twice, but no reply – follow up recommended'
      }
    ]
  })
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    }
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

describe('Dialer Interactions', () => {
  test('renders dialer interface', () => {
    render(
      <TestWrapper>
        <Dialer />
      </TestWrapper>
    );
    
    // Check if dialer interface loads
    expect(screen.getByText(/dialer/i)).toBeInTheDocument();
  });

  test('displays lead information when available', () => {
    render(
      <TestWrapper>
        <Dialer />
      </TestWrapper>
    );
    
    // Should display mock lead data
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});
