export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type DescriptionInput = {
  item: unknown;
  mode: 'generate' | 'improve';
  hint?: string;
};

export type PriceInput = {
  item: unknown;
};

export type ChatInput = {
  item: unknown;
  history: ChatMessage[];
  message: string;
};

export type DescriptionOutput = {
  description: string;
  notes: string[];
};

export type PriceOutput = {
  priceSuggestion: number;
  rationale: string;
};

export type ChatOutput = {
  reply: string;
};

export interface AIProvider {
  generateDescription(input: DescriptionInput): Promise<DescriptionOutput>;
  suggestPrice(input: PriceInput): Promise<PriceOutput>;
  chat(input: ChatInput): Promise<ChatOutput>;
}
