import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell';
function Location() { return <output>{useLocation().search}</output>; }
describe('global search', () => {
  it('submits a conversational query from the shared header', async () => {
    render(<MemoryRouter><AppShell><Location /></AppShell></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText('Search what you want to draw, paint or learn…'), 'watercolor portrait{Enter}');
    expect(screen.getByText('?q=watercolor+portrait')).toBeInTheDocument();
  });
});

import { afterEach, vi } from 'vitest';
afterEach(() => vi.unstubAllGlobals());
it('supports arrow selection and Escape, and tolerates corrupt recent searches', async () => {
  vi.stubGlobal('localStorage', {getItem: () => '{"bad":true}', setItem: vi.fn(), removeItem: vi.fn()});
  render(<MemoryRouter><AppShell><Location /></AppShell></MemoryRouter>);
  const input = screen.getByRole('combobox', {name: 'Search Atelier'});
  await userEvent.click(input);
  expect(screen.getByText('Suggested For You')).toBeInTheDocument();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  await userEvent.type(input, 'portrait');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(screen.getByText('?q=Portrait+references')).toBeInTheDocument();
});
it('reflects the URL query when opening search directly', () => {
  render(<MemoryRouter initialEntries={['/search?q=skin+tones']}><AppShell><Location /></AppShell></MemoryRouter>);
  expect(screen.getByRole('combobox', {name: 'Search Atelier'})).toHaveValue('skin tones');
});
