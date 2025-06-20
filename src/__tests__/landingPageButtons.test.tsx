
import { afterEach } from "vitest"
import { cleanup, render, fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, it, expect } from "vitest";
//@vitest-environment jsdom
import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import NewLandingPage from '@/pages/NewLandingPage';

const Wrapper = () => {
  const location = useLocation();
  return (
    <>
      <div data-testid="location">{location.pathname}</div>
      <Routes>
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="/auth" element={<div>Auth</div>} />
      </Routes>
    </>
  );
};

afterEach(() => {
  cleanup();
});

describe('Landing page auth buttons', () => {
  it('Sign In navigates to /auth', async () => {
    render(
      <MemoryRouter initialEntries={["/landing"]}>
        <Wrapper />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/auth');
    });
  });

  it('Get Early Access navigates to /auth', async () => {
    render(
      <MemoryRouter initialEntries={["/landing"]}>
        <Wrapper />
      </MemoryRouter>
    );
    const btn = screen.getAllByRole('button', { name: /get early access/i })[0];
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/auth');
    });
  });
});
