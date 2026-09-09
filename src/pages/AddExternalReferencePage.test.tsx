import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { App } from '../App';

const open = (path = '/references/add') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const storage = new Map<string, string>();
beforeEach(() => {
  storage.clear();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  } });
});
afterEach(() => vi.restoreAllMocks());

describe('Add External Reference — Step A', () => {
  it('opens from Explore and saves corrected metadata across a remount', async () => {
    const user = userEvent.setup();
    const view = open('/explore');
    await user.click(screen.getByRole('link', { name: /\+ Add External Reference/i }));
    expect(screen.getByRole('heading', { name: 'Add an External Reference' })).toBeVisible();
    await user.type(screen.getByLabelText('Paste URL'), 'https://www.pinterest.com/pin/123456789/');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    expect(await screen.findByText(/placeholder preview/i)).toBeVisible();
    await user.clear(screen.getByLabelText('Reference Title'));
    await user.type(screen.getByLabelText('Reference Title'), 'Side-light portrait');
    await user.type(screen.getByLabelText('Creator Name'), 'Jane Smith');
    await user.type(screen.getByLabelText('Description / Notes'), 'Study the edge of the shadow.');
    await user.click(screen.getByRole('button', { name: 'Save Reference' }));
    expect(screen.getByRole('heading', { name: 'Reference added to your studio.' })).toBeVisible();
    view.unmount();
    open('/references/saved');
    const card = screen.getByRole('article', { name: 'Side-light portrait' });
    expect(within(card).getByText('Reference by Jane Smith')).toBeVisible();
    expect(within(card).getByText('Rights Unknown')).toBeVisible();
    expect(within(card).getByText('Private')).toBeVisible();
    expect(within(card).getByRole('link', { name: /View Original/i })).toHaveAttribute('href', 'https://www.pinterest.com/pin/123456789/');
    expect(within(card).getByRole('link', { name: /View Original/i })).toHaveAttribute('target', '_blank');
  });
  it('requires only a public source URL and can add another without stale metadata', async () => {
    const user = userEvent.setup();
    open();
    await user.type(screen.getByLabelText('Paste URL'), 'http://example.com/artwork');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    await screen.findByLabelText('Reference Title');
    await user.clear(screen.getByLabelText('Reference Title'));
    await user.click(screen.getByRole('button', { name: 'Save Reference' }));
    expect(screen.getByRole('heading', { name: 'Reference added to your studio.' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Add Another' }));
    expect(screen.getByLabelText('Paste URL')).toHaveValue('');
    expect(screen.queryByLabelText('Creator Name')).not.toBeInTheDocument();
  });
  it('rejects private URLs and allows correction without network requests', async () => {
    const network = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();
    open();
    await user.type(screen.getByLabelText('Paste URL'), 'http://127.0.0.1/secrets');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid public URL.');
    expect(screen.queryByRole('button', { name: 'Save Reference' })).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText('Paste URL'));
    await user.type(screen.getByLabelText('Paste URL'), 'https://instagram.com/p/abcd/');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    expect(await screen.findByLabelText('Source Platform')).toHaveValue('Instagram');
    expect(network).not.toHaveBeenCalled();
  });
  it('keeps the draft if browser storage fails', async () => {
    const user = userEvent.setup();
    open();
    await user.type(screen.getByLabelText('Paste URL'), 'https://example.com/artwork');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    await screen.findByLabelText('Reference Title');
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => { throw new Error('Quota exceeded'); });
    await user.click(screen.getByRole('button', { name: 'Save Reference' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/could not save/i);
    expect(screen.getByLabelText('Original Source URL')).toHaveValue('https://example.com/artwork');
    expect(screen.queryByRole('heading', { name: 'Reference added to your studio.' })).not.toBeInTheDocument();
  });
  it('cancels without persisting a draft', async () => {
    const user = userEvent.setup();
    open();
    await user.type(screen.getByLabelText('Paste URL'), 'https://example.com/artwork');
    await user.click(screen.getByRole('link', { name: 'Cancel' }));
    expect(screen.getByRole('heading', { name: /find the study/i })).toBeVisible();
    expect(storage.size).toBe(0);
  });
  it('clears attribution when the user changes sources', async () => {
    const user = userEvent.setup();
    open();
    await user.type(screen.getByLabelText('Paste URL'), 'https://pinterest.com/pin/1');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    await user.type(await screen.findByLabelText('Creator Name'), 'First creator');
    await user.click(screen.getByRole('button', { name: 'Change source' }));
    await user.clear(screen.getByLabelText('Paste URL'));
    await user.type(screen.getByLabelText('Paste URL'), 'https://behance.net/gallery/2');
    await user.click(screen.getByRole('button', { name: 'Fetch Reference' }));
    expect(await screen.findByLabelText('Creator Name')).toHaveValue('');
    expect(screen.getByLabelText('Source Platform')).toHaveValue('Behance');
    expect(screen.getByLabelText('Original Source URL')).toHaveValue('https://behance.net/gallery/2');
  });
});
