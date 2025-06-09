
// @vitest-environment jsdom
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import type { Lead } from '@/types/lead';

// Mocks for hooks used across tests. Implementations are replaced in each test.
let makeCallMock = vi.fn();
let sendSMSMock = vi.fn();
let sendEmailMock = vi.fn();

vi.mock('@/hooks/useIntegrations', () => ({
  useIntegrations: () => ({
    makeCall: makeCallMock,
    sendSMS: sendSMSMock,
    sendEmail: sendEmailMock,
    isLoading: false
  })
}));

let makeConversationalCallMock = vi.fn();
let getCallAnalysisMock = vi.fn();

vi.mock('@/hooks/useRetellAI', () => ({
  useRetellAI: () => ({
    makeConversationalCall: makeConversationalCallMock,
    getCallAnalysis: getCallAnalysisMock,
    isLoading: false,
    error: null
  })
}));

import LeadCallTab from '@/components/LeadWorkspace/tabs/LeadCallTab';
import CallInterface from '@/components/AutoDialer/CallInterface';
import DialerQueue from '@/components/AutoDialer/DialerQueue';

beforeEach(() => {
  makeCallMock = vi.fn().mockResolvedValue({ success: true });
  sendSMSMock = vi.fn().mockResolvedValue({ success: true });
  sendEmailMock = vi.fn().mockResolvedValue({ success: true });
  makeConversationalCallMock = vi.fn().mockResolvedValue({ success: true });
  getCallAnalysisMock = vi.fn().mockResolvedValue({});
});

afterEach(() => {
  vi.clearAllMocks();
});

const baseLead: Lead = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  company: 'Acme',
  status: 'new',
  priority: 'high',
  source: 'web',
  score: 90,
  conversionLikelihood: 80,
  lastContact: '',
  speedToLead: 5,
  tags: [],
  createdAt: '',
  updatedAt: '',
  companyId: 'c1',
  isSensitive: false
};

it('initiates call with correct parameters', () => {
  render(<LeadCallTab lead={baseLead} />);
  const btn = screen.getByRole('button', { name: /manual call/i });
  fireEvent.click(btn);
  expect(makeCallMock).toHaveBeenCalledWith(baseLead.phone, baseLead.id, baseLead.name);
});

it('sends SMS and email with proper parameters', async () => {
  render(
    <CallInterface
      lead={baseLead}
      callDuration={0}
      isMuted={false}
      onMuteToggle={() => {}}
      onCallOutcome={() => {}}
      aiAssistantActive={false}
    />
  );

  // SMS action
  fireEvent.click(screen.getByRole('button', { name: /^sms$/i }));
  const smsArea = screen.getByPlaceholderText('Type your SMS message...');
  fireEvent.change(smsArea, { target: { value: 'hello' } });
  fireEvent.click(screen.getByRole('button', { name: /send sms/i }));
  expect(sendSMSMock).toHaveBeenCalledWith(baseLead.phone, 'hello', baseLead.id, baseLead.name);

  // Email action
  fireEvent.click(screen.getByRole('button', { name: /^email$/i }));
  const emailArea = screen.getByPlaceholderText('Compose your follow-up email...');
  fireEvent.change(emailArea, { target: { value: 'hi there' } });
  fireEvent.click(screen.getByRole('button', { name: /send email/i }));
  expect(sendEmailMock).toHaveBeenCalledWith(
    baseLead.email,
    'Follow-up from our call',
    'hi there',
    baseLead.id,
    baseLead.name
  );
});

it('calls queue transition handler', () => {
  const move = vi.fn();
  render(
    <DialerQueue
      repQueue={[baseLead]}
      aiQueue={[]}
      currentLead={null}
      onMoveLeadBetweenQueues={move}
      onLeadSelect={() => {}}
    />
  );

  fireEvent.click(screen.getByTestId('move-to-ai'));
  expect(move).toHaveBeenCalledWith(baseLead.id, 'rep', 'ai');
});
