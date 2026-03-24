import type { Item } from '../model/types'

const isNil = (value: unknown) => value === undefined || value === null || value === ''

export const getMissingFields = (item: Item): string[] => {
	const missing: string[] = []

	if (isNil(item.description)) missing.push('Описание')
	if (isNil(item.price)) missing.push('Цена')

	if (item.category === 'auto') {
		if (isNil(item.params.brand)) missing.push('Марка')
		if (isNil(item.params.model)) missing.push('Модель')
		if (isNil(item.params.yearOfManufacture)) missing.push('Год выпуска')
		if (isNil(item.params.transmission)) missing.push('Коробка передач')
		if (isNil(item.params.mileage)) missing.push('Пробег')
		if (isNil(item.params.enginePower)) missing.push('Мощность двигателя')
	}

	if (item.category === 'real_estate') {
		if (isNil(item.params.type)) missing.push('Тип недвижимости')
		if (isNil(item.params.address)) missing.push('Адрес')
		if (isNil(item.params.area)) missing.push('Площадь')
		if (isNil(item.params.floor)) missing.push('Этаж')
	}

	if (item.category === 'electronics') {
		if (isNil(item.params.type)) missing.push('Тип техники')
		if (isNil(item.params.brand)) missing.push('Бренд')
		if (isNil(item.params.model)) missing.push('Модель')
		if (isNil(item.params.condition)) missing.push('Состояние')
		if (isNil(item.params.color)) missing.push('Цвет')
	}

	return missing
}
