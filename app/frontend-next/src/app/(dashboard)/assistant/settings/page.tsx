'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Settings2,
  Save,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Server,
  Thermometer,
  Hash,
  ArrowLeft,
  Eye,
  EyeOff,
  Zap,
  Cloud,
  HardDrive,
  Cpu,
} from 'lucide-react';
import Link from 'next/link';
import { llmSettingsApi, type LLMSettings, type LLMProvider, type LLMModel } from '@/lib/api/llm-settings';
import { useAuthStore } from '@/lib/stores/auth-store';

const PROVIDER_INFO = {
  ollama: {
    name: 'Ollama',
    description: 'Local - rulează pe serverul tău',
    icon: HardDrive,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  groq: {
    name: 'Groq',
    description: 'Cloud - foarte rapid',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  openai: {
    name: 'OpenAI',
    description: 'Cloud - GPT-4 și alte modele',
    icon: Cloud,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  custom: {
    name: 'Custom',
    description: 'Endpoint OpenAI-compatibil',
    icon: Cpu,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

export default function AssistantSettingsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  // Form state
  const [formData, setFormData] = useState<Partial<LLMSettings>>({});
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Connection test state
  const [testResult, setTestResult] = useState<{
    testing: boolean;
    success?: boolean;
    message?: string;
  }>({ testing: false });

  // Fetch current settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['llm-settings'],
    queryFn: llmSettingsApi.getSettings,
    enabled: isAdmin,
  });

  // Fetch models based on provider
  const [models, setModels] = useState<LLMModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  const fetchModels = useCallback(async (provider: LLMProvider) => {
    setModelsLoading(true);
    setModelsError(null);
    try {
      let response;
      switch (provider) {
        case 'ollama':
          response = await llmSettingsApi.getOllamaModels(formData.ollamaBaseUrl);
          break;
        case 'groq':
          response = await llmSettingsApi.getGroqModels(formData.groqApiKey);
          break;
        case 'openai':
          response = await llmSettingsApi.getOpenAIModels(formData.openaiApiKey, formData.openaiBaseUrl);
          break;
        case 'custom':
          if (!formData.customBaseUrl) {
            setModels([]);
            setModelsLoading(false);
            return;
          }
          response = await llmSettingsApi.getCustomModels(formData.customBaseUrl, formData.customApiKey);
          break;
      }
      setModels(response?.models || []);
    } catch (error) {
      setModelsError(error instanceof Error ? error.message : 'Eroare la incarcarea modelelor');
      setModels([]);
    } finally {
      setModelsLoading(false);
    }
  }, [formData.ollamaBaseUrl, formData.groqApiKey, formData.openaiApiKey, formData.openaiBaseUrl, formData.customBaseUrl, formData.customApiKey]);

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Fetch models when provider changes or relevant settings change
  useEffect(() => {
    if (formData.activeProvider) {
      fetchModels(formData.activeProvider);
    }
  }, [formData.activeProvider, fetchModels]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<LLMSettings>) => llmSettingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-settings'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'health'] });
      setIsDirty(false);
    },
  });

  const handleChange = (key: keyof LLMSettings, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleProviderChange = (provider: LLMProvider) => {
    setFormData((prev) => ({ ...prev, activeProvider: provider }));
    setIsDirty(true);
    setTestResult({ testing: false });
  };

  const handleSave = async () => {
    // Don't send masked API keys to the backend - they would overwrite the real keys
    const dataToSave = { ...formData };
    if (dataToSave.groqApiKey?.startsWith('***')) {
      delete dataToSave.groqApiKey;
    }
    if (dataToSave.openaiApiKey?.startsWith('***')) {
      delete dataToSave.openaiApiKey;
    }
    if (dataToSave.customApiKey?.startsWith('***')) {
      delete dataToSave.customApiKey;
    }
    await updateMutation.mutateAsync(dataToSave);
  };

  const handleTestConnection = async () => {
    setTestResult({ testing: true });
    try {
      const provider = formData.activeProvider || 'ollama';
      const config: { apiKey?: string; baseUrl?: string; model?: string } = {};

      switch (provider) {
        case 'ollama':
          config.baseUrl = formData.ollamaBaseUrl;
          config.model = formData.ollamaModel;
          break;
        case 'groq':
          // Only send API key if it's not masked (starts with ***) - backend will use stored key
          config.apiKey = formData.groqApiKey?.startsWith('***') ? undefined : formData.groqApiKey;
          config.model = formData.groqModel;
          break;
        case 'openai':
          config.apiKey = formData.openaiApiKey?.startsWith('***') ? undefined : formData.openaiApiKey;
          config.baseUrl = formData.openaiBaseUrl;
          config.model = formData.openaiModel;
          break;
        case 'custom':
          config.apiKey = formData.customApiKey?.startsWith('***') ? undefined : formData.customApiKey;
          config.baseUrl = formData.customBaseUrl;
          config.model = formData.customModel;
          break;
      }

      const result = await llmSettingsApi.testConnection(provider, config);
      setTestResult({
        testing: false,
        success: result.connected,
        message: result.connected ? 'Conexiune reusita!' : result.error,
      });
    } catch (error) {
      setTestResult({
        testing: false,
        success: false,
        message: error instanceof Error ? error.message : 'Eroare la testare',
      });
    }
  };

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getCurrentModel = () => {
    switch (formData.activeProvider) {
      case 'ollama':
        return formData.ollamaModel;
      case 'groq':
        return formData.groqModel;
      case 'openai':
        return formData.openaiModel;
      case 'custom':
        return formData.customModel;
      default:
        return '';
    }
  };

  const setCurrentModel = (model: string) => {
    switch (formData.activeProvider) {
      case 'ollama':
        handleChange('ollamaModel', model);
        break;
      case 'groq':
        handleChange('groqModel', model);
        break;
      case 'openai':
        handleChange('openaiModel', model);
        break;
      case 'custom':
        handleChange('customModel', model);
        break;
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/assistant">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Inapoi la Asistent
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings2 className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold">Acces Restrictionat</h3>
            <p className="text-slate-500 text-center max-w-md mt-2">
              Doar administratorii pot configura setarile asistentului AI.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/assistant">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Inapoi
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-500" />
              Setari Asistent AI
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configureaza providerul LLM si modelul pentru asistent
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testResult.testing}
          >
            {testResult.testing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Testeaza Conexiunea
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salveaza
          </Button>
        </div>
      </div>

      {/* Test result alert */}
      {testResult.success !== undefined && (
        <Alert variant={testResult.success ? 'default' : 'destructive'}>
          {testResult.success ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>{testResult.message}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {updateMutation.isSuccess && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>Setarile au fost salvate cu succes!</AlertDescription>
        </Alert>
      )}

      {settingsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          {/* Provider Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Selecteaza Provider
              </CardTitle>
              <CardDescription>
                Alege serviciul LLM care va procesa intrebarile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(PROVIDER_INFO) as LLMProvider[]).map((provider) => {
                  const info = PROVIDER_INFO[provider];
                  const Icon = info.icon;
                  const isSelected = formData.activeProvider === provider;

                  return (
                    <button
                      key={provider}
                      onClick={() => handleProviderChange(provider)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`inline-flex p-2 rounded-lg ${info.bgColor} mb-3`}>
                        <Icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <h3 className="font-semibold">{info.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {info.description}
                      </p>
                      {isSelected && (
                        <Badge className="mt-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          Activ
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Provider-specific Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Configurare {PROVIDER_INFO[formData.activeProvider || 'ollama'].name}
              </CardTitle>
              <CardDescription>
                Seteaza detaliile de conexiune pentru provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ollama Settings */}
              {formData.activeProvider === 'ollama' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ollamaBaseUrl">URL Server Ollama</Label>
                    <Input
                      id="ollamaBaseUrl"
                      value={formData.ollamaBaseUrl || ''}
                      onChange={(e) => handleChange('ollamaBaseUrl', e.target.value)}
                      placeholder="http://localhost:11434"
                    />
                    <p className="text-xs text-slate-500">
                      Adresa serverului Ollama (local sau remote)
                    </p>
                  </div>
                </div>
              )}

              {/* Groq Settings */}
              {formData.activeProvider === 'groq' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="groqApiKey">Cheie API Groq</Label>
                    <div className="flex gap-2">
                      <Input
                        id="groqApiKey"
                        type={showApiKeys.groq ? 'text' : 'password'}
                        value={formData.groqApiKey || ''}
                        onChange={(e) => handleChange('groqApiKey', e.target.value)}
                        placeholder="gsk_..."
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility('groq')}
                      >
                        {showApiKeys.groq ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Obtine cheia de la{' '}
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        console.groq.com
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* OpenAI Settings */}
              {formData.activeProvider === 'openai' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openaiApiKey">Cheie API OpenAI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="openaiApiKey"
                        type={showApiKeys.openai ? 'text' : 'password'}
                        value={formData.openaiApiKey || ''}
                        onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                        placeholder="sk-..."
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility('openai')}
                      >
                        {showApiKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openaiBaseUrl">URL API (optional)</Label>
                    <Input
                      id="openaiBaseUrl"
                      value={formData.openaiBaseUrl || ''}
                      onChange={(e) => handleChange('openaiBaseUrl', e.target.value)}
                      placeholder="https://api.openai.com/v1"
                    />
                    <p className="text-xs text-slate-500">
                      Lasa gol pentru OpenAI oficial sau introdu URL pentru proxy/Azure
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Settings */}
              {formData.activeProvider === 'custom' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customBaseUrl">URL Endpoint</Label>
                    <Input
                      id="customBaseUrl"
                      value={formData.customBaseUrl || ''}
                      onChange={(e) => handleChange('customBaseUrl', e.target.value)}
                      placeholder="http://localhost:8000/v1"
                    />
                    <p className="text-xs text-slate-500">
                      URL pentru vLLM, Llamafile, text-generation-webui, etc.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customApiKey">Cheie API (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="customApiKey"
                        type={showApiKeys.custom ? 'text' : 'password'}
                        value={formData.customApiKey || ''}
                        onChange={(e) => handleChange('customApiKey', e.target.value)}
                        placeholder="optional"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility('custom')}
                      >
                        {showApiKeys.custom ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Model Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Model</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchModels(formData.activeProvider || 'ollama')}
                    disabled={modelsLoading}
                  >
                    {modelsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-1">Reincarca</span>
                  </Button>
                </div>
                {modelsError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{modelsError}</AlertDescription>
                  </Alert>
                ) : modelsLoading ? (
                  <Skeleton className="h-10" />
                ) : models.length === 0 ? (
                  <div className="p-4 border rounded-lg text-center text-slate-500">
                    <p>Nu s-au gasit modele disponibile.</p>
                    <p className="text-xs mt-1">
                      {formData.activeProvider === 'ollama'
                        ? 'Verifica daca Ollama ruleaza si are modele instalate.'
                        : 'Verifica configuratia si cheia API.'}
                    </p>
                  </div>
                ) : (
                  <Select value={getCurrentModel()} onValueChange={setCurrentModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteaza un model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            {model.size && (
                              <Badge variant="outline" className="text-xs">
                                {model.size}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Parametri Generare
              </CardTitle>
              <CardDescription>
                Ajusteaza comportamentul modelului
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Temperatura: {formData.temperature?.toFixed(1) || '0.7'}</Label>
                    <Badge variant="outline">
                      {(formData.temperature || 0.7) < 0.3
                        ? 'Precis'
                        : (formData.temperature || 0.7) > 0.8
                        ? 'Creativ'
                        : 'Echilibrat'}
                    </Badge>
                  </div>
                  <Slider
                    value={[formData.temperature || 0.7]}
                    onValueChange={([value]) => handleChange('temperature', value)}
                    min={0}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">
                    Valori mici = raspunsuri mai precise, valori mari = mai creative
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="maxTokens" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Tokeni Maximi
                  </Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={formData.maxTokens || 2048}
                    onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                    min={100}
                    max={16000}
                  />
                  <p className="text-xs text-slate-500">
                    Lungimea maxima a raspunsului (100-16000)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
