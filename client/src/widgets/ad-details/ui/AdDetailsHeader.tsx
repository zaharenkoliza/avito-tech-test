import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft, IconPencil } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

import { formatPrice } from '@/shared/utils/format'

interface Props {
	id: number
	title: string
	price: number | null
	createdAt: string
	updatedAt: string
	isEdited: boolean
}

export const AdDetailsHeader = ({
	id,
	title,
	price,
	createdAt,
	updatedAt,
	isEdited,
}: Props) => (
	<Group justify="space-between" align="flex-start">
		<Stack gap={8} align="flex-start">
			<Title order={1}>{title}</Title>
			<Group gap="xs">
				<Button
					component={Link}
					to="/ads"
					variant="default"
					leftSection={<IconArrowLeft size={14} />}
					size="xs"
				>
					К списку товаров
				</Button>
				<Button
					component={Link}
					to={`/ads/${id}/edit`}
					leftSection={<IconPencil size={14} />}
					size="xs"
				>
					Редактировать
				</Button>
			</Group>
		</Stack>
		<Stack gap={4} align="end">
			<Text fw={700} size="36px">{formatPrice(price)}</Text>
			<Text c="dimmed" size="sm">
				Опубликовано: {dayjs(createdAt).format('D MMMM HH:mm')}
			</Text>
			{isEdited ? (
				<Text c="dimmed" size="sm">
					Отредактировано: {dayjs(updatedAt).format('D MMMM HH:mm')}
				</Text>
			) : null}
		</Stack>
	</Group>
)
