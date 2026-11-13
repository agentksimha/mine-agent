import { apiJson } from './api';

export interface ChatSessionSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  messages: StoredMessage[];
}

export const getChatResponse = (message: string, sessionId: string | null) =>
  apiJson<{ response: string; session_id: string }>('/query', {
    method: 'POST',
    body: JSON.stringify({ query: message, session_id: sessionId }),
  });

export const listChatSessions = async () => {
  const data = await apiJson<{ sessions: ChatSessionSummary[] }>('/sessions');
  return data.sessions;
};

export const createChatSession = () =>
  apiJson<{ session_id: string; title: string }>('/sessions', {
    method: 'POST',
    body: JSON.stringify({ title: 'New chat' }),
  });

export const loadChatSession = (sessionId: string) =>
  apiJson<ChatSession>(`/sessions/${encodeURIComponent(sessionId)}`);

export const renameChatSession = (sessionId: string, title: string) =>
  apiJson<{ ok: boolean }>(`/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });

export const deleteChatSession = (sessionId: string) =>
  apiJson<{ ok: boolean }>(`/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  });
