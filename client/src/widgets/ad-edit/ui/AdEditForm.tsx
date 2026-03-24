import {
	ActionIcon,
	Button,
	Divider,
	Group,
	NumberInput,
	Popover,
	Select,
	Stack,
	Text,
	TextInput,
	Textarea,
} from '@mantine/core'
import { type UseFormReturnType } from '@mantine/form'
import { IconBulb, IconLoader2, IconX } from '@tabler/icons-react'

import { CATEGORY_LABELS, type Category, type ItemWithRevision } from '@/entities/ad'
import { formatPrice } from '@/shared/utils/format'
import { DescriptionDiffCard } from './DescriptionDiffCard'

const categoryOptions = [
	{ value: 'auto', label: CATEGORY_LABELS.auto },
	{ value: 'real_estate', label: CATEGORY_LABELS.real_estate },
	{ value: 'electronics', label: CATEGORY_LABELS.electronics },
]

const requiredLabel = (label: string) => (
	<span>
		<span style={{ color: 'var(--mantine-color-red-6)', marginRight: 4 }}>*</span>
		{label}
	</span>
)

const clearButton = (onClear: () => void) => (
	<ActionIcon
		variant="subtle"
		color="gray"
		size="sm"
		onClick={(event) => {
			event.preventDefault()
			onClear()
		}}
		aria-label="Очистить поле"
	>
		<IconX size={12} />
	</ActionIcon>
)

const aiActionButtonProps = {
	variant: 'light' as const,
	color: 'orange' as const,
	radius: 8,
	w: 210,
	h: 36,
	px: 7,
	gap: 10,
	fw: 400,
	fz: 14,
	style: {
		fontFamily: 'Roboto, sans-serif',
		lineHeight: '22px',
		letterSpacing: '0',
		textAlign: 'center' as const,
	},
}

const aiButtonIcon = (isLoading: boolean) =>
	isLoading ? (
		<IconLoader2
			size={16}
			stroke={1.8}
			style={{ animation: 'spin 1s linear infinite' }}
		/>
	) : (
		<IconBulb size={16} stroke={1.8} />
	)

interface PriceSuggestion {
	value: number
	rationale: string
}

interface Props {
	form: UseFormReturnType<ItemWithRevision>
	onSuggestPrice: () => void
	isSuggestingPrice: boolean
	hasRequestedPrice: boolean
	priceSuggestion?: PriceSuggestion
	priceRequestError?: string
	onApplyPrice: () => void
	onClosePriceResult: () => void
	onRequestDescription: (mode: 'generate' | 'improve') => void
	isGeneratingDescription: boolean
	hasRequestedDescription: boolean
	descriptionSuggestion?: string
	descriptionRequestError?: string
	onApplyDescription: () => void
	onCloseDescriptionResult: () => void
}

