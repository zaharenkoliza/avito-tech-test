import { Group, SegmentedControl, Select, TextInput } from '@mantine/core'
import { IconLayoutGrid, IconList } from '@tabler/icons-react'

import type { ListState } from '@/features/ads-list-filters'

const sortOptions = [
	{ value: 'createdAt:desc', label: 'По новизне (сначала новые)' },
	{ value: 'createdAt:asc', label: 'Сначала старые' },
	{ value: 'title:asc', label: 'По названию А-Я' },
	{ value: 'title:desc', label: 'По названию Я-А' },
	{ value: 'price:asc', label: 'По цене (сначала дешевле)' },
	{ value: 'price:desc', label: 'По цене (сначала дороже)' },
]

interface Props {
	searchInput: string
	onSearchInputChange: (value: string) => void
	layout: ListState['layout']
	onLayoutChange: (value: ListState['layout']) => void
	sortValue: string
	onSortChange: (sort: {
		sortColumn: ListState['sortColumn']
		sortDirection: ListState['sortDirection']
	}) => void
}

export const AdsToolbar = ({
	searchInput,
	onSearchInputChange,
	layout,
	onLayoutChange,
	sortValue,
	onSortChange,
}: Props) => (
	<Group grow>
		<TextInput
			label="Поиск по названию"
			value={searchInput}
			onChange={(e) => onSearchInputChange(e.currentTarget.value)}
			placeholder="Введите название объявления"
		/>
		<SegmentedControl
			mt={26}
			value={layout}
			onChange={(value) => onLayoutChange(value as ListState['layout'])}
			data={[
				{ value: 'grid', label: <IconLayoutGrid size={16} /> },
				{ value: 'list', label: <IconList size={16} /> },
			]}
		/>
		<Select
			label="Сортировка"
			data={sortOptions}
			value={sortValue}
			onChange={(value) => {
				const [sortColumn, sortDirection] = (value ?? 'createdAt:desc').split(':')
				onSortChange({
					sortColumn: sortColumn as ListState['sortColumn'],
					sortDirection: sortDirection as ListState['sortDirection'],
				})
			}}
		/>
	</Group>
)


