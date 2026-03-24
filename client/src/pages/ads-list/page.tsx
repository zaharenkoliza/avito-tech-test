import { Alert, Grid, Pagination, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AdsFiltersPanel, AdsResults, AdsToolbar } from '@/widgets/ads-list'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { getErrorMessage } from '@/shared/api/apiClient'
import { adsService } from '@/shared/api/services'
import { APP_CONFIG } from '@/shared/config/appConfig'
import { AppLoader } from '@/shared/ui/AppLoader'
import {
	buildListQueryFromSearchParams,
	buildSearchParamsFromListState,
} from '@/features/ads-list-filters'
import {
	resetFilters,
	setFromQueryState,
	setLayout,
	setNeedsRevision,
	setPage,
	setQuery,
	setSort,
	toggleCategory,
} from '@/features/ads-list-filters'

import type { AdsListResponse } from '@/shared/api'

export const AdsListPage = () => {
	const dispatch = useAppDispatch()
	const listState = useAppSelector((state) => state.list)
	const [params, setParams] = useSearchParams()
	const [data, setData] = useState<AdsListResponse>({ items: [], total: 0 })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
	const [searchInput, setSearchInput] = useState('')

	useEffect(() => {
		const parsed = buildListQueryFromSearchParams(params)
		dispatch(
			setFromQueryState({
				q: parsed.q,
				categories: parsed.categories,
				needsRevision: parsed.needsRevision,
				sortColumn: parsed.sortColumn,
				sortDirection: parsed.sortDirection,
				page: parsed.page,
			}),
		)
	}, [dispatch, params])

	useEffect(() => {
		setSearchInput(listState.q)
	}, [listState.q])

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			if (searchInput !== listState.q) {
				dispatch(setQuery(searchInput))
			}
		}, 400)

		return () => clearTimeout(timeoutId)
	}, [dispatch, listState.q, searchInput])

	useEffect(() => {
		const controller = new AbortController()
		setLoading(true)
		setError(null)

		const skip = (listState.page - 1) * APP_CONFIG.pageSize

		adsService
			.getAds(
				{
					q: listState.q,
					categories: listState.categories,
					needsRevision: listState.needsRevision,
					sortColumn: listState.sortColumn,
					sortDirection: listState.sortDirection,
					limit: APP_CONFIG.pageSize,
					skip,
				},
				controller.signal,
			)
			.then(setData)
			.catch((e) => {
				if (controller.signal.aborted) return
				setError(getErrorMessage(e))
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false)
			})

		const nextParams = buildSearchParamsFromListState({
			q: listState.q,
			categories: listState.categories,
			needsRevision: listState.needsRevision,
			sortColumn: listState.sortColumn,
			sortDirection: listState.sortDirection,
			page: listState.page,
		})
		if (params.toString() !== nextParams.toString()) {
			setParams(nextParams, { replace: true })
		}

		return () => controller.abort()
	}, [listState, params, setParams])

	const totalPages = Math.max(1, Math.ceil(data.total / APP_CONFIG.pageSize))
	const sortValue = `${listState.sortColumn}:${listState.sortDirection}`

	return (
		<Stack
			px={{ base: 'md', md: 0 }}
			py={0}
			gap="lg"
			style={{ width: '100%' }}
		>
			<div>
				<Title order={2}>Мои объявления</Title>
				<Text c="#8a8a8a" size="lg">
					Всего: {data.total}
				</Text>
			</div>

			<AdsToolbar
				searchInput={searchInput}
				onSearchInputChange={setSearchInput}
				layout={listState.layout}
				onLayoutChange={(value) => dispatch(setLayout(value))}
				sortValue={sortValue}
				onSortChange={(sort) => dispatch(setSort(sort))}
			/>

			<Grid align="flex-start" gutter="lg">
				<Grid.Col span={{ base: 12, md: 'content' }} w={{ md: 256 }}>
					<AdsFiltersPanel
						isCategoriesOpen={isCategoriesOpen}
						onToggleCategories={() => setIsCategoriesOpen((prev) => !prev)}
						selectedCategories={listState.categories}
						onToggleCategory={(category) => dispatch(toggleCategory(category))}
						needsRevision={listState.needsRevision}
						onNeedsRevisionChange={(value) => dispatch(setNeedsRevision(value))}
						onResetFilters={() => dispatch(resetFilters())}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 'auto' }}>
					<Stack gap="lg">
						{loading ? <AppLoader minHeight={160} padding="lg" /> : null}
						{error ? (
							<Alert color="red" icon={<IconAlertCircle size={16} />}>
								{error}
							</Alert>
						) : null}
						{!loading && !error ? (
							<AdsResults items={data.items} layout={listState.layout} />
						) : null}

						<Pagination
							value={listState.page}
							total={totalPages}
							onChange={(page) => dispatch(setPage(page))}
							size="md"
							radius="md"
						/>
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	)
}
