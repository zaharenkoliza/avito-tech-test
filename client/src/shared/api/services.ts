import { api } from './apiClient'

import type {
	AdsListResponse,
	AiChatRequest,
	AiChatResponse,
	AiDescriptionRequest,
	AiDescriptionResponse,
	AiPriceRequest,
	AiPriceResponse,
	ListQuery,
} from '../../types/api'
import type { ItemWithRevision } from '../../types/item'

const AI_REQUEST_TIMEOUT_MS = 120000

export const adsService = {
	async getAds(query: ListQuery, signal?: AbortSignal): Promise<AdsListResponse> {
		const params: Record<string, string> = {
			q: query.q,
			limit: String(query.limit),
			skip: String(query.skip),
		}

		if (query.categories.length > 0) {
			params.categories = query.categories.join(',')
		}

		if (query.needsRevision) {
			params.needsRevision = 'true'
		}

		if (query.sortColumn) {
			params.sortColumn = query.sortColumn
		}

		if (query.sortDirection) {
			params.sortDirection = query.sortDirection
		}

		const { data } = await api.get<AdsListResponse>('/items', {
			params,
			signal,
		})
		return data
	},
	async getAd(id: number, signal?: AbortSignal): Promise<ItemWithRevision> {
		const { data } = await api.get<ItemWithRevision>(`/items/${id}`, { signal })
		return data
	},
	async updateAd(
		id: number,
		payload: {
			category: string
			title: string
			description?: string
			price: number
			params: Record<string, unknown>
		},
	): Promise<void> {
		await api.put(`/items/${id}`, payload)
	},
}

export const aiService = {
	async generateDescription(
		payload: AiDescriptionRequest,
		signal?: AbortSignal,
	): Promise<AiDescriptionResponse> {
		const { data } = await api.post<AiDescriptionResponse>(
			'/ai/description',
			payload,
			{
				signal,
				timeout: AI_REQUEST_TIMEOUT_MS,
			},
		)
		return data
	},
	async suggestPrice(
		payload: AiPriceRequest,
		signal?: AbortSignal,
	): Promise<AiPriceResponse> {
		const { data } = await api.post<AiPriceResponse>('/ai/price', payload, {
			signal,
			timeout: AI_REQUEST_TIMEOUT_MS,
		})
		return data
	},
	async chat(payload: AiChatRequest, signal?: AbortSignal): Promise<AiChatResponse> {
		const { data } = await api.post<AiChatResponse>('/ai/chat', payload, {
			signal,
			timeout: AI_REQUEST_TIMEOUT_MS,
		})
		return data
	},
}
