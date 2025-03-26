import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock fetch to simulate API responses
const mockPolicies = [
  {
    id: 1,
    name: "Secure Future Term Life",
    type: "Term Life",
    premium: 5000,
    coverage: 1000000
  },
  {
    id: 2,
    name: "Health Shield Plan",
    type: "Health",
    premium: 3000,
    coverage: 500000
  }
];

describe('Insurance Policies App', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    globalThis.fetch = vi.fn() as Mock;
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Insurance Policies')).toBeInTheDocument();
  });

  it('displays all filter inputs', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Premium')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Premium')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Coverage')).toBeInTheDocument();
  });

  it('fetches and displays policies', async () => {
    // Mock successful fetch
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPolicies)
    });

    render(<App />);

    // Wait for policies to be loaded
    await waitFor(() => {
      expect(screen.getByText('Secure Future Term Life')).toBeInTheDocument();
      expect(screen.getByText('Health Shield Plan')).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    // Mock fetch to return filtered results
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockPolicies[0]])
    });

    render(<App />);

    // Find search input and type
    const searchInput = screen.getByPlaceholderText('Search by name');
    fireEvent.change(searchInput, { target: { value: 'Secure' } });

    // Wait for fetch and verify filtered result
    await waitFor(() => {
      expect(screen.getByText('Secure Future Term Life')).toBeInTheDocument();
      expect(screen.queryByText('Health Shield Plan')).not.toBeInTheDocument();
    });
  });

  it('handles filter by policy type', async () => {
    // Mock fetch to return filtered results
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockPolicies[1]])
    });

    render(<App />);

    // Find and change policy type
    const policyTypeSelect = screen.getByLabelText('Filter by policy type');
    fireEvent.change(policyTypeSelect, { target: { value: 'Health' } });

    // Wait for fetch and verify filtered result
    await waitFor(() => {
      expect(screen.getByText('Health Shield Plan')).toBeInTheDocument();
      expect(screen.queryByText('Secure Future Term Life')).not.toBeInTheDocument();
    });
  });

  it('displays loading state', async () => {
    // Create a promise that resolves slowly to show loading state
    const slowFetch = new Promise((resolve) => {
      setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve(mockPolicies)
      }), 100);
    });
    
    (globalThis.fetch as Mock).mockImplementationOnce(() => slowFetch);

    render(<App />);

    // Check loading state
    expect(screen.getByText('Loading policies...')).toBeInTheDocument();

    // Wait for policies to load
    await waitFor(() => {
      expect(screen.getByText('Secure Future Term Life')).toBeInTheDocument();
      expect(screen.queryByText('Loading policies...')).not.toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    // Mock fetch error
    (globalThis.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch policies')).toBeInTheDocument();
    });
  });

  it('resets filters', async () => {
    // Mock initial and reset fetch
    (globalThis.fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPolicies[0]])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPolicies)
      });

    render(<App />);

    // First, filter to reduce results
    const searchInput = screen.getByPlaceholderText('Search by name');
    fireEvent.change(searchInput, { target: { value: 'Secure' } });

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText('Secure Future Term Life')).toBeInTheDocument();
      expect(screen.queryByText('Health Shield Plan')).not.toBeInTheDocument();
    });

    // Reset filters
    const resetButton = screen.getByLabelText('Reset filters');
    fireEvent.click(resetButton);

    // Wait for all policies to be shown again
    await waitFor(() => {
      expect(screen.getByText('Secure Future Term Life')).toBeInTheDocument();
      expect(screen.getByText('Health Shield Plan')).toBeInTheDocument();
    });
  });
});