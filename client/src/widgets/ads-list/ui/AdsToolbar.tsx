import {
	Box,
	Group,
	Paper,
	Select,
	TextInput,
	UnstyledButton,
	useMantineColorScheme,
} from "@mantine/core";
import { IconLayoutGrid, IconList, IconSearch } from "@tabler/icons-react";

import type { ListState } from "@/features/ads-list-filters";

const sortOptions = [
	{ value: "createdAt:desc", label: "По новизне (сначала новые)" },
	{ value: "createdAt:asc", label: "По новизне (сначала старые)" },
	{ value: "title:asc", label: "По названию (А-Я)" },
	{ value: "title:desc", label: "По названию (Я-А)" },
	{ value: "price:asc", label: "По цене (сначала дешевле)" },
	{ value: "price:desc", label: "По цене (сначала дороже)" },
];

interface Props {
	searchInput: string;
	onSearchInputChange: (value: string) => void;
	layout: ListState["layout"];
	onLayoutChange: (value: ListState["layout"]) => void;
	sortValue: string;
	onSortChange: (sort: {
		sortColumn: ListState["sortColumn"];
		sortDirection: ListState["sortDirection"];
	}) => void;
}

export const AdsToolbar = ({
	searchInput,
	onSearchInputChange,
	layout,
	onLayoutChange,
	sortValue,
	onSortChange,
}: Props) => {
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";

	return (
		<Paper
			bg={isDark ? "var(--mantine-color-dark-7)" : "#ffffff"}
			p={12}
			radius={8}
			style={{
				border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0ece8"}`,
			}}
		>
			<Group gap={12} wrap="nowrap" align="center">
				<TextInput
					flex={1}
					value={searchInput}
					onChange={(e) => onSearchInputChange(e.currentTarget.value)}
					placeholder="Найти объявление..."
					radius={8}
					rightSection={
						<IconSearch
							size={16}
							stroke={1.7}
							color={isDark ? "#9ea7b6" : "#666"}
						/>
					}
					styles={{
						input: {
							height: 36,
							backgroundColor: isDark
								? "var(--mantine-color-dark-6)"
								: "#fbfbfb",
							borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#efebe7",
							fontSize: 14,
						},
					}}
				/>

				<Box
					style={{
						position: "relative",
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						alignItems: "stretch",
						width: 92,
						height: 36,
						backgroundColor: isDark ? "var(--mantine-color-dark-6)" : "#fbfbfb",
						border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#efebe7"}`,
						borderRadius: 8,
						overflow: "hidden",
					}}
				>
					<Box
						style={{
							position: "absolute",
							left: "50%",
							top: 7,
							bottom: 7,
							width: 1,
							backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#e7e2dc",
							transform: "translateX(-0.5px)",
							pointerEvents: "none",
						}}
					/>

					<UnstyledButton
						onClick={() => onLayoutChange("grid")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
						}}
					>
						<IconLayoutGrid
							size={16}
							color={
								layout === "grid" ? "#2f8cff" : isDark ? "#c4cad4" : "#2f2f2f"
							}
						/>
					</UnstyledButton>

					<UnstyledButton
						onClick={() => onLayoutChange("list")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
						}}
					>
						<IconList
							size={16}
							color={
								layout === "list" ? "#2f8cff" : isDark ? "#c4cad4" : "#2f2f2f"
							}
						/>
					</UnstyledButton>
				</Box>

				<Select
					w={280}
					data={sortOptions}
					value={sortValue}
					radius={8}
					allowDeselect={false}
					styles={{
						input: {
							height: 36,
							backgroundColor: isDark
								? "var(--mantine-color-dark-6)"
								: "#ffffff",
							borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#efebe7",
							fontSize: 14,
						},
					}}
					onChange={(value) => {
						const [sortColumn, sortDirection] = (
							value ?? "createdAt:desc"
						).split(":");
						onSortChange({
							sortColumn: sortColumn as ListState["sortColumn"],
							sortDirection: sortDirection as ListState["sortDirection"],
						});
					}}
				/>
			</Group>
		</Paper>
	);
};
