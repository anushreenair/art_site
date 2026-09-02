import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('Atelier application', () => {
  it('renders the artist practice start point', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /make a mark/i }),
    ).toBeInTheDocument();
  });

  it('changes the hero prompt when a practice mood is selected', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Loosen' }));
    expect(screen.getByText('Let the first lines stay visible.')).toBeInTheDocument();
  });

  it('lets an artist enter the studio from the three-chapter art story', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('dialog', { name: /the atelier story/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /every artist begins with a mark/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /children holding paintbrushes/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /enter atelier/i }));

    expect(screen.queryByRole('dialog', { name: /the atelier story/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /make a mark/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /gesture study of a resting figure/i })).toBeInTheDocument();
  });
});
