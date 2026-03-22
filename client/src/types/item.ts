export type Category = 'auto' | 'real_estate' | 'electronics'

export interface AutoParams {
	brand?: string
	model?: string
	yearOfManufacture?: number
	transmission?: 'automatic' | 'manual'
	mileage?: number
	enginePower?: number
}

export interface RealEstateParams {
	type?: 'flat' | 'house' | 'room'
	address?: string
	area?: number
	floor?: number
}

export interface ElectronicsParams {
	type?: 'phone' | 'laptop' | 'misc'
	brand?: string
	model?: string
	condition?: 'new' | 'used'
	color?: string
}

export interface ItemBase {
	id: number
	title: string
	description?: string
	price: number | null
	createdAt: string
	updatedAt: string
	imageUrl?: string
}

export type Item =
	| (ItemBase & { category: 'auto'; params: AutoParams })
	| (ItemBase & { category: 'real_estate'; params: RealEstateParams })
	| (ItemBase & { category: 'electronics'; params: ElectronicsParams })

export type ItemWithRevision = Item & {
	needsRevision: boolean
}

export const CATEGORY_LABELS: Record<Category, string> = {
	auto: 'Транспорт',
	real_estate: 'Недвижимость',
	electronics: 'Электроника',
}
