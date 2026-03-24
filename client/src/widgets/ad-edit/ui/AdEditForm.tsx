import {
	ActionIcon,
	Button,
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
import { IconX } from '@tabler/icons-react'

import { CATEGORY_LABELS, type Category, type ItemWithRevision } from '@/entities/ad'

const categoryOptions = [
	{ value: 'auto', label: CATEGORY_LABELS.auto },
	{ value: 'real_estate', label: CATEGORY_LABELS.real_estate },
	{ value: 'electronics', label: CATEGORY_LABELS.electronics },
]

const requiredLabel = (label: string) => (
	<span>
		<span style={{ color: 'var(--mantine-color-red-6)' }}>*</span> {label}
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
	const priceButtonLabel = isSuggestingPrice
		? 'Выполняется запрос'
		: hasRequestedPrice
			? 'Повторить запрос'
			: 'Узнать рыночную цену'

	const descriptionMode = form.values.description?.trim()
		? 'improve'
		: 'generate'

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
				onChange={(value) =>
					form.setFieldValue('category', (value ?? 'electronics') as Category)
				}
			/>
			<TextInput
				label={requiredLabel('Название')}
				required
				rightSection={
					form.values.title
						? clearButton(() => form.setFieldValue('title', ''))
						: undefined
				}
				{...form.getInputProps('title')}
			/>

			<Stack gap="xs">
				<Group align="end" wrap="wrap">
					<NumberInput
						label={requiredLabel('Цена')}
						required
						min={0}
						flex={1}
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
								variant="light"
								onClick={onSuggestPrice}
								loading={isSuggestingPrice}
							>
								{priceButtonLabel}
							</Button>
						</Popover.Target>
						<Popover.Dropdown>
							<Stack gap="xs" maw={340}>
								<Text fw={600}>Ответ AI:</Text>
								{priceRequestError ? (
									<>
										<Text c="red" size="sm">{priceRequestError}</Text>
										<Button size="xs" variant="default" onClick={onClosePriceResult}>
											Закрыть
										</Button>
									</>
								) : (
									<>
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

			{form.values.category === 'auto' ? (
				<>
					<TextInput
						label="Марка"
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
						value={String(form.values.params.address ?? '')}
						onChange={(e) =>
							form.setFieldValue('params.address', e.currentTarget.value)
						}
						rightSection={
							form.values.params.address
								? clearButton(() => form.setFieldValue('params.address', ''))
								: undefined
						}
					/>
					<NumberInput
						label="Площадь"
						min={0}
						value={Number(form.values.params.area ?? 0)}
						onChange={(value) => form.setFieldValue('params.area', Number(value))}
					/>
				</>
			) : null}
			{form.values.category === 'electronics' ? (
				<>
					<TextInput
						label="Бренд"
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

			<Stack gap="xs">
				<Textarea
					label="Описание"
					autosize
					minRows={6}
					{...form.getInputProps('description')}
					description={`Символов: ${(form.values.description ?? '').length}`}
				/>
				<Popover
					opened={Boolean(descriptionSuggestion || descriptionRequestError)}
					position="bottom-start"
					withArrow
					shadow="md"
				>
					<Popover.Target>
						<Button
							variant="light"
							onClick={() => onRequestDescription(descriptionMode)}
							loading={isGeneratingDescription}
						>
							{descriptionButtonLabel}
						</Button>
					</Popover.Target>
					<Popover.Dropdown>
						<Stack gap="xs" maw={380}>
							<Text fw={600}>Ответ AI:</Text>
							{descriptionRequestError ? (
								<>
									<Text c="red" size="sm">{descriptionRequestError}</Text>
									<Button size="xs" variant="default" onClick={onCloseDescriptionResult}>
										Закрыть
									</Button>
								</>
							) : (
								<>
									<Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
										{descriptionSuggestion ?? ''}
									</Text>
									<Group gap="xs">
										<Button size="xs" onClick={onApplyDescription}>
											Применить
										</Button>
										<Button
											size="xs"
											variant="default"
											onClick={onCloseDescriptionResult}
										>
											Закрыть
										</Button>
									</Group>
								</>
							)}
						</Stack>
					</Popover.Dropdown>
				</Popover>
			</Stack>
		</Stack>
	)
}


