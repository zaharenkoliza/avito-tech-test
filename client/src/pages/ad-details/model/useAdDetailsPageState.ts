import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getMissingFields, type ItemWithRevision } from '@/entities/ad'
import { getErrorMessage } from '@/shared/api/apiClient'
import { adsService } from '@/shared/api/services'

export const useAdDetailsPageState = () => {
	const params = useParams()
	const navigate = useNavigate()
	const [item, setItem] = useState<ItemWithRevision | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

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
			.catch((requestError) => {
				if (controller.signal.aborted) return
				setError(getErrorMessage(requestError))
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					setLoading(false)
				}
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

	return {
		error,
		isEdited,
		item,
		loading,
		missing,
		paramsEntries,
	}
}
