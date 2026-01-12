/**
 * LLM Service - Multi-provider support for Ollama, Groq, and OpenAI-compatible APIs
 * Settings are loaded from database, with fallback to environment variables
 */

import { logger } from '../utils/logger.js';
import { getDb } from '../db/index.js';
import { llmSettings } from '../db/schema/system.js';

// Types
export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Tool {
  type: 'function';
  function: {
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
  };
}

export interface ChatCompletionRequest {
  messages: Message[];
  tools?: Tool[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: 'stop' | 'tool_calls' | 'length';
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  choices: {
    index: number;
    delta: Partial<Message>;
    finish_reason: 'stop' | 'tool_calls' | 'length' | null;
  }[];
}

// Provider configuration
export type LLMProvider = 'ollama' | 'groq' | 'openai' | 'custom';

interface ProviderConfig {
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface DbSettings {
  activeProvider: string;
  ollamaBaseUrl: string | null;
  ollamaModel: string | null;
  groqApiKey: string | null;
  groqModel: string | null;
  openaiApiKey: string | null;
  openaiBaseUrl: string | null;
  openaiModel: string | null;
  customBaseUrl: string | null;
  customApiKey: string | null;
  customModel: string | null;
  temperature: number | null;
  maxTokens: number | null;
}

// Get provider configuration from database or environment
async function getProviderConfigFromDb(): Promise<{ provider: LLMProvider; config: ProviderConfig }> {
  let dbSettings: DbSettings | null = null;

  try {
    const db = getDb();
    const [settings] = await db.select().from(llmSettings).limit(1);
    dbSettings = settings as DbSettings | null;
  } catch (error) {
    logger.warn('Could not load LLM settings from database, using environment variables');
  }

  // Determine provider - database takes precedence over environment
  const provider = (dbSettings?.activeProvider || process.env.LLM_PROVIDER || 'ollama') as LLMProvider;
  const temperature = dbSettings?.temperature ?? parseFloat(process.env.LLM_TEMPERATURE || '0.7');
  const maxTokens = dbSettings?.maxTokens ?? parseInt(process.env.LLM_MAX_TOKENS || '2048');

  switch (provider) {
    case 'ollama':
      return {
        provider,
        config: {
          baseUrl: dbSettings?.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
          model: dbSettings?.ollamaModel || process.env.OLLAMA_MODEL || 'llama3.2',
          temperature,
          maxTokens,
        },
      };

    case 'groq':
      return {
        provider,
        config: {
          baseUrl: 'https://api.groq.com/openai/v1',
          apiKey: dbSettings?.groqApiKey || process.env.GROQ_API_KEY,
          model: dbSettings?.groqModel || process.env.GROQ_MODEL || 'llama3-groq-70b-8192-tool-use-preview',
          temperature,
          maxTokens,
        },
      };

    case 'openai':
      return {
        provider,
        config: {
          baseUrl: dbSettings?.openaiBaseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
          apiKey: dbSettings?.openaiApiKey || process.env.OPENAI_API_KEY,
          model: dbSettings?.openaiModel || process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature,
          maxTokens,
        },
      };

    case 'custom':
      return {
        provider,
        config: {
          baseUrl: dbSettings?.customBaseUrl || process.env.LLM_BASE_URL || 'http://localhost:8000/v1',
          apiKey: dbSettings?.customApiKey || process.env.LLM_API_KEY,
          model: dbSettings?.customModel || process.env.LLM_MODEL || 'default',
          temperature,
          maxTokens,
        },
      };

    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

// Synchronous version for initial load (falls back to env vars)
function getProviderConfigSync(): { provider: LLMProvider; config: ProviderConfig } {
  const provider = (process.env.LLM_PROVIDER || 'ollama') as LLMProvider;
  const temperature = parseFloat(process.env.LLM_TEMPERATURE || '0.7');
  const maxTokens = parseInt(process.env.LLM_MAX_TOKENS || '2048');

  switch (provider) {
    case 'ollama':
      return {
        provider,
        config: {
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
          model: process.env.OLLAMA_MODEL || 'llama3.2',
          temperature,
          maxTokens,
        },
      };

    case 'groq':
      return {
        provider,
        config: {
          baseUrl: 'https://api.groq.com/openai/v1',
          apiKey: process.env.GROQ_API_KEY,
          model: process.env.GROQ_MODEL || 'llama3-groq-70b-8192-tool-use-preview',
          temperature,
          maxTokens,
        },
      };

    case 'openai':
      return {
        provider,
        config: {
          baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature,
          maxTokens,
        },
      };

    case 'custom':
      return {
        provider,
        config: {
          baseUrl: process.env.LLM_BASE_URL || 'http://localhost:8000/v1',
          apiKey: process.env.LLM_API_KEY,
          model: process.env.LLM_MODEL || 'default',
          temperature,
          maxTokens,
        },
      };

    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

// LLM Service class
class LLMService {
  private provider: LLMProvider;
  private config: ProviderConfig;
  private initialized: boolean = false;

  constructor() {
    // Initial sync load from environment
    const { provider, config } = getProviderConfigSync();
    this.provider = provider;
    this.config = config;
    logger.info(`LLM Service initialized with provider: ${provider}, model: ${config.model}`);
  }

  // Reload configuration from database
  async reloadConfig(): Promise<void> {
    try {
      const { provider, config } = await getProviderConfigFromDb();
      this.provider = provider;
      this.config = config;
      this.initialized = true;
      logger.info(`LLM Service reloaded with provider: ${provider}, model: ${config.model}`);
    } catch (error) {
      logger.error('Failed to reload LLM config from database:', error);
    }
  }

  // Ensure config is loaded from database before operations
  private async ensureConfig(): Promise<void> {
    if (!this.initialized) {
      await this.reloadConfig();
    }
  }

  // Check if the LLM service is available
  async healthCheck(): Promise<{ available: boolean; provider: string; model: string; error?: string }> {
    await this.ensureConfig();

    try {
      if (this.provider === 'ollama') {
        const response = await fetch(`${this.config.baseUrl}/api/tags`);
        if (!response.ok) throw new Error('Ollama not responding');
        return { available: true, provider: this.provider, model: this.config.model };
      } else {
        // For OpenAI-compatible APIs, try a simple models list
        const response = await fetch(`${this.config.baseUrl}/models`, {
          headers: this.getHeaders(),
        });
        if (!response.ok) throw new Error('API not responding');
        return { available: true, provider: this.provider, model: this.config.model };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { available: false, provider: this.provider, model: this.config.model, error: errorMessage };
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    return headers;
  }

  // Non-streaming chat completion
  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    await this.ensureConfig();

    if (this.provider === 'ollama') {
      return this.ollamaChatCompletion(request);
    }
    return this.openaiCompatibleChatCompletion(request);
  }

  // Ollama-specific implementation
  private async ollamaChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const ollamaRequest = {
      model: this.config.model,
      messages: request.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: false,
      options: {
        temperature: request.temperature ?? this.config.temperature,
        num_predict: request.max_tokens ?? this.config.maxTokens,
      },
      // Ollama supports tools in newer versions
      ...(request.tools && { tools: request.tools }),
    };

    const response = await fetch(`${this.config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama error: ${error}`);
    }

    const data = await response.json() as {
      message?: { content?: string; tool_calls?: ToolCall[] };
      prompt_eval_count?: number;
      eval_count?: number;
    };

    // Convert Ollama response to OpenAI format
    return {
      id: `ollama-${Date.now()}`,
      choices: [{
        index: 0,
        message: {
          role: 'assistant' as const,
          content: data.message?.content || '',
          tool_calls: data.message?.tool_calls,
        },
        finish_reason: data.message?.tool_calls ? 'tool_calls' as const : 'stop' as const,
      }],
      usage: {
        prompt_tokens: data.prompt_eval_count || 0,
        completion_tokens: data.eval_count || 0,
        total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
    };
  }

  // OpenAI-compatible implementation (works with Groq, OpenAI, vLLM, etc.)
  private async openaiCompatibleChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const openaiRequest = {
      model: this.config.model,
      messages: request.messages,
      tools: request.tools,
      tool_choice: request.tool_choice,
      stream: false,
      temperature: request.temperature ?? this.config.temperature,
      max_tokens: request.max_tokens ?? this.config.maxTokens,
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(openaiRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    return response.json() as Promise<ChatCompletionResponse>;
  }

  // Streaming chat completion
  async *streamChatCompletion(request: ChatCompletionRequest): AsyncGenerator<StreamChunk> {
    await this.ensureConfig();

    if (this.provider === 'ollama') {
      yield* this.ollamaStreamChatCompletion(request);
    } else {
      yield* this.openaiCompatibleStreamChatCompletion(request);
    }
  }

  // Ollama streaming
  private async *ollamaStreamChatCompletion(request: ChatCompletionRequest): AsyncGenerator<StreamChunk> {
    const ollamaRequest = {
      model: this.config.model,
      messages: request.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
      options: {
        temperature: request.temperature ?? this.config.temperature,
        num_predict: request.max_tokens ?? this.config.maxTokens,
      },
    };

    const response = await fetch(`${this.config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${await response.text()}`);
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
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          yield {
            id: `ollama-${Date.now()}`,
            choices: [{
              index: 0,
              delta: {
                role: 'assistant',
                content: data.message?.content || '',
              },
              finish_reason: data.done ? 'stop' : null,
            }],
          };
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  }

  // OpenAI-compatible streaming
  private async *openaiCompatibleStreamChatCompletion(request: ChatCompletionRequest): AsyncGenerator<StreamChunk> {
    const openaiRequest = {
      model: this.config.model,
      messages: request.messages,
      tools: request.tools,
      tool_choice: request.tool_choice,
      stream: true,
      temperature: request.temperature ?? this.config.temperature,
      max_tokens: request.max_tokens ?? this.config.maxTokens,
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(openaiRequest),
    });

    if (!response.ok) {
      throw new Error(`API error: ${await response.text()}`);
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
        if (data === '[DONE]') return;

        try {
          yield JSON.parse(data);
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }

  // Get current configuration
  getConfig() {
    return {
      provider: this.provider,
      model: this.config.model,
      baseUrl: this.config.baseUrl,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    };
  }
}

// Lazy singleton instance - initialized on first access to ensure dotenv has loaded
let _llmService: LLMService | null = null;

export const llmService = {
  get instance(): LLMService {
    if (!_llmService) {
      _llmService = new LLMService();
    }
    return _llmService;
  },
  healthCheck() {
    return this.instance.healthCheck();
  },
  chatCompletion(request: ChatCompletionRequest) {
    return this.instance.chatCompletion(request);
  },
  streamChatCompletion(request: ChatCompletionRequest) {
    return this.instance.streamChatCompletion(request);
  },
  getConfig() {
    return this.instance.getConfig();
  },
  // Force reload configuration from database
  async reloadConfig() {
    return this.instance.reloadConfig();
  },
};
