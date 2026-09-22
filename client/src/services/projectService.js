const API_BASE = 'http://localhost:5000/api/v1/projects';

function getAuthHeaders() {
  const token = localStorage.getItem('devspace-token') || localStorage.getItem('devspace_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function fetchUserProjects() {
  const res = await fetch(API_BASE, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProjectDetails(id) {
  const res = await fetch(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch project details');
  return res.json();
}

export async function createProjectApi(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create project');
  }
  return res.json();
}

export async function updateProjectApi(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProjectApi(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

export async function fetchProjectFiles(projectId) {
  const res = await fetch(`${API_BASE}/${projectId}/files`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch files');
  return res.json();
}

export async function createFileApi(projectId, data) {
  const res = await fetch(`${API_BASE}/${projectId}/files`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create file');
  return res.json();
}

export async function updateFileApi(fileId, data) {
  const res = await fetch(`${API_BASE}/files/${fileId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update file');
  return res.json();
}

export async function deleteFileApi(fileId) {
  const res = await fetch(`${API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete file');
  return res.json();
}

export async function createFolderApi(projectId, data) {
  const res = await fetch(`${API_BASE}/${projectId}/folders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create folder');
  return res.json();
}

export async function deleteFolderApi(folderId) {
  const res = await fetch(`${API_BASE}/folders/${folderId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete folder');
  return res.json();
}

export async function executeCodeApi(payload) {
  const token = localStorage.getItem('devspace-token') || localStorage.getItem('devspace_auth_token');
  const safePayload = {
    ...payload,
    stdin: typeof payload?.stdin === 'string' ? payload.stdin : ''
  };
  const res = await fetch('http://localhost:5000/api/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(safePayload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Execution API call failed');
  }
  return res.json();
}
