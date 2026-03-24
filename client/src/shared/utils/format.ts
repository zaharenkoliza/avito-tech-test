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
