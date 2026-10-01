const API_BASE = 'http://localhost:5000/api/ai';

function getAuthHeaders() {
  const token = localStorage.getItem('devspace-token') || localStorage.getItem('devspace_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function sendAIChatApi({ messages, activeCode, language, activeFileName, projectContext, model, promptType }) {
  const savedModel = localStorage.getItem('devspace_groq_model');
  const finalModel = model || savedModel || 'qwen/qwen3.8-27b';

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      messages,
      activeCode,
      language,
      activeFileName,
      projectContext,
      model: finalModel,
      promptType
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to communicate with Groq AI Assistant.');
  }

  return data;
}

export async function sendInlineAICompletionApi({ prompt, selectedCode, activeCode, language, fileName, model }) {
  const savedModel = localStorage.getItem('devspace_groq_model');
  const finalModel = model || savedModel || 'qwen/qwen3.8-27b';

  const res = await fetch(`${API_BASE}/inline`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      prompt,
      selectedCode,
      activeCode,
      language,
      fileName,
      model: finalModel
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Inline AI processing failed.');
  }

  return data;
}

export async function checkAIStatusApi() {
  try {
    const res = await fetch(`${API_BASE}/status`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return { hasServerKey: false };
    return await res.json();
  } catch (err) {
    return { hasServerKey: false };
  }
}

export function setStoredGroqModel(model) {
  if (model) {
    localStorage.setItem('devspace_groq_model', model);
  }
}

export function getStoredGroqModel() {
  return localStorage.getItem('devspace_groq_model') || 'qwen/qwen3.8-27b';
}
