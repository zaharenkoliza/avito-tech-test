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
}: Props) => {
	const hasActiveFilters = selectedCategories.length > 0 || needsRevision

	return (
		<Stack gap={12}>
			<Paper
				bg="#ffffff"
				radius={12}
				p={20}
				style={{
					border: '1px solid #f0ece8',
				}}
			>
				<Stack gap={18}>
					<Text
						style={{
							fontSize: 16,
							lineHeight: '22px',
							fontWeight: 700,
							color: '#2f2f2f',
						}}
					>
						Фильтры
					</Text>

					<Stack gap={14}>
						<UnstyledButton onClick={onToggleCategories}>
							<Group justify="space-between" align="center">
								<Text
									style={{
										fontSize: 14,
										lineHeight: '20px',
										fontWeight: 400,
										color: '#2f2f2f',
									}}
								>
									Категория
								</Text>
								<IconChevronUp
									size={18}
									stroke={1.7}
									style={{
										transform: isCategoriesOpen ? 'rotate(0deg)' : 'rotate(180deg)',
										transition: 'transform 0.15s ease',
										color: '#2f2f2f',
									}}
								/>
							</Group>
						</UnstyledButton>

						<Collapse in={isCategoriesOpen}>
							<Stack gap={14}>
								{ALL_CATEGORIES.map((category) => (
									<Checkbox
										key={category}
										label={CATEGORY_LABELS[category]}
										checked={selectedCategories.includes(category)}
										onChange={() => onToggleCategory(category)}
										iconColor="#ffffff"
										styles={{
											root: {
												display: 'flex',
												alignItems: 'center',
											},
											body: {
												alignItems: 'center',
											},
											input: {
												width: 20,
												height: 20,
												borderColor: '#d9d9d9',
												borderRadius: 4,
											},
											label: {
												paddingLeft: 10,
												fontSize: 14,
												lineHeight: '20px',
												fontWeight: 400,
												color: '#2f2f2f',
											},
										}}
									/>
								))}
							</Stack>
						</Collapse>
					</Stack>

					<Divider color="#f0ece8" />

					<Group justify="space-between" align="center" wrap="nowrap">
						<Text
							style={{
								fontSize: 14,
								lineHeight: '18px',
								fontWeight: 700,
								color: '#3a3a3a',
								maxWidth: 140,
							}}
						>
							Только требующие доработок
						</Text>
						<Switch
							checked={needsRevision}
							onChange={(e) => onNeedsRevisionChange(e.currentTarget.checked)}
							size="sm"
							styles={{
								track: {
									width: 44,
									height: 22,
									minWidth: 44,
									border: 'none',
									borderRadius: 999,
									backgroundColor: needsRevision ? '#d9e9ff' : '#d1d1d1',
									transition: 'background-color 160ms ease',
								},
								thumb: {
									width: 16,
									height: 16,
									border: '1px solid #ffffff',
									backgroundColor: needsRevision ? '#2f8cff' : '#ffffff',
									boxShadow: '0 1px 3px rgba(0, 0, 0, 0.18)',
									transition: 'background-color 160ms ease',
								},
								body: {
									alignItems: 'center',
								},
							}}
						/>
					</Group>
				</Stack>
			</Paper>

			<Paper
				bg="#ffffff"
				radius={12}
				p={8}
				style={{
					border: '1px solid #f0ece8',
				}}
			>
				<Button
					variant="subtle"
					fullWidth
					color="gray"
					disabled={!hasActiveFilters}
					onClick={onResetFilters}
					styles={{
						root: {
							height: 36,
							backgroundColor: '#ffffff',
						},
						label: {
							fontSize: 14,
							fontWeight: 400,
							color: hasActiveFilters ? '#8c8c8c' : '#b3b3b3',
						},
					}}
				>
					Сбросить фильтры
				</Button>
			</Paper>
		</Stack>
	)
}
