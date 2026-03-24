import { Badge, Box, Card, Paper, SimpleGrid, Stack, Text } from '@mantine/core'
import { IconPhoto } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { CATEGORY_LABELS } from '@/entities/ad'
import { formatPrice } from '@/shared/utils/format'

import type { ListState } from '@/features/ads-list-filters'
import type { AdListItem } from '@/shared/api'

interface Props {
	items: AdListItem[]
	layout: ListState['layout']
}

const GRID_CARD_MIN_HEIGHT = 280
const GRID_CARD_ASPECT_RATIO = '200 / 280'

const renderGridCardContent = (item: AdListItem, hasId: boolean) => (
	<Stack gap={0} h="100%">
		<Paper
			radius={0}
			bg="#f3f2f1"
			style={{
				height: 150,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				marginInline: -12,
				marginTop: -12,
			}}
		>
			<IconPhoto size={52} stroke={1.6} color="#a7a7a7" />
		</Paper>

		<Stack
			gap={8}
			style={{
				height: 130,
				paddingTop: 10,
				boxSizing: 'border-box',
			}}
		>
			<Badge
				variant="outline"
				color="gray"
				radius="sm"
				size="sm"
				style={{
					width: 'fit-content',
					height: 22,
					textTransform: 'none',
					background: '#fff',
					fontWeight: 400,
					borderColor: '#d9d9d9',
					color: '#5f5f5f',
					marginTop: -18,
					marginLeft: 4,
					position: 'relative',
					zIndex: 1,
				}}
			>
				{CATEGORY_LABELS[item.category]}
			</Badge>

			<Text
				lineClamp={2}
				style={{
					minHeight: 48,
					fontFamily: 'Roboto, sans-serif',
					fontWeight: 400,
					fontSize: 15,
					lineHeight: '24px',
					letterSpacing: 0,
				}}
			>
				{item.title}
			</Text>

			<Box mt="auto" style={{ minHeight: 52 }}>
				<Text
					c="#7f7f7f"
					style={{
						fontFamily: 'Roboto, sans-serif',
						fontWeight: 700,
						fontSize: 14,
						lineHeight: '20px',
						letterSpacing: 0,
					}}
				>
					{formatPrice(item.price)}
				</Text>

				{!hasId ? (
					<Text size="xs" c="dimmed">
						Переход недоступен: backend не вернул id
					</Text>
				) : null}

				<Box mt={8} style={{ height: 24 }}>
					{item.needsRevision ? (
						<Badge
							color="orange"
							variant="light"
							radius="md"
							size="sm"
							style={{
								width: 'fit-content',
								textTransform: 'none',
							}}
						>
							Требует доработок
						</Badge>
					) : null}
				</Box>
			</Box>
		</Stack>
	</Stack>
)

const renderGridCard = (item: AdListItem, index: number) => {
	const hasId = typeof item.id === 'number'
	const key = item.id ?? `${item.title}-${index}`

	const sharedStyles = {
		aspectRatio: GRID_CARD_ASPECT_RATIO,
		minHeight: GRID_CARD_MIN_HEIGHT,
		padding: 12,
		borderColor: '#ece7e2',
		boxShadow: '0 1px 0 rgba(27, 31, 35, 0.02)',
	}

	if (hasId) {
		return (
			<Card
				key={key}
				withBorder
				radius={16}
				bg="#ffffff"
				component={Link}
				to={`/ads/${item.id}`}
				style={{
					...sharedStyles,
					cursor: 'pointer',
					textDecoration: 'none',
					color: 'inherit',
				}}
			>
				{renderGridCardContent(item, true)}
			</Card>
		)
	}

	return (
		<Card key={key} withBorder radius={16} bg="#ffffff" style={sharedStyles}>
			{renderGridCardContent(item, false)}
		</Card>
	)
}

const renderListCardContent = (item: AdListItem, hasId: boolean) => (
	<Box
		style={{
			display: 'grid',
			gridTemplateColumns: '152px 1fr',
			minHeight: 112,
		}}
	>
		<Paper
			radius={12}
			bg="#f6f4f2"
			style={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<IconPhoto size={52} stroke={1.6} color="#a7a7a7" />
		</Paper>

		<Stack gap={6} px={20} py={12} justify="center">
			<Text
				c="#9a9a9a"
				style={{
					fontFamily: 'Roboto, sans-serif',
					fontWeight: 400,
					fontSize: 14,
					lineHeight: '20px',
				}}
			>
				{CATEGORY_LABELS[item.category]}
			</Text>

			<Text
				style={{
					fontFamily: 'Roboto, sans-serif',
					fontWeight: 400,
					fontSize: 16,
					lineHeight: '24px',
					letterSpacing: 0,
				}}
			>
				{item.title}
			</Text>

			<Text
				c="#7f7f7f"
				style={{
					fontFamily: 'Roboto, sans-serif',
					fontWeight: 700,
					fontSize: 14,
					lineHeight: '20px',
					letterSpacing: 0,
				}}
			>
				{formatPrice(item.price)}
			</Text>

			{item.needsRevision ? (
				<Badge
					color="orange"
					variant="light"
					radius="md"
					size="sm"
					style={{
						width: 'fit-content',
						textTransform: 'none',
					}}
				>
					Требует доработок
				</Badge>
			) : null}

			{!hasId ? (
				<Text size="xs" c="dimmed">
					Переход недоступен: backend не вернул id
				</Text>
			) : null}
		</Stack>
	</Box>
)

const renderListCard = (item: AdListItem, index: number) => {
	const hasId = typeof item.id === 'number'
	const key = item.id ?? `${item.title}-${index}`

	const sharedStyles = {
		padding: 0,
		borderColor: '#ece7e2',
		boxShadow: '0 1px 0 rgba(27, 31, 35, 0.02)',
		overflow: 'hidden',
	}

	if (hasId) {
		return (
			<Card
				key={key}
				withBorder
				radius={16}
				bg="#ffffff"
				component={Link}
				to={`/ads/${item.id}`}
				style={{
					...sharedStyles,
					cursor: 'pointer',
					textDecoration: 'none',
					color: 'inherit',
				}}
			>
				{renderListCardContent(item, true)}
			</Card>
		)
	}

	return (
		<Card key={key} withBorder radius={16} bg="#ffffff" style={sharedStyles}>
			{renderListCardContent(item, false)}
		</Card>
	)
}

export const AdsResults = ({ items, layout }: Props) => {
	if (layout === 'list') {
		return <Stack gap={12}>{items.map((item, index) => renderListCard(item, index))}</Stack>
	}

	return (
		<SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5 }} spacing={14} verticalSpacing={14}>
			{items.map((item, index) => renderGridCard(item, index))}
		</SimpleGrid>
	)
}
