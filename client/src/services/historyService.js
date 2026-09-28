const HISTORY_API = 'http://localhost:5000/api/execute/history';

function getAuthHeaders() {
  const token = localStorage.getItem('devspace-token') || localStorage.getItem('devspace_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function fetchExecutionHistoryApi() {
  try {
    const res = await fetch(HISTORY_API, { headers: getAuthHeaders() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch execution history');
    }
    return await res.json();
  } catch (err) {
    const local = localStorage.getItem('devspace_execution_history');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  }
}

export function saveLocalExecutionHistory(item) {
  try {
    const existing = JSON.parse(localStorage.getItem('devspace_execution_history') || '[]');
    const updated = [item, ...existing].slice(0, 50);
    localStorage.setItem('devspace_execution_history', JSON.stringify(updated));
  } catch (e) {}
}
