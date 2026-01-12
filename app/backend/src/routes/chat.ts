/**
 * Chat API Routes - AI Assistant for Fleet Management
 */

import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { llmService, type Message } from '../services/llm.js';
import { chatTools, executeTool } from '../services/chat-tools.js';
import { logger } from '../utils/logger.js';

const router = Router();

// All chat routes require authentication
router.use(authenticate);

// System prompt for the assistant
const SYSTEM_PROMPT = `Ești un asistent AI pentru sistemul MedFMS de gestionare a flotei auto.
Poți ajuta utilizatorii să obțină informații despre:
- Vehicule (detalii, căutare, stare)
- Consum de combustibil (statistici, costuri, top consumatori)
- Șoferi (listă, detalii)
- Mentenanță (programări, istoric)
- Materiale și depozit (inventar, transferuri)
- Rapoarte (combustibil, mentenanță, flotă)
- Date de referință (mărci, modele, tipuri vehicule, furnizori, orașe)

Ai acces la două tipuri de instrumente:
1. Funcții predefinite pentru interogări frecvente (get_fleet_overview, get_fuel_statistics, etc.)
2. Acces direct la API-ul intern folosind list_api_endpoints și call_api pentru interogări mai complexe

Când ai nevoie de date mai detaliate sau care nu sunt acoperite de funcțiile predefinite:
- Folosește list_api_endpoints pentru a descoperi endpoint-urile disponibile
- Folosește call_api pentru a apela endpoint-ul dorit cu parametrii necesari

Răspunde în limba română, concis și profesional.
Când ai nevoie de date din baza de date, folosește funcțiile disponibile.
Dacă nu poți răspunde la o întrebare, explică politicos de ce.

Important:
- Formatează numerele mari cu separatori de mii (ex: 1.234,56)
- Pentru sume în lei, folosește "RON" sau "lei"
- Pentru cantități de combustibil, folosește "litri" sau "L"
- Prezintă datele într-un mod ușor de citit`;

// Chat message validation schema
const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  stream: z.boolean().optional().default(false),
});

// Health check for LLM service
router.get('/health', authorize('admin', 'manager', 'operator'), async (_req, res) => {
  const health = await llmService.healthCheck();
  res.json({ success: true, data: health });
});

// Get LLM configuration
router.get('/config', authorize('admin'), async (_req, res) => {
  const config = llmService.getConfig();
  res.json({ success: true, data: config });
});

// Main chat endpoint
router.post('/', authorize('admin', 'manager', 'operator'), async (req, res) => {
  try {
    const { messages: userMessages, stream } = chatMessageSchema.parse(req.body);

    // Build full message history with system prompt
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...userMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    if (stream) {
      // Streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        // First, check if we need to call tools
        const initialResponse = await llmService.chatCompletion({
          messages,
          tools: chatTools,
          tool_choice: 'auto',
        });

        const assistantMessage = initialResponse.choices[0]?.message;

        // If tools were called, execute them
        if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
          // Send tool execution status
          res.write(`data: ${JSON.stringify({ type: 'tool_start', tools: assistantMessage.tool_calls.map(t => t.function.name) })}\n\n`);

          // Execute all tool calls
          const toolResults: Message[] = [];
          for (const toolCall of assistantMessage.tool_calls) {
            const args = JSON.parse(toolCall.function.arguments || '{}');
            const result = await executeTool(toolCall.function.name, args);
            toolResults.push({
              role: 'tool',
              content: result,
              tool_call_id: toolCall.id,
            });
          }

          // Send tool completion status
          res.write(`data: ${JSON.stringify({ type: 'tool_end' })}\n\n`);

          // Add tool messages and get final response
          const messagesWithTools: Message[] = [
            ...messages,
            assistantMessage,
            ...toolResults,
          ];

          // Stream the final response
          for await (const chunk of llmService.streamChatCompletion({ messages: messagesWithTools })) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
            }
          }
        } else {
          // No tools needed, stream directly
          for await (const chunk of llmService.streamChatCompletion({ messages, tools: chatTools })) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
            }
          }
        }

        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.write(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`);
        res.end();
      }
    } else {
      // Non-streaming response
      let finalContent = '';
      let toolsUsed: string[] = [];

      // First call with tools
      const response = await llmService.chatCompletion({
        messages,
        tools: chatTools,
        tool_choice: 'auto',
      });

      const assistantMessage = response.choices[0]?.message;

      if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Execute tools
        toolsUsed = assistantMessage.tool_calls.map(t => t.function.name);
        const toolResults: Message[] = [];

        for (const toolCall of assistantMessage.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments || '{}');
          logger.info(`Executing tool: ${toolCall.function.name}`, args);
          const result = await executeTool(toolCall.function.name, args);
          toolResults.push({
            role: 'tool',
            content: result,
            tool_call_id: toolCall.id,
          });
        }

        // Get final response with tool results
        const messagesWithTools: Message[] = [
          ...messages,
          assistantMessage,
          ...toolResults,
        ];

        const finalResponse = await llmService.chatCompletion({ messages: messagesWithTools });
        finalContent = finalResponse.choices[0]?.message?.content || '';
      } else {
        finalContent = assistantMessage?.content || '';
      }

      res.json({
        success: true,
        data: {
          content: finalContent,
          toolsUsed,
        },
      });
    }
  } catch (error) {
    logger.error('Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: { message: `Chat error: ${errorMessage}` },
    });
  }
});

// Get available tools (for UI display)
router.get('/tools', authorize('admin', 'manager', 'operator'), async (_req, res) => {
  const tools = chatTools.map(t => ({
    name: t.function.name,
    description: t.function.description,
    parameters: t.function.parameters,
  }));
  res.json({ success: true, data: tools });
});

// Test a specific tool directly (admin only)
router.post('/tools/:name/test', authorize('admin'), async (req, res) => {
  try {
    const { name } = req.params;
    const args = req.body || {};
    const result = await executeTool(name, args);
    res.json({ success: true, data: JSON.parse(result) });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: { message: errorMessage } });
  }
});

export default router;
