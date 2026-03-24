import { useCallback, useEffect, useRef, useState } from 'react'

import type { ItemWithRevision } from '@/entities/ad'
import type { AiDescriptionMode, ChatMessage } from '@/shared/api'

import { getErrorMessage } from '@/shared/api/apiClient'
import { aiService } from '@/shared/api/services'
import { storage } from '@/shared/storage/localStorage'

const CHAT_KEY = 'avito_ai_chat_history'

type AIRequestKind = 'description' | 'price' | 'chat'

interface PriceSuggestion {
	value: number
	rationale: string
}

interface UseAdAiParams {
	adId: number
}

export const useAdAi = ({ adId }: UseAdAiParams) => {
	const [descriptionSuggestion, setDescriptionSuggestion] = useState<string>()
	const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion>()
	const [descriptionRequestError, setDescriptionRequestError] = useState<string>()
	const [priceRequestError, setPriceRequestError] = useState<string>()
	const [chatRequestError, setChatRequestError] = useState<string>()
	const [hasRequestedDescription, setHasRequestedDescription] = useState(false)
	const [hasRequestedPrice, setHasRequestedPrice] = useState(false)
	const [chat, setChat] = useState<ChatMessage[]>([])
	const [isChatSending, setIsChatSending] = useState(false)
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
	const [isSuggestingPrice, setIsSuggestingPrice] = useState(false)
	const aiControllersRef = useRef<Partial<Record<AIRequestKind, AbortController>>>({})

	useEffect(() => {
		const controllers = aiControllersRef.current

		return () => {
			Object.values(controllers).forEach((controller) => controller?.abort())
		}
	}, [])

	useEffect(() => {
		const chatHistoryByAd = storage.get<Record<number, ChatMessage[]>>(CHAT_KEY, {})

		setChat(chatHistoryByAd[adId] ?? [])
		setDescriptionSuggestion(undefined)
		setPriceSuggestion(undefined)
		setDescriptionRequestError(undefined)
		setPriceRequestError(undefined)
		setChatRequestError(undefined)
		setHasRequestedDescription(false)
		setHasRequestedPrice(false)
		setIsChatSending(false)
		setIsGeneratingDescription(false)
		setIsSuggestingPrice(false)
	}, [adId])

	const persistChat = useCallback(
		(nextChat: ChatMessage[]) => {
			const chatHistoryByAd = storage.get<Record<number, ChatMessage[]>>(CHAT_KEY, {})
			storage.set(CHAT_KEY, { ...chatHistoryByAd, [adId]: nextChat })
		},
		[adId],
	)

	const addChatMessage = useCallback(
		(message: ChatMessage) => {
			setChat((prev) => {
				const nextChat = [...prev, message]
				persistChat(nextChat)
				return nextChat
			})
		},
		[persistChat],
	)

	const startAIRequest = useCallback((kind: AIRequestKind) => {
		aiControllersRef.current[kind]?.abort()
		const controller = new AbortController()
		aiControllersRef.current[kind] = controller
		return controller
	}, [])

	const finishAIRequest = useCallback((kind: AIRequestKind, controller: AbortController) => {
		if (aiControllersRef.current[kind] === controller) {
			delete aiControllersRef.current[kind]
		}
	}, [])

	const clearDescriptionResult = useCallback(() => {
		setDescriptionSuggestion(undefined)
		setDescriptionRequestError(undefined)
	}, [])

	const clearPriceResult = useCallback(() => {
		setPriceSuggestion(undefined)
		setPriceRequestError(undefined)
	}, [])

	const clearChatError = useCallback(() => {
		setChatRequestError(undefined)
	}, [])

	const generateDescription = useCallback(
		async (item: ItemWithRevision, mode: AiDescriptionMode) => {
			if (isGeneratingDescription) return

			const controller = startAIRequest('description')
			setIsGeneratingDescription(true)
			setDescriptionRequestError(undefined)
			setDescriptionSuggestion(undefined)

			try {
				const response = await aiService.generateDescription(
					{
						item,
						mode,
					},
					controller.signal,
				)

				if (controller.signal.aborted) return

				setDescriptionSuggestion(response.description)
				setHasRequestedDescription(true)
			} catch (error) {
				if (controller.signal.aborted) return

				setDescriptionRequestError(getErrorMessage(error))
				setHasRequestedDescription(true)
			} finally {
				if (!controller.signal.aborted) {
					setIsGeneratingDescription(false)
				}

				finishAIRequest('description', controller)
			}
		},
		[finishAIRequest, isGeneratingDescription, startAIRequest],
	)

	const suggestPrice = useCallback(
		async (item: ItemWithRevision) => {
			if (isSuggestingPrice) return

			const controller = startAIRequest('price')
			setIsSuggestingPrice(true)
			setPriceRequestError(undefined)
			setPriceSuggestion(undefined)

			try {
				const response = await aiService.suggestPrice({ item }, controller.signal)

				if (controller.signal.aborted) return

				setPriceSuggestion({
					value: response.priceSuggestion,
					rationale: response.rationale,
				})
				setHasRequestedPrice(true)
			} catch (error) {
				if (controller.signal.aborted) return

				setPriceRequestError(getErrorMessage(error))
				setHasRequestedPrice(true)
			} finally {
				if (!controller.signal.aborted) {
					setIsSuggestingPrice(false)
				}

				finishAIRequest('price', controller)
			}
		},
		[finishAIRequest, isSuggestingPrice, startAIRequest],
	)

	const sendChatMessage = useCallback(
		async (item: ItemWithRevision, message: string) => {
			if (isChatSending) return

			const controller = startAIRequest('chat')
			const history = chat

			setIsChatSending(true)
			setChatRequestError(undefined)
			addChatMessage({ role: 'user', content: message })

			try {
				const response = await aiService.chat(
					{
						item,
						history,
						message,
					},
					controller.signal,
				)

				if (controller.signal.aborted) return

				addChatMessage({ role: 'assistant', content: response.reply })
			} catch (error) {
				if (controller.signal.aborted) return

				setChatRequestError(getErrorMessage(error))
			} finally {
				if (!controller.signal.aborted) {
					setIsChatSending(false)
				}

				finishAIRequest('chat', controller)
			}
		},
		[addChatMessage, chat, finishAIRequest, isChatSending, startAIRequest],
	)

	return {
		chat,
		chatRequestError,
		clearChatError,
		clearDescriptionResult,
		clearPriceResult,
		descriptionRequestError,
		descriptionSuggestion,
		generateDescription,
		hasRequestedDescription,
		hasRequestedPrice,
		isChatSending,
		isGeneratingDescription,
		isSuggestingPrice,
		priceRequestError,
		priceSuggestion,
		sendChatMessage,
		suggestPrice,
	}
}
