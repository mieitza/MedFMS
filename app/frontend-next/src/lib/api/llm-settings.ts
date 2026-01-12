import { api } from './client';

export type LLMProvider = 'ollama' | 'groq' | 'openai' | 'custom';

export interface LLMSettings {
  id?: number;
  activeProvider: LLMProvider;
  ollamaBaseUrl: string;
  ollamaModel: string;
  groqApiKey: string;
  groqModel: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  openaiModel: string;
  customBaseUrl: string;
  customApiKey: string;
  customModel: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMModel {
  id: string;
  name: string;
  size?: string;
  ownedBy?: string;
  created?: string;
  modified?: string;
}

export interface ModelsResponse {
  models: LLMModel[];
  provider: string;
}

export interface TestConnectionResponse {
  connected: boolean;
  provider: string;
  model?: string;
  error?: string;
}

export const llmSettingsApi = {
  // Get current LLM settings
  getSettings: async (): Promise<LLMSettings> => {
    return api.get<LLMSettings>('/llm-settings');
  },

  // Update LLM settings
  updateSettings: async (settings: Partial<LLMSettings>): Promise<{ message: string }> => {
    return api.put<{ message: string }>('/llm-settings', settings);
  },

  // Fetch available models from Ollama
  getOllamaModels: async (baseUrl?: string): Promise<ModelsResponse> => {
    const params: Record<string, string> = {};
    if (baseUrl) params.baseUrl = baseUrl;
    return api.get<ModelsResponse>('/llm-settings/models/ollama', params);
  },

  // Fetch available models from Groq
  getGroqModels: async (apiKey?: string): Promise<ModelsResponse> => {
    const params: Record<string, string> = {};
    if (apiKey) params.apiKey = apiKey;
    return api.get<ModelsResponse>('/llm-settings/models/groq', params);
  },

  // Fetch available models from OpenAI
  getOpenAIModels: async (apiKey?: string, baseUrl?: string): Promise<ModelsResponse> => {
    const params: Record<string, string> = {};
    if (apiKey) params.apiKey = apiKey;
    if (baseUrl) params.baseUrl = baseUrl;
    return api.get<ModelsResponse>('/llm-settings/models/openai', params);
  },

  // Fetch available models from custom endpoint
  getCustomModels: async (baseUrl: string, apiKey?: string): Promise<ModelsResponse> => {
    const params: Record<string, string> = { baseUrl };
    if (apiKey) params.apiKey = apiKey;
    return api.get<ModelsResponse>('/llm-settings/models/custom', params);
  },

  // Test connection to a provider
  testConnection: async (
    provider: LLMProvider,
    config: { apiKey?: string; baseUrl?: string; model?: string }
  ): Promise<TestConnectionResponse> => {
    return api.post<TestConnectionResponse>('/llm-settings/test', {
      provider,
      ...config,
    });
  },
};
