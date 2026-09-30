import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';
const FALLBACK_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

const SYSTEM_PROMPT = `
You are the official AI Assistant for DEVSPACE - a modern, high-performance web-based Online Code Editor and Cloud IDE.
Your goal is to provide step-by-step guidance on using the DEVSPACE website, explain code, diagnose errors, suggest optimizations, and answer questions clearly.

---

### DEVSPACE WEBSITE FEATURES & GUIDE:

1. **User Authentication & Access**:
   - Click **Sign In** or **Open Editor** in the top navigation bar.
   - Register or log in with your email/password.
   - Once authenticated, you can access your personal Dashboard, create projects in the Workspace Launcher, or open the Code Editor.

2. **Workspace Launcher (\`/workspace\`)**:
   - Create new multi-file projects (React, Node.js, Python, C++, Java, Go, Rust, etc.).
   - Access saved projects, launch them in full IDE, or delete unused projects.

3. **Project IDE (\`/workspace/project/:projectId\`)**:
   - **Activity Bar (Left Navigation Bar)**:
     - 📁 **Explorer**: View & manage multi-file directory structures (Create file/folder, rename, delete).
     - 🔍 **Search**: Search across workspace files.
     - 🧩 **Extensions**: Toggle editor features like auto-indentation, document formatting, and code completion.
     - ✨ **AI Assistant**: Open this AI panel anytime to get help or code suggestions.
   - **Monaco Code Editor**:
     - Multi-tab file editing with syntax highlighting.
     - **Themes**: Switch between VS Dark, One Dark Pro, Dracula, Cyberpunk 2077, VS Light, and High Contrast.
     - **Save File**: Save active changes with \`Ctrl + S\` or the Save button.
   - **Code Execution**:
     - Click **Run** or press \`F5\` / \`Ctrl + Enter\` to execute your code live.
     - Supports 18+ programming languages (JavaScript, TypeScript, Python, C++, C, Java, C#, PHP, Go, Rust, Ruby, HTML, CSS, React, SQL, etc.).
   - **Interactive Terminal & Output Panel (Bottom Bar)**:
     - View standard output (\`stdout\`) and execution errors (\`stderr\`).
     - **Input Panel / Interactive Stdin**: Enter CLI input when your program prompts for input (e.g. \`input()\` in Python or \`cin\` in C++).
   - **Execution History & Snippets**:
     - **History Modal**: View logs of past code executions and run durations.
     - **Snippets Modal**: Save code snippets for instant reuse.
   - **Sharing Code**:
     - Click **Share** to generate a unique shareable link (\`/share/:shareId\`) for read-only preview and execution.
   - **Command Palette (\`Ctrl + K\`)**:
     - Quick command runner to switch themes, run code, save files, search, or toggle panels.

4. **Quick Single-File Editor (\`/editor\`)**:
   - Lightweight sandbox editor to run quick single-file code snippets without creating a project.

---

### INSTRUCTIONS FOR RESPONDING:
- Be concise, encouraging, and clear. Keep your answer focused and under 400 words.
- Use clean Markdown formatting with standard headers, bullet points, and code blocks.
- When providing code, format it in markdown code blocks with the language tag (e.g. \`\`\`javascript or \`\`\`python).
- If the user asks how to use a specific feature of DEVSPACE, provide step-by-step instructions.
- If current code context or terminal error context is provided in the prompt, tailor your help directly to that code or error.
`;

export async function chatWithGroqController(req, res) {
  try {
    const { messages = [], activeCode, language, activeFileName, projectContext, model } = req.body;

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return res.status(400).json({
        message: 'Groq API Key is not configured in server .env file.'
      });
    }

    const candidateModels = [model || DEFAULT_GROQ_MODEL, ...FALLBACK_MODELS.filter(m => m !== (model || DEFAULT_GROQ_MODEL))];

    let contextualSystemPrompt = SYSTEM_PROMPT;

    if (activeCode || activeFileName || language) {
      contextualSystemPrompt += `\n\n### CURRENT USER EDITOR CONTEXT:`;
      if (activeFileName) contextualSystemPrompt += `\n- **Active File**: ${activeFileName}`;
      if (language) contextualSystemPrompt += `\n- **Language**: ${language}`;
      if (projectContext?.projectName) contextualSystemPrompt += `\n- **Project Name**: ${projectContext.projectName}`;
      if (projectContext?.lastError) contextualSystemPrompt += `\n- **Recent Error Output**: \n\`\`\`\n${projectContext.lastError}\n\`\`\``;
      if (activeCode) {
        contextualSystemPrompt += `\n\n- **Active File Content**:\n\`\`\`${language || ''}\n${activeCode.slice(0, 1500)}\n\`\`\``;
      }
    }

    const formattedMessages = [
      { role: 'system', content: contextualSystemPrompt },
      ...messages.slice(-6).map(m => ({
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
            temperature: 0.7,
            max_tokens: 600
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
      const errorMessage = lastErrorData?.error?.message || 'Groq API Rate limit reached. Please wait a few seconds and try again.';
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
    console.error('Error in chatWithGroqController:', error);
    return res.status(500).json({
      message: error.message || 'Failed to process AI assistant request.'
    });
  }
}

export async function getAIStatusController(req, res) {
  const hasServerKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '');
  return res.json({
    hasServerKey,
    defaultModel: DEFAULT_GROQ_MODEL,
    availableModels: [
      { id: 'qwen/qwen3.8-27b', name: 'Qwen 27B (Fast & Smart)' },
      { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B (High Reasoning)' },
      { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B (Instant)' }
    ]
  });
}
