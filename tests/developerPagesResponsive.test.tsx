import React, { createContext, useContext } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { AuthContextType, Profile } from '@/contexts/auth/types'

import AIBrainLogs from '../src/pages/developer/AIBrainLogs'
import APILogs from '../src/pages/developer/APILogs'
import CRMIntegrations from '../src/pages/developer/CRMIntegrations'
import Dashboard from '../src/pages/developer/Dashboard'
import DeveloperDashboard from '../src/pages/developer/DeveloperDashboard'
import ErrorLogs from '../src/pages/developer/ErrorLogs'
import QAChecklist from '../src/pages/developer/QAChecklist'
import Settings from '../src/pages/developer/Settings'
import SystemMonitor from '../src/pages/developer/SystemMonitor'
import TestingSandbox from '../src/pages/developer/TestingSandbox'
import VersionControl from '../src/pages/developer/VersionControl'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: AuthContextType = {
    user: null,
    profile: { id: '1', role: 'developer' } as Profile,
    session: null,
    loading: false,
    signIn: async () => ({}),
    signUp: async () => ({}),
    signUpWithOAuth: async () => ({}),
    signOut: async () => {},
    fetchProfile: async () => null,
    isDemoMode: () => false,
    setLastSelectedRole: () => {},
    getLastSelectedRole: () => 'developer',
    setLastSelectedCompanyId: () => {},
    getLastSelectedCompanyId: () => null,
    initializeDemoMode: () => {}
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useMockAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: useMockAuth
}))

const pages = [
  { component: AIBrainLogs, title: 'AI Brain Logs' },
  { component: APILogs, title: 'API Logs' },
  { component: CRMIntegrations, title: 'CRM Integrations - Developer View' },
  { component: Dashboard, title: 'Developer Dashboard' },
  { component: DeveloperDashboard, title: 'Developer Dashboard' },
  { component: ErrorLogs, title: 'Error Logs' },
  { component: QAChecklist, title: 'QA Checklist' },
  { component: Settings, title: 'Developer Settings' },
  { component: SystemMonitor, title: 'System Monitor' },
  { component: TestingSandbox, title: 'Testing Sandbox' },
  { component: VersionControl, title: 'Version Control' },
]

describe('developer pages small viewport render', () => {
  beforeEach(() => {
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))
  })

  pages.forEach(({ component: Component, title }) => {
    it(`renders ${title}`, () => {
      render(
        <MockAuthProvider>
          <Component />
        </MockAuthProvider>
      )
      expect(screen.getAllByText(title).length).toBeGreaterThan(0)
    })
  })
})
