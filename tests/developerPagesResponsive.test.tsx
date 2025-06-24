import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ profile: { id: '1', role: 'developer' } })
}))
import { describe, it, beforeEach, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'

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

describe.skip('developer pages small viewport render', () => {
  beforeEach(() => {
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))
  })

  pages.forEach(({ component: Component, title }) => {
    it(`renders ${title}`, () => {
      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      )
      expect(screen.getAllByText(title).length).toBeGreaterThan(0)
    })
  })
})
