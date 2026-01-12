/**
 * LLM Settings Routes - Manage AI assistant configuration
 */

import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { getDb } from '../db/index.js';
import { llmSettings } from '../db/schema/system.js';
import { logger } from '../utils/logger.js';
import { llmService } from '../services/llm.js';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Validation schema for settings update
const updateSettingsSchema = z.object({
  activeProvider: z.enum(['ollama', 'groq', 'openai', 'custom']),
  ollamaBaseUrl: z.string().optional(),
  ollamaModel: z.string().optional(),
  groqApiKey: z.string().optional(),
  groqModel: z.string().optional(),
  openaiApiKey: z.string().optional(),
  openaiBaseUrl: z.string().optional(),
  openaiModel: z.string().optional(),
  customBaseUrl: z.string().optional(),
  customApiKey: z.string().optional(),
  customModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(100).max(16000).optional(),
});

// Get current LLM settings
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const [settings] = await db.select().from(llmSettings).limit(1);

    if (!settings) {
      // Return default settings if none exist
      return res.json({
        success: true,
        data: {
          activeProvider: 'ollama',
          ollamaBaseUrl: 'http://localhost:11434',
          ollamaModel: 'llama3.2',
          groqApiKey: '',
          groqModel: 'llama3-groq-70b-8192-tool-use-preview',
          openaiApiKey: '',
          openaiBaseUrl: 'https://api.openai.com/v1',
          openaiModel: 'gpt-4o-mini',
          customBaseUrl: '',
          customApiKey: '',
          customModel: '',
          temperature: 0.7,
          maxTokens: 2048,
        },
      });
    }

    // Mask API keys for security (show only last 4 characters)
    const maskedSettings = {
      ...settings,
      groqApiKey: settings.groqApiKey ? `***${settings.groqApiKey.slice(-4)}` : '',
      openaiApiKey: settings.openaiApiKey ? `***${settings.openaiApiKey.slice(-4)}` : '',
      customApiKey: settings.customApiKey ? `***${settings.customApiKey.slice(-4)}` : '',
    };

    res.json({ success: true, data: maskedSettings });
  } catch (error) {
    logger.error('Error fetching LLM settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: { message: errorMessage } });
  }
});

// Update LLM settings
router.put('/', async (req, res) => {
  try {
    const data = updateSettingsSchema.parse(req.body);
    const db = getDb();
    const userId = (req as any).user?.id;

    // Check if settings exist
    const [existing] = await db.select().from(llmSettings).limit(1);

    // Don't overwrite API keys with masked values
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
      updatedBy: userId,
    };

    // If API key is masked (starts with ***), don't update it
    if (data.groqApiKey?.startsWith('***')) {
      delete updateData.groqApiKey;
    }
    if (data.openaiApiKey?.startsWith('***')) {
      delete updateData.openaiApiKey;
    }
    if (data.customApiKey?.startsWith('***')) {
      delete updateData.customApiKey;
    }

    if (existing) {
      await db.update(llmSettings).set(updateData).where(eq(llmSettings.id, existing.id));
    } else {
      await db.insert(llmSettings).values(updateData as typeof llmSettings.$inferInsert);
    }

    // Reload LLM service with new settings immediately
    await llmService.reloadConfig();
    logger.info(`LLM settings updated by user ${userId}, provider: ${data.activeProvider}`);

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    logger.error('Error updating LLM settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: { message: errorMessage } });
  }
});

// Fetch available models from Ollama
router.get('/models/ollama', async (req, res) => {
  try {
    const baseUrl = (req.query.baseUrl as string) || 'http://localhost:11434';

    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json() as { models?: Array<{ name: string; size: number; modified_at: string }> };
    const models = data.models?.map(m => ({
      id: m.name,
      name: m.name,
      size: formatBytes(m.size),
      modified: m.modified_at,
    })) || [];

    res.json({ success: true, data: { models, provider: 'ollama' } });
  } catch (error) {
    logger.error('Error fetching Ollama models:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: { message: `Failed to fetch Ollama models: ${errorMessage}` },
    });
  }
});

