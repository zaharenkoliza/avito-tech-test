import {
	Alert,
	Button,
	Grid,
	Group,
	Stack,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle } from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AdAiChatCard, AdEditForm } from '@/widgets/ad-edit'
import { getErrorMessage } from '@/shared/api/apiClient'
import { aiService, adsService } from '@/shared/api/services'
import { type ItemWithRevision } from '@/entities/ad'
import { storage } from '@/shared/storage/localStorage'
import { AppLoader } from '@/shared/ui/AppLoader'

import type { ChatMessage } from '@/shared/api'

const DRAFT_KEY = 'avito_item_drafts'
const CHAT_KEY = 'avito_ai_chat_history'

type DraftMap = Record<number, Partial<ItemWithRevision>>
type PriceSuggestion = Record<number, { value: number; rationale: string }>
type RequestErrors = Record<number, string | undefined>
type RequestFlags = Record<number, boolean>

export const AdEditPage = () => {
	const { id: idRaw } = useParams()
	const navigate = useNavigate()
	const [drafts, setDrafts] = useState<DraftMap>(() => storage.get<DraftMap>(DRAFT_KEY, {}))
	const [descriptionSuggestion, setDescriptionSuggestionMap] = useState<
		Record<number, string>
	>({})
	const [priceSuggestion, setPriceSuggestionMap] = useState<PriceSuggestion>({})
	const [descriptionRequestError, setDescriptionRequestError] = useState<RequestErrors>({})
	const [priceRequestError, setPriceRequestError] = useState<RequestErrors>({})
	const [chatRequestError, setChatRequestError] = useState<RequestErrors>({})
	const [descriptionRequested, setDescriptionRequested] = useState<RequestFlags>({})
	const [priceRequested, setPriceRequested] = useState<RequestFlags>({})
	const [chatHistory, setChatHistory] = useState<Record<number, ChatMessage[]>>(() =>
		storage.get<Record<number, ChatMessage[]>>(CHAT_KEY, {}),
	)
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [isChatSending, setIsChatSending] = useState(false)
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
	const [isSuggestingPrice, setIsSuggestingPrice] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [item, setItem] = useState<ItemWithRevision | null>(null)

	useEffect(() => {
		document.body.style.background = '#ffffff'
	}, [])

	const id = Number(idRaw)
	const draftsRef = useRef(drafts)

	const form = useForm<ItemWithRevision>({
		initialValues: {
			id: 0,
			category: 'electronics',
			title: '',
			description: '',
			price: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			params: {},
			needsRevision: false,
		},
		validate: {
			title: (value) => (value.trim().length === 0 ? 'Введите название' : null),
			price: (value) => (value === null || value < 0 ? 'Цена должна быть >= 0' : null),
		},
		validateInputOnChange: true,
		validateInputOnBlur: true,
	})
	const setFormValuesRef = useRef(form.setValues)

	useEffect(() => {
		draftsRef.current = drafts
	}, [drafts])

	useEffect(() => {
		setFormValuesRef.current = form.setValues
	}, [form.setValues])

	const saveDraft = useCallback((draftId: number, data: Partial<ItemWithRevision>) => {
		setDrafts((prev) => {
			const prevDraft = prev[draftId]
			if (JSON.stringify(prevDraft) === JSON.stringify(data)) {
				return prev
			}

			const next = { ...prev, [draftId]: data }
			storage.set(DRAFT_KEY, next)
			return next
		})
	}, [])

	const clearDraft = useCallback((draftId: number) => {
		setDrafts((prev) => {
			const next = { ...prev }
			delete next[draftId]
			storage.set(DRAFT_KEY, next)
			return next
		})
	}, [])

	const setDescriptionSuggestion = useCallback((adId: number, value: string) => {
		setDescriptionSuggestionMap((prev) => ({ ...prev, [adId]: value }))
	}, [])

	const setPriceSuggestion = useCallback((adId: number, value: number, rationale: string) => {
		setPriceSuggestionMap((prev) => ({ ...prev, [adId]: { value, rationale } }))
	}, [])

	const clearPriceSuggestion = useCallback((adId: number) => {
		setPriceSuggestionMap((prev) => {
			if (!(adId in prev)) return prev
			const next = { ...prev }
			delete next[adId]
			return next
		})
	}, [])

	const clearDescriptionSuggestion = useCallback((adId: number) => {
		setDescriptionSuggestionMap((prev) => {
			if (!(adId in prev)) return prev
			const next = { ...prev }
			delete next[adId]
			return next
		})
	}, [])

	const addChatMessage = useCallback((adId: number, message: ChatMessage) => {
		setChatHistory((prev) => {
			const next = {
				...prev,
				[adId]: [...(prev[adId] ?? []), message],
			}
			storage.set(CHAT_KEY, next)
			return next
		})
	}, [])

	useEffect(() => {
		if (!Number.isFinite(id)) {
			void navigate('/ads')
			return
		}

		const controller = new AbortController()
		setLoading(true)
		setError(null)

		void adsService
			.getAd(id, controller.signal)
			.then((response) => {
				setItem(response)
				const draft = draftsRef.current[id]
				if (draft) {
					setFormValuesRef.current({ ...response, ...draft } as ItemWithRevision)
				} else {
					setFormValuesRef.current(response)
				}
			})
			.catch((e) => {
				if (controller.signal.aborted) return
				setError(getErrorMessage(e))
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false)
			})

		return () => controller.abort()
	}, [id, navigate])

	useEffect(() => {
		if (!item) return
		const timeoutId = window.setTimeout(() => {
			saveDraft(id, form.values)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [form.values, id, item, saveDraft])

	const chat = chatHistory[id] ?? []
	const descriptionSuggestionForAd = descriptionSuggestion[id]
	const priceSuggestionForAd = priceSuggestion[id]
	const descriptionRequestErrorForAd = descriptionRequestError[id]
	const priceRequestErrorForAd = priceRequestError[id]
	const chatRequestErrorForAd = chatRequestError[id]
	const hasRequestedDescription = Boolean(descriptionRequested[id])
	const hasRequestedPrice = Boolean(priceRequested[id])

	const runGenerateDescription = async (mode: 'generate' | 'improve') => {
		if (isGeneratingDescription) return
		setIsGeneratingDescription(true)
		setDescriptionRequestError((prev) => ({ ...prev, [id]: undefined }))
		clearDescriptionSuggestion(id)
		try {
			const response = await aiService.generateDescription({
				item: form.values,
				mode,
			})
			setDescriptionSuggestion(id, response.description)
			setDescriptionRequested((prev) => ({ ...prev, [id]: true }))
		} catch (e) {
			const message = getErrorMessage(e)
			setDescriptionRequestError((prev) => ({ ...prev, [id]: message }))
			setDescriptionRequested((prev) => ({ ...prev, [id]: true }))
		} finally {
			setIsGeneratingDescription(false)
		}
	}

	const runPriceSuggestion = async () => {
		if (isSuggestingPrice) return
		setIsSuggestingPrice(true)
		setPriceRequestError((prev) => ({ ...prev, [id]: undefined }))
		clearPriceSuggestion(id)
		try {
			const response = await aiService.suggestPrice({ item: form.values })
			setPriceSuggestion(id, response.priceSuggestion, response.rationale)
			setPriceRequested((prev) => ({ ...prev, [id]: true }))
		} catch (e) {
			const message = getErrorMessage(e)
			setPriceRequestError((prev) => ({ ...prev, [id]: message }))
			setPriceRequested((prev) => ({ ...prev, [id]: true }))
		} finally {
			setIsSuggestingPrice(false)
		}
	}

	const sendChat = async (message: string) => {
		if (isChatSending) return
		setIsChatSending(true)
		setChatRequestError((prev) => ({ ...prev, [id]: undefined }))
		addChatMessage(id, { role: 'user', content: message })
		try {
			const response = await aiService.chat({
				item: form.values,
				history: chat,
				message,
			})
			addChatMessage(id, { role: 'assistant', content: response.reply })
		} catch (e) {
			setChatRequestError((prev) => ({ ...prev, [id]: getErrorMessage(e) }))
		} finally {
			setIsChatSending(false)
		}
	}

	const save = form.onSubmit(async (values) => {
		if (saving) return
		setSaving(true)
		setError(null)
		try {
			await adsService.updateAd(id, {
				category: values.category,
				title: values.title,
				description: values.description,
				price: values.price ?? 0,
				params: values.params as Record<string, unknown>,
			})
			clearDraft(id)
			notifications.show({
				title: 'Изменения сохранены',
				message: 'Переходим к просмотру объявления',
				color: 'green',
			})
			void navigate(`/ads/${id}`)
		} catch (e) {
			const message = getErrorMessage(e)
			setError(message)
			notifications.show({
				title: 'Ошибка сохранения',
				message,
				color: 'red',
			})
		} finally {
			setSaving(false)
		}
	})

	const isTitleValid = form.values.title.trim().length > 0
	const isPriceValid = form.values.price !== null && form.values.price >= 0
	const isSaveDisabled = !isTitleValid || !isPriceValid || saving

	if (loading) {
		return <AppLoader />
	}

	if (error || !item) {
		return (
			<Stack p="lg">
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{error ?? 'Объявление не найдено'}
				</Alert>
				<Button component={Link} to="/ads" variant="default">
					Назад к списку
				</Button>
			</Stack>
		)
	}

	return (
		<Stack p="lg" gap="lg">
			<Title order={2}>Редактирование объявления</Title>

			{error ? (
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{error}
				</Alert>
			) : null}

			<Grid>
				<Grid.Col span={{ base: 12, lg: 8 }}>
					<form onSubmit={save}>
						<AdEditForm
							form={form}
							onSuggestPrice={() => void runPriceSuggestion()}
							isSuggestingPrice={isSuggestingPrice}
							hasRequestedPrice={hasRequestedPrice}
							priceSuggestion={priceSuggestionForAd}
							priceRequestError={priceRequestErrorForAd}
							onApplyPrice={() => {
								if (priceSuggestionForAd) {
									form.setFieldValue('price', priceSuggestionForAd.value)
									clearPriceSuggestion(id)
									setPriceRequestError((prev) => ({ ...prev, [id]: undefined }))
								}
							}}
							onClosePriceResult={() => {
								clearPriceSuggestion(id)
								setPriceRequestError((prev) => ({ ...prev, [id]: undefined }))
							}}
							onRequestDescription={(mode) => void runGenerateDescription(mode)}
							isGeneratingDescription={isGeneratingDescription}
							hasRequestedDescription={hasRequestedDescription}
							descriptionSuggestion={descriptionSuggestionForAd}
							descriptionRequestError={descriptionRequestErrorForAd}
							onApplyDescription={() => {
								if (descriptionSuggestionForAd) {
									form.setFieldValue('description', descriptionSuggestionForAd)
									clearDescriptionSuggestion(id)
									setDescriptionRequestError((prev) => ({ ...prev, [id]: undefined }))
								}
							}}
							onCloseDescriptionResult={() => {
								clearDescriptionSuggestion(id)
								setDescriptionRequestError((prev) => ({ ...prev, [id]: undefined }))
							}}
						/>
					</form>
				</Grid.Col>
				<Grid.Col span={{ base: 12, lg: 4 }}>
					<Stack>
						<AdAiChatCard
							chat={chat}
							isSending={isChatSending}
							error={chatRequestErrorForAd}
							onCloseError={() =>
								setChatRequestError((prev) => ({ ...prev, [id]: undefined }))
							}
							onSend={(message) => void sendChat(message)}
						/>
					</Stack>
				</Grid.Col>
			</Grid>

			<Group justify="flex-start">
				<Button
					onClick={() => void save()}
					loading={saving}
					disabled={isSaveDisabled}
					w={108}
					h={38}
					radius={8}
					px={12}
					py={8}
					fw={400}
					fz="md"
					style={{
						fontStyle: 'normal',
						lineHeight: '140%',
						letterSpacing: '0',
					}}
				>
					Сохранить
				</Button>
				<Button
					variant="filled"
					color="gray.2"
					c="dark.4"
					component={Link}
					to={`/ads/${id}`}
					w={108}
					h={38}
					radius={8}
					px={12}
					py={8}
					fw={400}
					fz="md"
					style={{
						fontStyle: 'normal',
						lineHeight: '140%',
						letterSpacing: '0',
					}}
				>
					Отменить
				</Button>
			</Group>
		</Stack>
	)
}





