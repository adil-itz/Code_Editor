const SHARE_API = 'http://localhost:5000/api/share';

function getAuthHeaders() {
  const token = localStorage.getItem('devspace-token') || localStorage.getItem('devspace_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function createShareLinkApi(shareData) {
  const res = await fetch(SHARE_API, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(shareData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create share link');
  }
  return res.json();
}

export async function fetchSharedSnippetApi(shareId) {
  const res = await fetch(`${SHARE_API}/${shareId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Shared code snippet not found');
  }
  return res.json();
}
