'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  AlertCircle,
  Wrench,
  Trash2,
  Info,
  Settings,
  Maximize2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { chatApi, type ChatMessage, type StreamEvent } from '@/lib/api/chat';
import { cn } from '@/lib/utils';

interface Message extends ChatMessage {
  id: string;
  isLoading?: boolean;
  toolsUsed?: string[];
}

// Enhanced Markdown renderer for chat messages
function formatMessage(content: string, fullMarkdown: boolean = false): string {
  let formatted = content;

  // Escape HTML to prevent XSS (but preserve our own tags)
  formatted = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (```language\ncode\n```)
  formatted = formatted.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const langLabel = lang ? `<span class="text-xs text-slate-400 absolute top-2 right-2">${lang}</span>` : '';
      return `<div class="relative my-3"><pre class="bg-slate-900 text-slate-100 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm font-mono">${langLabel}<code>${code.trim()}</code></pre></div>`;
    }
  );

  // Inline code (`code`)
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );

  // Headers (## Header)
  if (fullMarkdown) {
    formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
  }

  // Bold text (**text**)
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic text (*text* or _text_)
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links [text](url)
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>'
  );

  // Numbered lists (1. item)
  formatted = formatted.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4" value="$1">$2</li>');
  formatted = formatted.replace(
    /(<li class="ml-4" value="\d+">[^<]+<\/li>\n?)+/g,
    '<ol class="list-decimal pl-4 space-y-1 my-2">$&</ol>'
  );

  // Unordered lists (- item or * item)
  formatted = formatted.replace(/^[-*] (.+)$/gm, '<li class="ml-4">$1</li>');
  formatted = formatted.replace(
    /(<li class="ml-4">[^<]+<\/li>\n?)+/g,
    '<ul class="list-disc pl-4 space-y-1 my-2">$&</ul>'
  );

  // Horizontal rule (---)
  formatted = formatted.replace(/^---$/gm, '<hr class="my-4 border-slate-300 dark:border-slate-600" />');

  // Blockquotes (> text)
  formatted = formatted.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-600 dark:text-slate-400 my-2">$1</blockquote>'
  );

  // Tables (basic support)
  formatted = formatted.replace(
    /^\|(.+)\|$/gm,
    (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      const isHeader = cells.some((cell: string) => cell.match(/^-+$/));
      if (isHeader) {
        return ''; // Skip separator row
      }
      const cellElements = cells.map((cell: string) => `<td class="border border-slate-300 dark:border-slate-600 px-3 py-2">${cell}</td>`).join('');
      return `<tr>${cellElements}</tr>`;
    }
  );
  // Wrap table rows
  formatted = formatted.replace(
    /(<tr>.*<\/tr>\n?)+/g,
    '<table class="border-collapse border border-slate-300 dark:border-slate-600 my-3 w-full">$&</table>'
  );

  // Paragraphs - convert double line breaks to paragraph breaks
  formatted = formatted.replace(/\n\n/g, '</p><p class="my-2">');

  // Single line breaks
  formatted = formatted.replace(/\n/g, '<br/>');

  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith('<')) {
    formatted = `<p class="my-2">${formatted}</p>`;
  }

  return formatted;
}

