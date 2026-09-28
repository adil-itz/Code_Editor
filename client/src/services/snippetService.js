const SNIPPETS_API = 'http://localhost:5000/api/snippets';

function getAuthHeaders() {
  const token = localStorage.getItem('devspace-token') || localStorage.getItem('devspace_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function fetchSavedSnippetsApi() {
  try {
    const res = await fetch(SNIPPETS_API, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error('Failed to fetch snippets from server');
    }
    const data = await res.json();
    localStorage.setItem('devspace_user_snippets', JSON.stringify(data));
    return data;
  } catch (err) {
    const local = localStorage.getItem('devspace_user_snippets');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  }
}

export async function createSavedSnippetApi(snippetData) {
  try {
    const res = await fetch(SNIPPETS_API, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(snippetData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save snippet on server');
    }
    const newSnippet = await res.json();
    const existing = JSON.parse(localStorage.getItem('devspace_user_snippets') || '[]');
    localStorage.setItem('devspace_user_snippets', JSON.stringify([newSnippet, ...existing]));
    return newSnippet;
  } catch (err) {
    const fallbackSnippet = {
      id: Date.now().toString(),
      title: snippetData.title || 'Untitled Snippet',
      language: snippetData.language || 'javascript',
      code: snippetData.code || '',
      description: snippetData.description || '',
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('devspace_user_snippets') || '[]');
    const updated = [fallbackSnippet, ...existing];
    localStorage.setItem('devspace_user_snippets', JSON.stringify(updated));
    return fallbackSnippet;
  }
}

export async function deleteSavedSnippetApi(id) {
  try {
    await fetch(`${SNIPPETS_API}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (e) {}

  const existing = JSON.parse(localStorage.getItem('devspace_user_snippets') || '[]');
  const updated = existing.filter(s => s.id !== id && s._id !== id);
  localStorage.setItem('devspace_user_snippets', JSON.stringify(updated));
  return id;
}
