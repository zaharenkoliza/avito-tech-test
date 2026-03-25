import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { AdsListResponse } from "@/shared/api";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
	buildListQueryFromSearchParams,
	buildSearchParamsFromListState,
	setFromQueryState,
	setQuery,
} from "@/features/ads-list-filters";
import { getErrorMessage } from "@/shared/api/apiClient";
import { adsService } from "@/shared/api/services";
import { APP_CONFIG } from "@/shared/config/appConfig";

export const useAdsListPageState = () => {
	const dispatch = useAppDispatch();
	const listState = useAppSelector((state) => state.list);
	const [params, setParams] = useSearchParams();
	const paramsString = params.toString();
	const [initialQueryState] = useState(() =>
		buildListQueryFromSearchParams(new URLSearchParams(paramsString)),
	);
	const [data, setData] = useState<AdsListResponse>({ items: [], total: 0 });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchInput, setSearchInput] = useState(initialQueryState.q);
	const hasHydratedFromUrlRef = useRef(false);

	useEffect(() => {
		if (hasHydratedFromUrlRef.current) {
			return;
		}

		hasHydratedFromUrlRef.current = true;

		dispatch(
			setFromQueryState({
				q: initialQueryState.q,
				categories: initialQueryState.categories,
				needsRevision: initialQueryState.needsRevision,
				sortColumn: initialQueryState.sortColumn,
				sortDirection: initialQueryState.sortDirection,
				page: initialQueryState.page,
			}),
		);
	}, [dispatch, initialQueryState]);

	useEffect(() => {
		setSearchInput(listState.q);
	}, [listState.q]);

	useEffect(() => {
		if (!hasHydratedFromUrlRef.current) return;

		const timeoutId = window.setTimeout(() => {
			if (searchInput !== listState.q) {
				dispatch(setQuery(searchInput));
			}
		}, 400);

		return () => clearTimeout(timeoutId);
	}, [dispatch, listState.q, searchInput]);

	useEffect(() => {
		if (!hasHydratedFromUrlRef.current) return;

		const controller = new AbortController();
		setLoading(true);
		setError(null);

		adsService
			.getAds(
				{
					q: listState.q,
					categories: listState.categories,
					needsRevision: listState.needsRevision,
					sortColumn: listState.sortColumn,
					sortDirection: listState.sortDirection,
					limit: APP_CONFIG.pageSize,
					skip: (listState.page - 1) * APP_CONFIG.pageSize,
				},
				controller.signal,
			)
			.then(setData)
			.catch((requestError) => {
				if (controller.signal.aborted) return;
				setError(getErrorMessage(requestError));
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			});

		return () => controller.abort();
	}, [
		listState.categories,
		listState.needsRevision,
		listState.page,
		listState.q,
		listState.sortColumn,
		listState.sortDirection,
	]);

	useEffect(() => {
		if (!hasHydratedFromUrlRef.current) return;

		const nextParams = buildSearchParamsFromListState({
			q: listState.q,
			categories: listState.categories,
			needsRevision: listState.needsRevision,
			sortColumn: listState.sortColumn,
			sortDirection: listState.sortDirection,
			page: listState.page,
		});

		if (paramsString !== nextParams.toString()) {
			setParams(nextParams, { replace: true });
		}
	}, [
		listState.categories,
		listState.needsRevision,
		listState.page,
		listState.q,
		listState.sortColumn,
		listState.sortDirection,
		paramsString,
		setParams,
	]);

	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(data.total / APP_CONFIG.pageSize)),
		[data.total],
	);

	const sortValue = useMemo(
		() => `${listState.sortColumn}:${listState.sortDirection}`,
		[listState.sortColumn, listState.sortDirection],
	);

	return {
		data,
		dispatch,
		error,
		loading,
		listState,
		searchInput,
		setSearchInput,
		sortValue,
		totalPages,
	};
};
