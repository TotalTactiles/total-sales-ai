//@vitest-environment jsdom

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import SalesLayout from '@/layouts/SalesLayout';

vi.mock('@/components/Navigation/ResponsiveNavigation', () => ({
  default: () => <div>nav</div>
}));

vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/components/UnifiedAI/UnifiedAIBubble', () => ({
  default: () => null
}));

vi.mock('@/pages/sales/Dashboard', () => ({ default: () => <div>dashboard</div> }));
vi.mock('@/pages/sales/Analytics', () => ({ default: () => <div>analytics</div> }));
vi.mock('@/pages/sales/LeadManagement', () => ({ default: () => <div>lead-mgmt</div> }));
vi.mock('@/pages/sales/Academy', () => ({ default: () => <div>academy</div> }));
vi.mock('@/pages/sales/AI', () => ({ default: () => <div>ai</div> }));
vi.mock('@/pages/sales/Settings', () => ({ default: () => <div>settings</div> }));
vi.mock('@/pages/sales/Dialer', () => ({ default: () => <div>dialer</div> }));

vi.mock('@/contexts/AIContext', () => ({
  useAIContext: () => ({
    currentLead: null,
    isCallActive: false,
    emailContext: null,
    smsContext: null
  })
}));

vi.mock('@/pages/LeadWorkspace', () => ({
  default: () => {
    const { id } = useParams();
    return <div data-testid="workspace">Lead {id}</div>;
  }
}));

describe('sales lead workspace routing', () => {
  it('renders workspace for provided lead id', async () => {
    render(
      <MemoryRouter initialEntries={["/sales/lead-workspace/test123"]}>
        <Routes>
          <Route path="/sales/*" element={<SalesLayout />} />
        </Routes>
      </MemoryRouter>
    );

    const workspace = await screen.findByTestId('workspace');
    expect(workspace.textContent).toContain('test123');
  });
});
