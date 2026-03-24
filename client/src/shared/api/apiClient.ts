import axios from 'axios'

import { APP_CONFIG } from '../config/appConfig'

export const api = axios.create({
	baseURL: APP_CONFIG.apiBaseUrl,
	timeout: 20000,
})

export const getErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		if (error.code === 'ECONNABORTED') {
			return 'Превышено время ожидания ответа AI. Попробуйте ещё раз.'
		}

		return (
			(error.response?.data as { error?: string } | undefined)?.error ??
			error.message ??
			'Ошибка запроса'
		)
	}

	if (error instanceof Error) {
		return error.message
	}

	return 'Неизвестная ошибка'
}
