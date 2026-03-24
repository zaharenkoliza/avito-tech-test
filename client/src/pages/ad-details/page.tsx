import { Alert, Button, Divider, Grid, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
	AdCharacteristics,
	AdDetailsGallery,
	AdDetailsHeader,
	AdRevisionNotice,
} from '@/widgets/ad-details'
import { getErrorMessage } from '@/shared/api/apiClient'
import { adsService } from '@/shared/api/services'
import { getMissingFields, type ItemWithRevision } from '@/entities/ad'
import { AppLoader } from '@/shared/ui/AppLoader'

dayjs.locale('ru')

export const AdDetailsPage = () => {
	const params = useParams()
	const navigate = useNavigate()
	const [item, setItem] = useState<ItemWithRevision | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		document.body.style.background = '#ffffff'
	}, [])

	useEffect(() => {
		const id = Number(params.id)
		if (!Number.isFinite(id)) {
			void navigate('/ads')
			return
		}

		const controller = new AbortController()
		setLoading(true)
		setError(null)

		void adsService
			.getAd(id, controller.signal)
			.then(setItem)
			.catch((e) => {
				if (controller.signal.aborted) return
				setError(getErrorMessage(e))
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false)
			})

		return () => controller.abort()
	}, [navigate, params.id])

	const missing = useMemo(() => (item ? getMissingFields(item) : []), [item])
	const paramsEntries = useMemo(
		() =>
			Object.entries(item?.params ?? {}).filter(
				([, value]) => value !== undefined && value !== null && value !== '',
			),
		[item],
	)
	const isEdited = useMemo(() => {
		if (!item) return false
		return dayjs(item.updatedAt).valueOf() > dayjs(item.createdAt).valueOf()
	}, [item])

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


