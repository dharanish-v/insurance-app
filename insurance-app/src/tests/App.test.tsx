import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, Mock, vi } from 'vitest';
import App from '../App';

vi.mock('../App.css', () => ({})); // Mock CSS imports

describe('App Component', () => {
  it('renders the title', () => {
    render(<App />);
    expect(screen.getByText('Insurance Policies')).toBeInTheDocument();
  });

  it('renders filters and table', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Premium')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Premium')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Coverage')).toBeInTheDocument();
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
    expect(screen.getByText('Sort by Premium')).toBeInTheDocument();
  });

  it('displays loading state', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as Mock;

    render(<App />);
    expect(screen.getByText('Loading policies...')).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.reject(new Error('Failed to fetch policies'))
    ) as Mock;

    render(<App />);
    expect(await screen.findByText('Failed to fetch policies')).toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search by name');
    const resetButton = screen.getByText('Reset Filters');

    fireEvent.change(searchInput, { target: { value: 'Test' } });
    expect(searchInput).toHaveValue('Test');

    fireEvent.click(resetButton);
    expect(searchInput).toHaveValue('');
  });
});