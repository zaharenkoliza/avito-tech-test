import { Alert, Button, Divider, Grid, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import 'dayjs/locale/ru'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAdDetailsPageState } from './model/useAdDetailsPageState'

import { AppLoader } from '@/shared/ui/AppLoader'
import {
	AdCharacteristics,
	AdDetailsGallery,
	AdDetailsHeader,
	AdRevisionNotice,
} from '@/widgets/ad-details'

export const AdDetailsPage = () => {
	const { error, isEdited, item, loading, missing, paramsEntries } = useAdDetailsPageState()

	useEffect(() => {
		document.body.style.background = '#ffffff'
	}, [])

	if (loading) {
		return <AppLoader />
	}

	if (error || !item) {
		return (
			<Stack p="lg">
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{error ?? 'Объявление не найдено'}
				</Alert>
				<Button component={Link} to="/ads" variant="default">
					Назад к списку
				</Button>
			</Stack>
		)
	}

	return (
		<Stack p="lg" gap="lg" bg="white" mih="100vh">
			<AdDetailsHeader
				id={item.id}
				title={item.title}
				price={item.price}
				createdAt={item.createdAt}
				updatedAt={item.updatedAt}
				isEdited={isEdited}
			/>

			<Divider />

			<Grid>
				<Grid.Col span={{ base: 12, lg: 5 }}>
					<AdDetailsGallery />
				</Grid.Col>

				<Grid.Col span={{ base: 12, lg: 7 }}>
					<Stack gap="lg">
						{item.needsRevision ? <AdRevisionNotice missing={missing} /> : null}
						<AdCharacteristics paramsEntries={paramsEntries} />
					</Stack>
				</Grid.Col>
			</Grid>

			<Stack gap="xs">
				<Title order={3}>Описание</Title>
				<Text>{item.description?.trim() ? item.description : 'Отсутствует'}</Text>
			</Stack>
		</Stack>
	)
}


