export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessageInput {
  role: ChatMessageRole;
  content: string;
}

interface ChatResponse {
  message?: unknown;
}

const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const requestTimeoutMs = 25_000;

const genericError = 'The assistant is temporarily unavailable. Please try again shortly.';

export async function sendChatMessage(messages: ChatMessageInput[]): Promise<string> {
  const abortController = new AbortController();
  const timeout = window.setTimeout(() => abortController.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${apiBaseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('The assistant is receiving many requests. Please wait a moment and try again.');
      }
      throw new Error(genericError);
    }

    const data = await response.json() as ChatResponse;
    if (typeof data.message !== 'string' || !data.message.trim()) {
      throw new Error(genericError);
    }

    return data.message.trim();
  } catch (error) {
    if (error instanceof Error && error.message !== genericError && !error.name.includes('Abort')) {
      throw error;
    }
    throw new Error(genericError);
  } finally {
    window.clearTimeout(timeout);
  }
}