import {
	Alert,
	Grid,
	Pagination,
	Stack,
	Text,
	Title,
	useMantineColorScheme,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { useAdsListPageState } from "./model/useAdsListPageState";

import {
	resetFilters,
	setLayout,
	setNeedsRevision,
	setPage,
	setSort,
	toggleCategory,
} from "@/features/ads-list-filters";
import { AppLoader } from "@/shared/ui/AppLoader";
import { formatAdsCount } from "@/shared/utils";
import { AdsFiltersPanel, AdsResults, AdsToolbar } from "@/widgets/ads-list";

export const AdsListPage = () => {
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";
	const {
		data,
		dispatch,
		error,
		loading,
		listState,
		searchInput,
		setSearchInput,
		sortValue,
		totalPages,
	} = useAdsListPageState();
	const isFiltered =
		searchInput.trim().length > 0 ||
		listState.categories.length > 0 ||
		listState.needsRevision;

	useEffect(() => {
		document.body.style.backgroundColor = isDark
			? "var(--mantine-color-dark-8)"
			: "#f7f5f8";

		return () => {
			document.body.style.backgroundColor = "";
		};
	}, [isDark]);

	return (
		<Stack px={{ base: "md", md: 0 }} py={0} gap="lg" style={{ width: "100%" }}>
			<div>
				<Title order={2}>Мои объявления</Title>
				<Text c={isDark ? "#9ea7b6" : "#8a8a8a"} size="lg">
					{formatAdsCount(data.total)}
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
				<Grid.Col span={{ base: 12, md: "content" }} w={{ md: 256 }}>
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
				<Grid.Col span={{ base: 12, md: "auto" }}>
					<Stack gap="lg">
						{loading ? <AppLoader minHeight={160} padding="lg" /> : null}
						{error ? (
							<Alert color="red" icon={<IconAlertCircle size={16} />}>
								{error}
							</Alert>
						) : null}
						{!loading && !error ? (
							<AdsResults
								items={data.items}
								layout={listState.layout}
								isFiltered={isFiltered}
							/>
						) : null}

						{!loading && data.total > 0 ? (
							<Pagination
								value={listState.page}
								total={totalPages}
								onChange={(page) => dispatch(setPage(page))}
								size="md"
								radius="md"
							/>
						) : null}
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};
