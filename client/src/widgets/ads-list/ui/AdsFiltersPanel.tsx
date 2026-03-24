import {
	Button,
	Checkbox,
	Collapse,
	Divider,
	Group,
	Paper,
	Stack,
	Switch,
	Text,
	UnstyledButton,
} from '@mantine/core'
import { IconChevronUp } from '@tabler/icons-react'

import { ALL_CATEGORIES } from '@/features/ads-list-filters'
import { CATEGORY_LABELS, type Category } from '@/entities/ad'

interface Props {
	isCategoriesOpen: boolean
	onToggleCategories: () => void
	selectedCategories: Category[]
	onToggleCategory: (category: Category) => void
	needsRevision: boolean
	onNeedsRevisionChange: (value: boolean) => void
	onResetFilters: () => void
}

export const AdsFiltersPanel = ({
	isCategoriesOpen,
	onToggleCategories,
	selectedCategories,
	onToggleCategory,
	needsRevision,
	onNeedsRevisionChange,
	onResetFilters,
}: Props) => (
	<Paper withBorder p="md" radius="md">
		<Stack>
			<Text fw={600}>Фильтры</Text>
			<UnstyledButton onClick={onToggleCategories}>
				<Group justify="space-between">
					<Text fw={500}>Категории</Text>
					<IconChevronUp
						size={18}
						style={{
							transform: isCategoriesOpen ? 'rotate(0deg)' : 'rotate(180deg)',
							transition: 'transform 0.15s ease',
						}}
					/>
				</Group>
			</UnstyledButton>
			<Collapse in={isCategoriesOpen}>
				<Stack gap="xs">
					{ALL_CATEGORIES.map((category) => (
						<Checkbox
							key={category}
							label={CATEGORY_LABELS[category]}
							checked={selectedCategories.includes(category)}
							onChange={() => onToggleCategory(category)}
						/>
					))}
				</Stack>
			</Collapse>
			<Divider />
			<Switch
				label="Только требующие доработки"
				checked={needsRevision}
				onChange={(e) => onNeedsRevisionChange(e.currentTarget.checked)}
			/>
			<Button variant="default" onClick={onResetFilters}>Сбросить фильтры</Button>
		</Stack>
	</Paper>
)
