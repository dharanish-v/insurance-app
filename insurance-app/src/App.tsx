import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Define the Policy type
interface Policy {
  id: string;
  name: string;
  type: string;
  premium: number;
  coverage: number;
}

const POLICY_TYPES = ['', 'Term Life', 'Health', 'Vehicle'];

const App: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchName, setSearchName] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [minPremium, setMinPremium] = useState('');
  const [maxPremium, setMaxPremium] = useState('');
  const [minCoverage, setMinCoverage] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    const params = new URLSearchParams();
    
    if (searchName) params.append('name', searchName);
    if (policyType) params.append('type', policyType);
    if (minPremium) params.append('min_premium', minPremium);
    if (maxPremium) params.append('max_premium', maxPremium);
    if (minCoverage) params.append('min_coverage', minCoverage);
    if (sortOrder) params.append('sort', sortOrder);

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/api/policies?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch policies');
      }
      
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchName, policyType, minPremium, maxPremium, minCoverage, sortOrder]);



  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const resetFilters = () => {
    setSearchName('');
    setPolicyType('');
    setMinPremium('');
    setMaxPremium('');
    setMinCoverage('');
    setSortOrder('');
  };

  return (
    <div className="app">
      <h1>Insurance Policies</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          aria-label="Search policies"
        />

        <select 
          value={policyType} 
          onChange={(e) => setPolicyType(e.target.value)}
          aria-label="Filter by policy type"
        >
          {POLICY_TYPES.map(type => (
            <option key={type} value={type}>
              {type || 'All Policy Types'}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Premium"
          value={minPremium}
          onChange={(e) => setMinPremium(e.target.value)}
          aria-label="Minimum premium"
        />

        <input
          type="number"
          placeholder="Max Premium"
          value={maxPremium}
          onChange={(e) => setMaxPremium(e.target.value)}
          aria-label="Maximum premium"
        />

        <input
          type="number"
          placeholder="Min Coverage"
          value={minCoverage}
          onChange={(e) => setMinCoverage(e.target.value)}
          aria-label="Minimum coverage"
        />

        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          aria-label="Sort by premium"
        >
          <option value="">Sort by Premium</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button 
          onClick={resetFilters}
          aria-label="Reset filters"
        >
          Reset Filters
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading policies...
        </div>
      ) : policies.length === 0 ? (
        <div className="loading">No policies found.</div>
      ) : (
        <table aria-label="Insurance Policies">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Premium</th>
              <th>Coverage</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(policy => (
              <tr key={policy.id}>
                <td>{policy.name}</td>
                <td>{policy.type}</td>
                <td>${policy.premium.toLocaleString()}</td>
                <td>${policy.coverage.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;