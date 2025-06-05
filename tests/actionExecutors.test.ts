import { describe, it, expect, vi, beforeEach } from 'vitest'
var mockInvoke: any
var mockInsert: any
var mockFrom: any
vi.mock('@/integrations/supabase/client', () => {
  mockInvoke = vi.fn()
  mockInsert = vi.fn()
  mockFrom = vi.fn(() => ({ insert: mockInsert }))
  return { supabase: { functions: { invoke: mockInvoke }, from: mockFrom } }
})
import { actionExecutors } from '@/services/ai/automation/actionExecutors'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('executeSmsAction', () => {
  it('sends sms when phone exists', async () => {
    mockInvoke.mockResolvedValue({ data: { messageId: 'sms1' }, error: null })
    const result = await actionExecutors.executeSmsAction(
      { id: '1', type: 'sms', content: 'Hello {{name}}' } as any,
      { phone: '+123', leadId: 'lead1', name: 'Bob' },
      'user1',
      'company1'
    )
    expect(mockInvoke).toHaveBeenCalledWith('twilio-sms', expect.any(Object))
    expect(result).toEqual({ success: true, message: 'SMS sent successfully', data: { messageId: 'sms1' } })
  })

  it('skips when no phone in context', async () => {
    const result = await actionExecutors.executeSmsAction(
      { id: '1', type: 'sms', content: 'Hi' } as any,
      { leadId: 'lead1' },
      'user1',
      'company1'
    )
    expect(mockInvoke).not.toHaveBeenCalled()
    expect(result).toEqual({ success: false, message: 'SMS action skipped: No phone number available' })
  })
})

describe('executeNoteAction', () => {
  it('adds note successfully', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const result = await actionExecutors.executeNoteAction(
      { id: 'n1', type: 'note', content: 'Note {{leadId}}' } as any,
      { leadId: 'lead1' },
      'user1',
      'company1'
    )
    expect(mockFrom).toHaveBeenCalledWith('ai_brain_logs')
    expect(mockInsert).toHaveBeenCalled()
    expect(result).toEqual({ success: true, message: 'Note added successfully' })
  })

  it('returns failure when insert errors', async () => {
    mockInsert.mockResolvedValue({ error: new Error('fail') })
    const result = await actionExecutors.executeNoteAction(
      { id: 'n1', type: 'note', content: 'fail' } as any,
      { leadId: 'lead1' },
      'user1',
      'company1'
    )
    expect(result.success).toBe(false)
    expect(result.message).toContain('fail')
  })
})

describe('executeCallAction', () => {
  it('creates call reminder when phone exists', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const result = await actionExecutors.executeCallAction(
      { id: 'c1', type: 'call', content: 'Call now' } as any,
      { phone: '+123', leadId: 'lead1', name: 'Bob' },
      'user1',
      'company1'
    )
    expect(mockFrom).toHaveBeenCalledWith('notifications')
    expect(mockInsert).toHaveBeenCalled()
    expect(result).toEqual({ success: true, message: 'Call reminder scheduled successfully' })
  })

  it('skips call when phone missing', async () => {
    const result = await actionExecutors.executeCallAction(
      { id: 'c1', type: 'call', content: 'Call now' } as any,
      { leadId: 'lead1' },
      'user1',
      'company1'
    )
    expect(mockFrom).not.toHaveBeenCalled()
    expect(result).toEqual({ success: false, message: 'Call action skipped: No phone number available' })
  })
})

describe('executeCalendarAction', () => {
  it('creates calendar event successfully', async () => {
    mockInvoke.mockResolvedValue({ data: { eventId: 'event1' }, error: null })
    const result = await actionExecutors.executeCalendarAction(
      { id: 'cal1', type: 'calendar', content: 'Meeting' } as any,
      { email: 'a@b.com' },
      'user1',
      'company1'
    )
    expect(mockInvoke).toHaveBeenCalledWith('google-calendar', expect.any(Object))
    expect(result).toEqual({ success: true, message: 'Calendar event created successfully', data: { eventId: 'event1' } })
  })

  it('handles calendar creation error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('boom') })
    const result = await actionExecutors.executeCalendarAction(
      { id: 'cal1', type: 'calendar', content: 'Meeting' } as any,
      { email: 'a@b.com' },
      'user1',
      'company1'
    )
    expect(result.success).toBe(false)
    expect(result.message).toContain('boom')
  })
})
