import { z } from 'zod';
import {
  buildChatPrompt,
  buildDescriptionPrompt,
  buildPricePrompt,
} from './prompts.ts';
import type {
  AIProvider,
  ChatInput,
  ChatOutput,
  DescriptionInput,
  DescriptionOutput,
  PriceInput,
  PriceOutput,
} from './types.ts';

const DescriptionSchema = z.object({
  description: z.string().trim().min(1),
  notes: z.array(z.string().trim()).default([]),
});

const PriceSchema = z.object({
  priceSuggestion: z.number().int().min(0),
  rationale: z.string().trim().min(1),
});

const ChatSchema = z.object({
  reply: z.string().trim().min(1),
});

type OllamaGenerateResponse = {
  response?: string;
  error?: string;
};

type OllamaConfig = {
  baseUrl: string;
  model: string;
  timeoutMs: number;
};

const callOllama = async (config: OllamaConfig, prompt: string): Promise<unknown> => {
  const { baseUrl, model, timeoutMs } = config;
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${normalizedBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        format: 'json',
        stream: false,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json()) as OllamaGenerateResponse;

    if (!response.ok) {
      throw new Error(payload.error ?? 'Ollama вернул ошибку');
    }

    const modelText = payload.response?.trim();
    if (!modelText) {
      throw new Error('Пустой ответ от Ollama');
    }

    try {
      return JSON.parse(modelText);
    } catch {
      throw new Error('Ollama вернул невалидный JSON');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Ollama не ответил за ${timeoutMs} мс. Увеличьте OLLAMA_TIMEOUT_MS.`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Не удалось подключиться к Ollama: network error');
  } finally {
    clearTimeout(timeoutId);
  }
};

const generateDescription = async (
  config: OllamaConfig,
  input: DescriptionInput,
): Promise<DescriptionOutput> => {
  const prompt = buildDescriptionPrompt(input);
  const raw = await callOllama(config, prompt);
  return DescriptionSchema.parse(raw);
};

const suggestPrice = async (
  config: OllamaConfig,
  input: PriceInput,
): Promise<PriceOutput> => {
  const prompt = buildPricePrompt(input);
  const raw = await callOllama(config, prompt);
  return PriceSchema.parse(raw);
};

const chat = async (config: OllamaConfig, input: ChatInput): Promise<ChatOutput> => {
  const prompt = buildChatPrompt(input.item, input.history, input.message);
  const raw = await callOllama(config, prompt);
  return ChatSchema.parse(raw);
};

const createOllamaProvider = (
  baseUrl: string,
  model: string,
  timeoutMs = 120000,
): AIProvider => {
  const config: OllamaConfig = { baseUrl, model, timeoutMs };

  return {
    generateDescription: (input) => generateDescription(config, input),
    suggestPrice: (input) => suggestPrice(config, input),
    chat: (input) => chat(config, input),
  };
};

export const createAIProvider = () => {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3:latest';
  const timeoutMs = process.env.OLLAMA_TIMEOUT_MS ? Number(process.env.OLLAMA_TIMEOUT_MS) : 120000;

  return createOllamaProvider(baseUrl, model, timeoutMs);
};
