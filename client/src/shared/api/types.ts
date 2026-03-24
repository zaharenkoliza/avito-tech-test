import type { Category } from '@/entities/ad'

export type SortColumn = 'title' | 'createdAt' | 'price'
export type SortDirection = 'asc' | 'desc'

export interface ListQuery {
	q: string
	limit: number
	skip: number
	categories: Category[]
	needsRevision: boolean
	sortColumn?: SortColumn
	sortDirection?: SortDirection
}

export interface AdListItem {
	id?: number
	category: Category
	title: string
	price: number | null
	createdAt?: string
	needsRevision: boolean
}

export interface AdsListResponse {
	items: AdListItem[]
	total: number
}

export type AiDescriptionMode = 'generate' | 'improve'

export interface AiDescriptionRequest {
	item: unknown
	mode: AiDescriptionMode
	hint?: string
}

export interface AiDescriptionResponse {
	description: string
	notes: string[]
}

export interface AiPriceRequest {
	item: unknown
}

export interface AiPriceResponse {
	priceSuggestion: number
	rationale: string
}

export interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
}

export interface AiChatRequest {
	item: unknown
	history: ChatMessage[]
	message: string
}

export interface AiChatResponse {
	reply: string
}