// Fetch available models from Groq
router.get('/models/groq', async (req, res) => {
  try {
    // Get API key from query or database
    let apiKey = req.query.apiKey as string;

    if (!apiKey || apiKey.startsWith('***')) {
      // Try to get from database
      const db = getDb();
      const [settings] = await db.select().from(llmSettings).limit(1);
      apiKey = settings?.groqApiKey || process.env.GROQ_API_KEY || '';
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: { message: 'Groq API key is required' },
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as { data?: Array<{ id: string; owned_by: string; created: number }> };
    const models = data.data?.map(m => ({
      id: m.id,
      name: m.id,
      ownedBy: m.owned_by,
      created: new Date(m.created * 1000).toISOString(),
    })) || [];

    // Filter to show only chat/completion models and sort by name
    const chatModels = models
      .filter(m => !m.id.includes('whisper'))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, data: { models: chatModels, provider: 'groq' } });
  } catch (error) {
    logger.error('Error fetching Groq models:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: { message: `Failed to fetch Groq models: ${errorMessage}` },
    });
  }
});

// Fetch available models from OpenAI
router.get('/models/openai', async (req, res) => {
  try {
    let apiKey = req.query.apiKey as string;
    const baseUrl = (req.query.baseUrl as string) || 'https://api.openai.com/v1';

    if (!apiKey || apiKey.startsWith('***')) {
      const db = getDb();
      const [settings] = await db.select().from(llmSettings).limit(1);
      apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY || '';
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: { message: 'OpenAI API key is required' },
      });
    }

    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as { data?: Array<{ id: string; owned_by: string; created: number }> };
    const models = data.data?.map(m => ({
      id: m.id,
      name: m.id,
      ownedBy: m.owned_by,
      created: new Date(m.created * 1000).toISOString(),
    })) || [];

    // Filter to show only GPT models and sort
    const gptModels = models
      .filter(m => m.id.includes('gpt') || m.id.includes('o1') || m.id.includes('o3'))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, data: { models: gptModels, provider: 'openai' } });
  } catch (error) {
    logger.error('Error fetching OpenAI models:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: { message: `Failed to fetch OpenAI models: ${errorMessage}` },
    });
  }
});

// Fetch available models from custom endpoint (OpenAI-compatible)
router.get('/models/custom', async (req, res) => {
  try {
    const baseUrl = req.query.baseUrl as string;
    let apiKey = req.query.apiKey as string;

    if (!baseUrl) {
      return res.status(400).json({
        success: false,
        error: { message: 'Base URL is required for custom provider' },
      });
    }

    if (!apiKey || apiKey.startsWith('***')) {
      const db = getDb();
      const [settings] = await db.select().from(llmSettings).limit(1);
      apiKey = settings?.customApiKey || '';
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Custom API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as { data?: Array<{ id: string; owned_by?: string }> };
    const models = data.data?.map(m => ({
      id: m.id,
      name: m.id,
      ownedBy: m.owned_by || 'custom',
    })) || [];

    res.json({ success: true, data: { models, provider: 'custom' } });
  } catch (error) {
    logger.error('Error fetching custom models:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: { message: `Failed to fetch custom models: ${errorMessage}` },
    });
  }
});

// Test connection to a provider
router.post('/test', async (req, res) => {
  try {
    let { provider, apiKey, baseUrl, model } = req.body;

    // If no API key provided, get it from the database
    if (!apiKey) {
      const db = getDb();
      const [settings] = await db.select().from(llmSettings).limit(1);
      if (settings) {
        switch (provider) {
          case 'groq':
            apiKey = settings.groqApiKey;
            break;
          case 'openai':
            apiKey = settings.openaiApiKey;
            break;
          case 'custom':
            apiKey = settings.customApiKey;
            break;
        }
      }
    }

    let testUrl: string;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    switch (provider) {
      case 'ollama':
        testUrl = `${baseUrl || 'http://localhost:11434'}/api/tags`;
        break;
      case 'groq':
        testUrl = 'https://api.groq.com/openai/v1/models';
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'openai':
        testUrl = `${baseUrl || 'https://api.openai.com/v1'}/models`;
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'custom':
        testUrl = `${baseUrl}/models`;
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      default:
        return res.status(400).json({ success: false, error: { message: 'Invalid provider' } });
    }

    const response = await fetch(testUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Connection failed: ${response.status}`);
    }

    res.json({
      success: true,
      data: { connected: true, provider, model },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.json({
      success: true,
      data: { connected: false, error: errorMessage },
    });
  }
});

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default router;
