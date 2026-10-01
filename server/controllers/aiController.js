import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';
const FALLBACK_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

const SYSTEM_PROMPT = `
You are VS Code Copilot AI, powered by Groq API inside DEVSPACE Cloud IDE.
You are an expert AI pair programmer. Your task is to help the developer solve code doubts, fix bugs, optimize performance, refactor code, explain logic, and write production-grade code.

Follow these rules:
1. Always give direct, accurate, and concise answers without unnecessary fluff.
2. Format all code snippets in markdown code blocks with the appropriate programming language identifier (e.g., \`\`\`javascript, \`\`\`python, \`\`\`cpp).
3. If error output or diagnostics are provided, analyze the root cause and provide a clear fix with updated code.
4. When explaining code, keep it structured with clear bullet points.
5. If requested to write or refactor code, return complete, working code that can be inserted directly into the editor.
`;

export async function chatWithGroqController(req, res) {
  try {
    const { messages = [], activeCode, language, activeFileName, projectContext, model, promptType } = req.body;

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return res.status(400).json({
        message: 'Groq API Key is missing in server configuration.'
      });
    }

    const candidateModels = [model || DEFAULT_GROQ_MODEL, ...FALLBACK_MODELS.filter(m => m !== (model || DEFAULT_GROQ_MODEL))];

    let contextualSystemPrompt = SYSTEM_PROMPT;

    if (activeCode || activeFileName || language) {
      contextualSystemPrompt += `\n\n### ACTIVE EDITOR CONTEXT:`;
      if (activeFileName) contextualSystemPrompt += `\n- File Name: ${activeFileName}`;
      if (language) contextualSystemPrompt += `\n- Language: ${language}`;
      if (projectContext?.projectName) contextualSystemPrompt += `\n- Project Name: ${projectContext.projectName}`;
      if (projectContext?.lastError) contextualSystemPrompt += `\n- Error / Output:\n\`\`\`\n${projectContext.lastError}\n\`\`\``;
      if (activeCode) {
        contextualSystemPrompt += `\n\n- Active Code Content:\n\`\`\`${language || ''}\n${activeCode.slice(0, 4000)}\n\`\`\``;
      }
    }

    if (promptType === 'fix') {
      contextualSystemPrompt += `\n\nTask Focus: Diagnose the error in the active code and provide the complete fixed version of the code.`;
    } else if (promptType === 'explain') {
      contextualSystemPrompt += `\n\nTask Focus: Explain the active code step-by-step clearly and concisely.`;
    } else if (promptType === 'refactor') {
      contextualSystemPrompt += `\n\nTask Focus: Refactor the code for better performance, readability, and modern best practices.`;
    } else if (promptType === 'test') {
      contextualSystemPrompt += `\n\nTask Focus: Write comprehensive unit tests for the active code.`;
    }

    const formattedMessages = [
      { role: 'system', content: contextualSystemPrompt },
      ...messages.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    let lastErrorData = null;
    let successfulData = null;
    let modelUsed = candidateModels[0];

    for (const currentModel of candidateModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: currentModel,
            messages: formattedMessages,
            temperature: 0.5,
            max_tokens: 1200
          })
        });

        const data = await response.json();

        if (response.ok && data?.choices?.[0]?.message?.content) {
          successfulData = data;
          modelUsed = currentModel;
          break;
        } else {
          lastErrorData = data;
        }
      } catch (err) {
        lastErrorData = { error: { message: err.message } };
      }
    }

    if (!successfulData) {
      const errorMessage = lastErrorData?.error?.message || 'Groq API rate limit or error occurred. Please try again.';
      return res.status(429).json({
        message: errorMessage,
        details: lastErrorData?.error
      });
    }

    const replyMessage = successfulData.choices[0].message.content;

    return res.json({
      message: replyMessage,
      model: modelUsed,
      usage: successfulData?.usage
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to process Copilot AI request.'
    });
  }
}

export async function inlineGroqController(req, res) {
  try {
    const { prompt, selectedCode, activeCode, language, fileName, model } = req.body;
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return res.status(400).json({ message: 'Groq API Key missing.' });
    }

    const targetModel = model || DEFAULT_GROQ_MODEL;

    const systemPrompt = `You are VS Code Inline Copilot. You receive a code snippet or full file code and an instruction.
Your response MUST be ONLY the updated/generated code block without extra markdown explanation or conversational filler, so it can directly replace code in editor.`;

    const userPrompt = `Language: ${language || 'javascript'}
File: ${fileName || 'untitled'}
User Instruction: ${prompt}

Code Context:
\`\`\`${language || ''}
${selectedCode || activeCode || ''}
\`\`\``;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    if (!response.ok || !data?.choices?.[0]?.message?.content) {
      return res.status(500).json({ message: data?.error?.message || 'Inline AI completion failed.' });
    }

    let codeOutput = data.choices[0].message.content.trim();
    if (codeOutput.startsWith('```')) {
      codeOutput = codeOutput.replace(/^```[a-zA-Z0-9_-]*\n/, '').replace(/\n```$/, '');
    }

    return res.json({
      code: codeOutput,
      model: targetModel
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Inline AI processing failed.' });
  }
}

export async function getAIStatusController(req, res) {
  const hasServerKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '');
  return res.json({
    hasServerKey,
    defaultModel: DEFAULT_GROQ_MODEL,
    availableModels: [
      { id: 'qwen/qwen3.8-27b', name: 'Groq Qwen 27B (Fast & Smart)' },
      { id: 'openai/gpt-oss-120b', name: 'Groq GPT OSS 120B (High Reasoning)' },
      { id: 'openai/gpt-oss-20b', name: 'Groq GPT OSS 20B (Instant)' }
    ]
  });
}
