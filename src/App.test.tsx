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

});
