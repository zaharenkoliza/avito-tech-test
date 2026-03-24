export const formatPrice = (price: number | null): string => {
	if (price === null) {
		return 'Не указана'
	}

	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
	}).format(price)
}

export const formatAdsCount = (count: number): string => {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return `${count} объявлений`
	}

	if (lastDigit === 1) {
		return `${count} объявление`
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return `${count} объявления`
	}

	return `${count} объявлений`
}
