import axios from 'axios'

import { APP_CONFIG } from '../config/appConfig'

export const api = axios.create({
	baseURL: APP_CONFIG.apiBaseUrl,
	timeout: 20000,
})

const extractErrorMessages = (value: unknown): string[] => {
	if (typeof value === 'string') {
		const trimmed = value.trim()
		return trimmed ? [trimmed] : []
	}

	if (Array.isArray(value)) {
		return value.flatMap(extractErrorMessages)
	}

	if (!value || typeof value !== 'object') {
		return []
	}

	const record = value as Record<string, unknown>
	const messages = 'errors' in record ? extractErrorMessages(record.errors) : []

	return [
		...messages,
		...Object.values(record).flatMap((nestedValue) => extractErrorMessages(nestedValue)),
	]
}

export const getErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		if (error.code === 'ECONNABORTED') {
			return 'Превышено время ожидания ответа AI. Попробуйте ещё раз.'
		}

		const responseError = (error.response?.data as { error?: unknown } | undefined)?.error
		const parsedMessages = extractErrorMessages(responseError)

		if (parsedMessages.length > 0) {
			return Array.from(new Set(parsedMessages)).join('\n')
		}

		return (
			(typeof responseError === 'string' ? responseError : undefined) ??
			error.message ??
			'Ошибка запроса'
		)
	}

	if (error instanceof Error) {
		return error.message
	}

	return 'Неизвестная ошибка'
}

export const isNotFoundError = (error: unknown): boolean =>
	axios.isAxiosError(error) && error.response?.status === 404
