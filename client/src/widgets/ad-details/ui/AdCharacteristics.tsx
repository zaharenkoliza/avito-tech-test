import { Group, Stack, Text, Title } from '@mantine/core'

const PARAM_LABELS: Record<string, string> = {
	type: 'Тип',
	brand: 'Бренд',
	model: 'Модель',
	color: 'Цвет',
	condition: 'Состояние',
	address: 'Адрес',
	area: 'Площадь',
	floor: 'Этаж',
	yearOfManufacture: 'Год выпуска',
	transmission: 'КПП',
	mileage: 'Пробег',
	enginePower: 'Мощность',
}

const PARAM_VALUE_LABELS: Record<string, string> = {
	phone: 'Телефон',
	laptop: 'Ноутбук',
	misc: 'Прочее',
	new: 'Новый',
	used: 'Б/У',
	automatic: 'Автомат',
	manual: 'Механика',
	flat: 'Квартира',
	house: 'Дом',
	room: 'Комната',
}

const formatParamValue = (value: unknown): string => {
	if (value === undefined || value === null || value === '') return '—'
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		const raw = String(value)
		return PARAM_VALUE_LABELS[raw] ?? raw
	}
	return '—'
}

interface Props {
	paramsEntries: [string, unknown][]
}

export const AdCharacteristics = ({ paramsEntries }: Props) => (
	<Stack gap="sm">
		<Title order={3}>Характеристики</Title>
		<Stack gap={8}>
			{paramsEntries.length === 0 ? (
				<Text c="dimmed">Характеристики не заполнены</Text>
			) : (
				paramsEntries.map(([key, value]) => (
					<Group key={key} justify="space-between" maw={380}>
						<Text c="dimmed">{PARAM_LABELS[key] ?? key}</Text>
						<Text>{formatParamValue(value)}</Text>
					</Group>
				))
			)}
		</Stack>
	</Stack>
)

