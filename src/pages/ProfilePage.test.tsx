import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ProfilePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: () => null,
      setItem: () => undefined,
    } });
  });

  it('shows the signed-in artist account instead of the demo profile', () => {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => key === 'atelier-auth-user' ? JSON.stringify({ id: 'user-1', name: 'Alex Rivera', email: 'alex@example.com' }) : null,
      setItem: () => undefined,
    } });
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Alex Rivera' })).toBeVisible();
    expect(screen.getByText('@alexrivera · Kochi, India')).toBeVisible();
  });

  it('shows an artist studio and lets the artist edit their profile', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Mira Sol' })).toBeVisible();
    expect(screen.getByText('Artwork completed')).toBeVisible();
    expect(screen.getByText('Portrait — Level 7')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Recent work' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    expect(screen.getByLabelText('Artist name')).toHaveValue('Mira Sol');
    await user.clear(screen.getByLabelText('Artist name'));
    await user.type(screen.getByLabelText('Artist name'), 'Mira Vale');
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(screen.getByRole('heading', { name: 'Mira Vale' })).toBeVisible();
  });

  it('restores saved profile edits when the page is opened again', () => {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => key === 'atelier-auth-user'
        ? JSON.stringify({ id: 'user-1', name: 'Alex Rivera', email: 'alex@example.com' })
        : key === 'atelier-profile'
          ? JSON.stringify({ ...initialProfileForTest, name: 'Alex Studio', bio: 'Making room for colour.' })
          : null,
      setItem: () => undefined,
    } });
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Alex Studio' })).toBeVisible();
    expect(screen.getByText('Making room for colour.')).toBeVisible();
  });
});

const initialProfileForTest = {
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=85',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  username: '@alexrivera',
  bio: 'Learning to catch the quiet shifts.',
  location: 'Kochi, India',
  medium: 'Watercolour',
  level: 'Intermediate',
  interests: 'Portraits',
  goals: 'Build confident portraits',
};

describe('inline profile editing', () => {
  const stored = new Map<string, string>();
  beforeEach(() => {
    stored.clear();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => { stored.set(key, value); },
    } });
  });

  it('edits in the original profile header and saves the learning goal', async () => {
    const user = userEvent.setup();
    const view = render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    const editor = screen.getByRole('form', { name: 'Artist profile' });
    expect(editor).toContainElement(screen.getByLabelText('Artist name'));
    expect(editor).toContainElement(screen.getByLabelText('Current learning goals'));
    expect(screen.queryByText('Your studio card')).not.toBeInTheDocument();
    expect(screen.queryByText('Artwork completed')).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText('Artist name'));
    await user.type(screen.getByLabelText('Artist name'), 'Mira Vale');
    await user.clear(screen.getByLabelText('Current learning goals'));
    await user.type(screen.getByLabelText('Current learning goals'), 'Practise confident brushwork');
    expect(stored.has('atelier-profile')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(screen.getByRole('heading', { name: 'Mira Vale' })).toBeVisible();
    expect(screen.getByText('Practise confident brushwork')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Profile saved.');
    expect(screen.getByText('Artwork completed')).toBeVisible();
    view.unmount();
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Mira Vale' })).toBeVisible();
    expect(screen.getByText('Practise confident brushwork')).toBeVisible();
  });

  it('discards unsaved edits on cancel and restores focus', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await user.clear(screen.getByLabelText('Artist name'));
    await user.type(screen.getByLabelText('Artist name'), 'Unsaved artist');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('heading', { name: 'Mira Sol' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Edit profile' })).toHaveFocus();
    expect(stored.has('atelier-profile')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    expect(screen.getByLabelText('Artist name')).toHaveValue('Mira Sol');
  });

  it('keeps the editor and draft visible if saving fails', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await user.clear(screen.getByLabelText('Artist name'));
    await user.type(screen.getByLabelText('Artist name'), 'Retry artist');
    window.localStorage.setItem = () => { throw new Error('Storage full'); };
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save your profile');
    expect(screen.getByLabelText('Artist name')).toHaveValue('Retry artist');
  });
});
