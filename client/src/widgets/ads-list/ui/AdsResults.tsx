import { Badge, Card, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

import { formatPrice } from '@/shared/utils/format'
import { CATEGORY_LABELS } from '@/entities/ad'

import type { ListState } from '@/features/ads-list-filters'
import type { AdListItem } from '@/shared/api'

interface Props {
	items: AdListItem[]
	layout: ListState['layout']
}

export const AdsResults = ({ items, layout }: Props) => {
	if (layout === 'list') {
		return (
			<Stack>
				{items.map((item, index) => {
					const hasId = typeof item.id === 'number'

					if (hasId) {
						return (
							<Card
								key={item.id ?? `${item.title}-${index}`}
								withBorder
								radius="md"
								p="md"
								component={Link}
								to={`/ads/${item.id}`}
								style={{ cursor: 'pointer' }}
							>
								<Group justify="space-between" wrap="nowrap">
									<Stack gap={4}>
										<Group>
											<Text fw={600}>{item.title}</Text>
											<Badge variant="light">{CATEGORY_LABELS[item.category]}</Badge>
											{item.needsRevision ? <Badge color="orange">Требует доработки</Badge> : null}
										</Group>
										<Text c="dimmed">{formatPrice(item.price)}</Text>
									</Stack>
								</Group>
							</Card>
						)
					}

					return (
						<Card key={item.id ?? `${item.title}-${index}`} withBorder radius="md" p="md">
							<Group justify="space-between" wrap="nowrap">
								<Stack gap={4}>
									<Group>
										<Text fw={600}>{item.title}</Text>
										<Badge variant="light">{CATEGORY_LABELS[item.category]}</Badge>
										{item.needsRevision ? <Badge color="orange">Требует доработки</Badge> : null}
									</Group>
									<Text c="dimmed">{formatPrice(item.price)}</Text>
									<Text size="sm" c="dimmed">Переход недоступен: backend не вернул id</Text>
								</Stack>
							</Group>
						</Card>
					)
				})}
			</Stack>
		)
	}

	return (
		<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
			{items.map((item, index) => {
				const hasId = typeof item.id === 'number'

				if (hasId) {
					return (
						<Card
							key={item.id ?? `${item.title}-${index}`}
							withBorder
							radius="md"
							p="md"
							component={Link}
							to={`/ads/${item.id}`}
							style={{ cursor: 'pointer' }}
						>
							<Stack gap="sm">
								<Paper h={130} bg="gray.1" radius="md" />
								<Group justify="space-between" align="start">
									<Stack gap={4}>
										<Text fw={600}>{item.title}</Text>
										<Text c="dimmed" size="sm">{CATEGORY_LABELS[item.category]}</Text>
									</Stack>
									{item.needsRevision ? <Badge color="orange">Требует доработки</Badge> : null}
								</Group>
								<Text fw={700}>{formatPrice(item.price)}</Text>
							</Stack>
						</Card>
					)
				}

				return (
					<Card key={item.id ?? `${item.title}-${index}`} withBorder radius="md" p="md">
						<Stack gap="sm">
							<Paper h={130} bg="gray.1" radius="md" />
							<Group justify="space-between" align="start">
								<Stack gap={4}>
									<Text fw={600}>{item.title}</Text>
									<Text c="dimmed" size="sm">{CATEGORY_LABELS[item.category]}</Text>
								</Stack>
								{item.needsRevision ? <Badge color="orange">Требует доработки</Badge> : null}
							</Group>
							<Text fw={700}>{formatPrice(item.price)}</Text>
							<Text size="sm" c="dimmed">Переход недоступен: backend не вернул id</Text>
						</Stack>
					</Card>
				)
			})}
		</SimpleGrid>
	)
}
