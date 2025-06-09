import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { AuthProvider, useAuth } from '@/contexts/auth/AuthContext'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null })
    }
  }
}))

const createMockStorage = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length
    }
  }
}

beforeAll(() => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  ;(global as any).window = dom.window as any
  ;(global as any).document = dom.window.document
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
})

beforeEach(() => {
  // fresh mock storages before each test
  Object.defineProperty(global, 'localStorage', { value: createMockStorage(), configurable: true })
  Object.defineProperty(global, 'sessionStorage', { value: createMockStorage(), configurable: true })
})

afterEach(() => {
  vi.clearAllMocks()
  ;(global as any).localStorage.clear()
  ;(global as any).sessionStorage.clear()
})

describe('signOut routing', () => {
  it('clears storage after signOut', async () => {
    localStorage.setItem('foo', 'bar')
    sessionStorage.setItem('baz', 'qux')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signOut()
    })

    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
  })
})
