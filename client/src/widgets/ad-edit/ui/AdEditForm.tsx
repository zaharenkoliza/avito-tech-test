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

import { AiRequestErrorNotice } from './AiRequestErrorNotice'
import { DescriptionDiffCard } from './DescriptionDiffCard'

import type {
	AutoParams,
	ElectronicsParams,
	RealEstateParams,
} from '@/entities/ad/model/types'

import { CATEGORY_LABELS, type Category, type ItemWithRevision } from '@/entities/ad'
import { formatPrice } from '@/shared/utils/format'

const categoryOptions = [
	{ value: 'auto', label: CATEGORY_LABELS.auto },
	{ value: 'real_estate', label: CATEGORY_LABELS.real_estate },
	{ value: 'electronics', label: CATEGORY_LABELS.electronics },
]

const autoTransmissionOptions = [
	{ value: 'automatic', label: 'Автомат' },
	{ value: 'manual', label: 'Механика' },
]

const realEstateTypeOptions = [
	{ value: 'flat', label: 'Квартира' },
	{ value: 'house', label: 'Дом' },
	{ value: 'room', label: 'Комната' },
]

const electronicsTypeOptions = [
	{ value: 'phone', label: 'Телефон' },
	{ value: 'laptop', label: 'Ноутбук' },
	{ value: 'misc', label: 'Прочее' },
]

