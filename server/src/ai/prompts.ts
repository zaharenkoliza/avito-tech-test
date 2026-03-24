import type { ChatMessage, DescriptionInput, PriceInput } from './types.ts';

const renderItem = (item: unknown): string =>
  JSON.stringify(item, null, 2) ?? String(item);

export const buildDescriptionPrompt = (input: DescriptionInput): string => {
  const actionText =
    input.mode === 'generate'
      ? 'Сгенерируй описание объявления на русском языке.'
      : 'Улучши существующее описание объявления на русском языке.';

  return [
    'Ты помощник продавца на классифайде.',
    actionText,
    'Сделай текст конкретным, полезным и продающим, без кликбейта.',
    'Верни JSON вида: {"description":"...","notes":["...", "..."]}.',
    'notes - краткие пояснения изменений.',
    input.hint ? `Дополнительное пожелание пользователя: ${input.hint}` : '',
    'Данные объявления:',
    renderItem(input.item),
  ]
    .filter(Boolean)
    .join('\n\n');
};

export const buildPricePrompt = (input: PriceInput): string =>
  [
    'Ты оцениваешь рыночную цену объявления на российском рынке.',
    'Верни JSON вида: {"priceSuggestion":123456,"rationale":"..."}.',
    'priceSuggestion должен быть целым неотрицательным числом.',
    'rationale - 1-2 предложения на русском языке с объяснением.',
    'Данные объявления:',
    renderItem(input.item),
  ].join('\n\n');

export const buildChatPrompt = (
  item: unknown,
  history: ChatMessage[],
  message: string,
): string =>
  [
    'Ты AI-консультант продавца. Отвечай коротко и по делу на русском языке.',
    'Контекст объявления:',
    renderItem(item),
    'История диалога:',
    JSON.stringify(history, null, 2),
    `Новый вопрос пользователя: ${message}`,
    'Верни JSON вида: {"reply":"..."}.',
  ].join('\n\n');
