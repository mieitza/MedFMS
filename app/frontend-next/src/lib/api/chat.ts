import { api } from './client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  toolsUsed: string[];
}

export interface ChatHealthResponse {
  available: boolean;
  provider: string;
  model: string;
  error?: string;
}

export interface ChatConfigResponse {
  provider: string;
  model: string;
  baseUrl: string;
}

export interface ChatTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface StreamEvent {
  type: 'tool_start' | 'tool_end' | 'content' | 'done' | 'error';
  content?: string;
  tools?: string[];
  error?: string;
}

export const chatApi = {
  // Check LLM service health
  getHealth: async (): Promise<ChatHealthResponse> => {
    return api.get<ChatHealthResponse>('/chat/health');
  },

  // Get LLM configuration (admin only)
  getConfig: async (): Promise<ChatConfigResponse> => {
    return api.get<ChatConfigResponse>('/chat/config');
  },

  // Send chat message (non-streaming)
  sendMessage: async (messages: ChatMessage[]): Promise<ChatResponse> => {
    return api.post<ChatResponse>('/chat', { messages, stream: false });
  },

  // Get available tools
  getTools: async (): Promise<ChatTool[]> => {
    return api.get<ChatTool[]>('/chat/tools');
  },

  // Test a specific tool (admin only)
  testTool: async (name: string, args: Record<string, unknown>): Promise<unknown> => {
    return api.post<unknown>(`/chat/tools/${name}/test`, args);
  },

  // Stream chat message
  streamMessage: async (
    messages: ChatMessage[],
    onEvent: (event: StreamEvent) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages, stream: true }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);

          try {
            const event = JSON.parse(data) as StreamEvent;
            onEvent(event);
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  },
};