export const AdEditForm = ({
	form,
	onSuggestPrice,
	isSuggestingPrice,
	hasRequestedPrice,
	priceSuggestion,
	priceRequestError,
	onApplyPrice,
	onClosePriceResult,
	onRequestDescription,
	isGeneratingDescription,
	hasRequestedDescription,
	descriptionSuggestion,
	descriptionRequestError,
	onApplyDescription,
	onCloseDescriptionResult,
}: Props) => {
	const descriptionLength = (form.values.description ?? '').length
	const priceButtonLabel = isSuggestingPrice
		? 'Выполняется запрос'
		: hasRequestedPrice
			? 'Повторить запрос'
			: 'Узнать рыночную цену'

	const descriptionMode = form.values.description?.trim() ? 'improve' : 'generate'

	const descriptionInitialLabel =
		descriptionMode === 'generate' ? 'Придумать описание' : 'Улучшить описание'

	const descriptionButtonLabel = isGeneratingDescription
		? 'Выполняется запрос'
		: hasRequestedDescription
			? 'Повторить запрос'
			: descriptionInitialLabel

	return (
		<Stack>
			<Select
				label={requiredLabel('Категория')}
				data={categoryOptions}
				value={form.values.category}
				w={220}
				radius={8}
				onChange={(value) =>
					form.setFieldValue('category', (value ?? 'electronics') as Category)
				}
			/>
			<Divider />

			<TextInput
				label={requiredLabel('Название')}
				required
				withAsterisk={false}
				radius={8}
				rightSection={
					form.values.title
						? clearButton(() => form.setFieldValue('title', ''))
						: undefined
				}
				{...form.getInputProps('title')}
			/>
			<Divider />

			<Stack gap="xs">
				<Group align="end" wrap="wrap">
					<NumberInput
						label={requiredLabel('Цена')}
						required
						withAsterisk={false}
						min={0}
						flex={1}
						radius={8}
						rightSection={clearButton(() => form.setFieldValue('price', null))}
						{...form.getInputProps('price')}
					/>
					<Popover
						opened={Boolean(priceSuggestion || priceRequestError)}
						position="bottom-start"
						withArrow
						shadow="md"
					>
						<Popover.Target>
							<Button
								{...aiActionButtonProps}
								leftSection={aiButtonIcon(isSuggestingPrice)}
								onClick={onSuggestPrice}
							>
								{priceButtonLabel}
							</Button>
						</Popover.Target>
						<Popover.Dropdown>
							<Stack gap="xs" maw={340}>
								<Text fw={600}>Ответ AI:</Text>
								{priceRequestError ? (
									<>
										<Button size="xs" variant="default" onClick={onClosePriceResult}>
											Закрыть
										</Button>
									</>
								) : (
									<>
										{priceSuggestion ? (
											<Text size="sm" fw={600}>
												Предлагаемая цена: {formatPrice(priceSuggestion.value)}
											</Text>
										) : null}
										<Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
											{priceSuggestion?.rationale ?? ''}
										</Text>
										<Group gap="xs">
											<Button size="xs" onClick={onApplyPrice}>
												Применить
											</Button>
											<Button size="xs" variant="default" onClick={onClosePriceResult}>
												Закрыть
											</Button>
										</Group>
									</>
								)}
							</Stack>
						</Popover.Dropdown>
					</Popover>
				</Group>
			</Stack>
			<Divider />

			{form.values.category === 'auto' ? (
				<>
					<TextInput
						label="Марка"
						radius={8}
						value={String(form.values.params.brand ?? '')}
						onChange={(e) => form.setFieldValue('params.brand', e.currentTarget.value)}
						rightSection={
							form.values.params.brand
								? clearButton(() => form.setFieldValue('params.brand', ''))
								: undefined
						}
					/>
					<TextInput
						label="Модель"
						radius={8}
						value={String(form.values.params.model ?? '')}
						onChange={(e) => form.setFieldValue('params.model', e.currentTarget.value)}
						rightSection={
							form.values.params.model
								? clearButton(() => form.setFieldValue('params.model', ''))
								: undefined
						}
					/>
				</>
			) : null}
			{form.values.category === 'real_estate' ? (
				<>
					<TextInput
						label="Адрес"
						radius={8}
						value={String(form.values.params.address ?? '')}
						onChange={(e) => form.setFieldValue('params.address', e.currentTarget.value)}
						rightSection={
							form.values.params.address
								? clearButton(() => form.setFieldValue('params.address', ''))
								: undefined
						}
					/>
					<NumberInput
						label="Площадь"
						min={0}
						radius={8}
						value={Number(form.values.params.area ?? 0)}
						onChange={(value) => form.setFieldValue('params.area', Number(value))}
					/>
				</>
			) : null}
			{form.values.category === 'electronics' ? (
				<>
					<TextInput
						label="Бренд"
						radius={8}
						value={String(form.values.params.brand ?? '')}
						onChange={(e) => form.setFieldValue('params.brand', e.currentTarget.value)}
						rightSection={
							form.values.params.brand
								? clearButton(() => form.setFieldValue('params.brand', ''))
								: undefined
						}
					/>
					<TextInput
						label="Модель"
						radius={8}
						value={String(form.values.params.model ?? '')}
						onChange={(e) => form.setFieldValue('params.model', e.currentTarget.value)}
						rightSection={
							form.values.params.model
								? clearButton(() => form.setFieldValue('params.model', ''))
								: undefined
						}
					/>
				</>
			) : null}
			<Divider />

			<Stack gap="xs">
				<Textarea
					label="Описание"
					autosize
					minRows={6}
					maxLength={1000}
					radius={8}
					{...form.getInputProps('description')}
				/>
				<Group justify="space-between" align="flex-end" wrap="nowrap">
					<Button
						{...aiActionButtonProps}
						leftSection={aiButtonIcon(isGeneratingDescription)}
						onClick={() => onRequestDescription(descriptionMode)}
					>
						{descriptionButtonLabel}
					</Button>
					<Text size="sm" c="dimmed" ta="right">
						{descriptionLength} / 1000
					</Text>
				</Group>
				{descriptionRequestError ? (
					<Stack gap="xs">
						<Group>
							<Button size="xs" variant="default" onClick={onCloseDescriptionResult}>
								Закрыть
							</Button>
						</Group>
					</Stack>
				) : null}
				{descriptionSuggestion ? (
					<DescriptionDiffCard
						originalText={form.values.description ?? ''}
						improvedText={descriptionSuggestion}
						onApply={onApplyDescription}
						onClose={onCloseDescriptionResult}
					/>
				) : null}
			</Stack>
		</Stack>
	)
}