const electronicsConditionOptions = [
	{ value: 'new', label: 'Новый' },
	{ value: 'used', label: 'Б/У' },
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

const getEmptyParamsByCategory = (): ItemWithRevision['params'] => ({})

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

const renderTextField = (
	label: string,
	value: string,
	onChange: (value: string) => void,
	onClear: () => void,
) => (
	<TextInput
		label={label}
		radius={8}
		value={value}
		onChange={(event) => onChange(event.currentTarget.value)}
		rightSection={value ? clearButton(onClear) : undefined}
	/>
)

interface CategoryFieldsProps {
	form: UseFormReturnType<ItemWithRevision>
}

const AutoFields = ({ form }: CategoryFieldsProps) => {
	const params = form.values.params as AutoParams

	return (
		<>
			{renderTextField(
				'Марка',
				String(params.brand ?? ''),
				(value) => form.setFieldValue('params.brand', value),
				() => form.setFieldValue('params.brand', ''),
			)}
			{renderTextField(
				'Модель',
				String(params.model ?? ''),
				(value) => form.setFieldValue('params.model', value),
				() => form.setFieldValue('params.model', ''),
			)}
			<NumberInput
				label="Год выпуска"
				min={0}
				radius={8}
				allowDecimal={false}
				value={params.yearOfManufacture ?? ''}
				onChange={(value) =>
					form.setFieldValue(
						'params.yearOfManufacture',
						typeof value === 'number' ? value : undefined,
					)
				}
			/>
			<Select
				label="Коробка передач"
				radius={8}
				data={autoTransmissionOptions}
				value={params.transmission ?? null}
				onChange={(value) =>
					form.setFieldValue(
						'params.transmission',
						value === 'automatic' || value === 'manual' ? value : undefined,
					)
				}
				clearable
			/>
			<NumberInput
				label="Пробег"
				min={0}
				radius={8}
				value={params.mileage ?? ''}
				onChange={(value) =>
					form.setFieldValue('params.mileage', typeof value === 'number' ? value : undefined)
				}
			/>
			<NumberInput
				label="Мощность двигателя"
				min={0}
				radius={8}
				value={params.enginePower ?? ''}
				onChange={(value) =>
					form.setFieldValue(
						'params.enginePower',
						typeof value === 'number' ? value : undefined,
					)
				}
			/>
		</>
	)
}

const RealEstateFields = ({ form }: CategoryFieldsProps) => {
	const params = form.values.params as RealEstateParams

	return (
		<>
			<Select
				label="Тип недвижимости"
				radius={8}
				data={realEstateTypeOptions}
				value={params.type ?? null}
				onChange={(value) =>
					form.setFieldValue(
						'params.type',
						value === 'flat' || value === 'house' || value === 'room' ? value : undefined,
					)
				}
				clearable
			/>
			{renderTextField(
				'Адрес',
				String(params.address ?? ''),
				(value) => form.setFieldValue('params.address', value),
				() => form.setFieldValue('params.address', ''),
			)}
			<NumberInput
				label="Площадь"
				min={0}
				radius={8}
				value={params.area ?? ''}
				onChange={(value) =>
					form.setFieldValue('params.area', typeof value === 'number' ? value : undefined)
				}
			/>
			<NumberInput
				label="Этаж"
				min={0}
				radius={8}
				allowDecimal={false}
				value={params.floor ?? ''}
				onChange={(value) =>
					form.setFieldValue('params.floor', typeof value === 'number' ? value : undefined)
				}
			/>
		</>
	)
}

const ElectronicsFields = ({ form }: CategoryFieldsProps) => {
	const params = form.values.params as ElectronicsParams

	return (
		<>
			<Select
				label="Тип техники"
				radius={8}
				data={electronicsTypeOptions}
				value={params.type ?? null}
				onChange={(value) =>
					form.setFieldValue(
						'params.type',
						value === 'phone' || value === 'laptop' || value === 'misc' ? value : undefined,
					)
				}
				clearable
			/>
			{renderTextField(
				'Бренд',
				String(params.brand ?? ''),
				(value) => form.setFieldValue('params.brand', value),
				() => form.setFieldValue('params.brand', ''),
			)}
			{renderTextField(
				'Модель',
				String(params.model ?? ''),
				(value) => form.setFieldValue('params.model', value),
				() => form.setFieldValue('params.model', ''),
			)}
			<Select
				label="Состояние"
				radius={8}
				data={electronicsConditionOptions}
				value={params.condition ?? null}
				onChange={(value) =>
					form.setFieldValue(
						'params.condition',
						value === 'new' || value === 'used' ? value : undefined,
					)
				}
				clearable
			/>
			{renderTextField(
				'Цвет',
				String(params.color ?? ''),
				(value) => form.setFieldValue('params.color', value),
				() => form.setFieldValue('params.color', ''),
			)}
		</>
	)
}

const CategoryFields = ({ form }: CategoryFieldsProps) => {
	if (form.values.category === 'auto') {
		return <AutoFields form={form} />
	}

	if (form.values.category === 'real_estate') {
		return <RealEstateFields form={form} />
	}

	return <ElectronicsFields form={form} />
}

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

	const handleCategoryChange = (value: string | null) => {
		const nextCategory = (value ?? 'electronics') as Category

		if (nextCategory === form.values.category) {
			return
		}

		form.setValues({
			...form.values,
			category: nextCategory,
			params: getEmptyParamsByCategory(),
		} as ItemWithRevision)
	}

	return (
		<Stack>
			<Select
				label={requiredLabel('Категория')}
				data={categoryOptions}
				value={form.values.category}
				w={220}
				radius={8}
				onChange={handleCategoryChange}
				styles={{
					label: {
						fontWeight: 700,
						fontSize: 18,
						lineHeight: '24px',
						marginBottom: 8,
					},
				}}
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
				styles={{
					label: {
						fontWeight: 700,
						fontSize: 18,
						lineHeight: '24px',
						marginBottom: 8,
					},
				}}
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
						styles={{
							label: {
								fontWeight: 700,
								fontSize: 18,
								lineHeight: '24px',
								marginBottom: 8,
							},
						}}
					/>
					<Popover
						opened={Boolean(priceSuggestion ?? priceRequestError)}
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
						<Popover.Dropdown
							bg={priceRequestError ? 'transparent' : undefined}
							p={priceRequestError ? 0 : undefined}
							style={
								priceRequestError
									? {
											background: 'transparent',
											border: 'none',
											boxShadow: 'none',
									  }
									: undefined
							}
						>
							<Stack gap="xs" maw={340}>
								{priceRequestError ? (
									<AiRequestErrorNotice onClose={onClosePriceResult} />
								) : (
									<>
										<Text fw={600}>Ответ AI:</Text>
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

			<Text fw={700} size="lg">
				Характеристики
			</Text>
			<CategoryFields form={form} />
			<Divider />

			<Stack gap="xs">
				<Textarea
					label="Описание"
					autosize
					minRows={6}
					maxLength={1000}
					radius={8}
					{...form.getInputProps('description')}
					styles={{
						label: {
							fontWeight: 700,
							fontSize: 18,
							lineHeight: '24px',
							marginBottom: 8,
						},
					}}
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
					<AiRequestErrorNotice onClose={onCloseDescriptionResult} />
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