// Message component
function ChatMessageBubble({
  message,
  onExpand
}: {
  message: Message;
  onExpand?: (message: Message) => void;
}) {
  const isUser = message.role === 'user';
  const canExpand = !isUser && !message.isLoading && message.content.length > 0;

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {message.toolsUsed.map((tool) => (
              <Badge key={tool} variant="outline" className="text-xs py-0 px-1.5">
                <Wrench className="h-3 w-3 mr-1" />
                {tool.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
        <div className="group relative">
          <div
            className={cn(
              'rounded-2xl px-4 py-2 max-w-[85%]',
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
              canExpand && 'cursor-pointer hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-600 transition-all'
            )}
            onClick={() => canExpand && onExpand?.(message)}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Se procesează...</span>
              </div>
            ) : (
              <div
                className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
            )}
          </div>
          {canExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-700 shadow-sm border"
              onClick={(e) => {
                e.stopPropagation();
                onExpand?.(message);
              }}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Suggested queries
const SUGGESTED_QUERIES = [
  'Câte vehicule avem în flotă?',
  'Care sunt primele 5 vehicule cu consum mare?',
  'Ce mentenanțe sunt programate?',
  'Statistici combustibil luna aceasta',
  'Lista șoferilor activi',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTools, setCurrentTools] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const handleExpandMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsPanelOpen(true);
    setIsCopied(false);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleCopyMessage = async () => {
    if (selectedMessage) {
      try {
        await navigator.clipboard.writeText(selectedMessage.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Check LLM health
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['chat', 'health'],
    queryFn: () => chatApi.getHealth(),
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text,
    };

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentTools([]);

    // Build conversation history for API
    const conversationHistory: ChatMessage[] = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];

    let fullContent = '';
    let toolsUsed: string[] = [];

    try {
      await chatApi.streamMessage(
        conversationHistory,
        (event: StreamEvent) => {
          switch (event.type) {
            case 'tool_start':
              if (event.tools) {
                setCurrentTools(event.tools);
                toolsUsed = event.tools;
              }
              break;
            case 'tool_end':
              setCurrentTools([]);
              break;
            case 'content':
              if (event.content) {
                fullContent += event.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullContent, isLoading: false, toolsUsed }
                      : m
                  )
                );
              }
              break;
            case 'done':
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: fullContent || 'Nu am putut genera un răspuns.', isLoading: false, toolsUsed }
                    : m
                )
              );
              break;
            case 'error':
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: `Eroare: ${event.error || 'Necunoscută'}`, isLoading: false }
                    : m
                )
              );
              break;
          }
        },
        (error: Error) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: `Eroare: ${error.message}`, isLoading: false }
                : m
            )
          );
        }
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: `Eroare: ${error instanceof Error ? error.message : 'Necunoscută'}`, isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      setCurrentTools([]);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Asistent AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Întreabă-mă orice despre flotă, combustibil sau mentenanță
          </p>
        </div>
        <div className="flex items-center gap-2">
          {healthLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : health?.available ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              {health.model}
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Indisponibil
            </Badge>
          )}
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearConversation}>
              <Trash2 className="h-4 w-4 mr-1" />
              Șterge
            </Button>
          )}
          {isAdmin && (
            <Link href="/assistant/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Setări
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area with Side Panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat Area */}
        <Card className={cn(
          "flex-1 flex flex-col min-h-0 transition-all duration-300",
          isPanelOpen ? "w-1/2" : "w-full"
        )}>
          <div className="flex-1 overflow-auto p-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-4 mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bine ai venit!</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  Sunt asistentul tău pentru managementul flotei. Pot să te ajut cu informații despre vehicule,
                  consum de combustibil, mentenanță și multe altele.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 max-w-lg">
                  {SUGGESTED_QUERIES.map((query) => (
                    <Button
                      key={query}
                      variant="outline"
                      className="justify-start text-left h-auto py-2 px-3 text-sm"
                      onClick={() => handleSendMessage(query)}
                      disabled={isLoading || !health?.available}
                    >
                      <Sparkles className="h-3 w-3 mr-2 text-purple-500 shrink-0" />
                      <span className="truncate">{query}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    onExpand={handleExpandMessage}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tools indicator */}
          {currentTools.length > 0 && (
            <div className="px-4 py-2 border-t bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Se execută:</span>
                {currentTools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-xs">
                    {tool.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-4 border-t">
            {!health?.available && !healthLoading && (
              <div className="mb-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700 dark:text-amber-400">Serviciul LLM nu este disponibil</p>
                    <p className="text-amber-600 dark:text-amber-500">
                      {health?.error || 'Verifică configurația serverului'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scrie un mesaj... (Enter pentru a trimite, Shift+Enter pentru linie nouă)"
                className="min-h-[44px] max-h-[200px] resize-none"
                disabled={isLoading || !health?.available}
                rows={1}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading || !health?.available}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Asistentul poate face greșeli. Verifică informațiile importante.
            </p>
          </div>
        </Card>

        {/* Collapsible Right Side Panel */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isPanelOpen ? "w-1/2 opacity-100" : "w-0 opacity-0"
          )}
        >
          {isPanelOpen && selectedMessage && (
            <Card className="h-full flex flex-col">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Răspuns Asistent</h3>
                    {selectedMessage.toolsUsed && selectedMessage.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMessage.toolsUsed.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs py-0 px-1.5">
                            <Wrench className="h-3 w-3 mr-1" />
                            {tool.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyMessage}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-1 text-emerald-500" />
                        Copiat
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiază
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClosePanel}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto p-4">
                <div
                  className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(selectedMessage.content, true) }}
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
