import {
	Box,
	Card,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import type { ListState } from "@/features/ads-list-filters";
import type { AdListItem } from "@/shared/api";

import { CATEGORY_LABELS } from "@/entities/ad";
import { formatPrice } from "@/shared/utils/format";

interface Props {
	items: AdListItem[];
	layout: ListState["layout"];
	isFiltered?: boolean;
}

const GRID_CARD_MIN_HEIGHT = 280;
const GRID_CARD_ASPECT_RATIO = "200 / 280";

const RevisionBadge = ({ isDark }: { isDark: boolean }) => (
	<Box
		style={{
			display: "inline-flex",
			alignItems: "center",
			gap: 8,
			width: "fit-content",
			height: 26,
			paddingTop: 2,
			paddingRight: 8,
			paddingBottom: 2,
			paddingLeft: 8,
			boxSizing: "border-box",
			borderRadius: 8,
			backgroundColor: isDark ? "rgba(245, 159, 0, 0.16)" : "#fff4e8",
			color: isDark ? "#ffd08a" : "#f59f00",
			fontFamily: "Roboto, sans-serif",
			fontSize: 12,
			fontWeight: 400,
			lineHeight: "16px",
			opacity: 1,
		}}
	>
		<Box
			style={{
				width: 8,
				height: 8,
				borderRadius: "50%",
				backgroundColor: isDark ? "#ffb347" : "#f59f00",
				flexShrink: 0,
			}}
		/>
		<Text inherit span>
			Требует доработок
		</Text>
	</Box>
);

const renderGridCardContent = (
	item: AdListItem,
	hasId: boolean,
	isDark: boolean,
) => (
	<Stack gap={0} h="100%">
		<Paper
			radius={0}
			bg={isDark ? "var(--mantine-color-dark-6)" : "#f3f2f1"}
			style={{
				height: 150,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
				marginInline: -12,
				marginTop: -12,
			}}
		>
			<IconPhoto
				size={52}
				stroke={1.6}
				color={isDark ? "#69758a" : "#a7a7a7"}
			/>
		</Paper>

		<Stack
			gap={8}
			style={{
				height: 130,
				paddingTop: 10,
				boxSizing: "border-box",
			}}
		>
			<Box
				style={{
					width: "fit-content",
					height: 22,
					background: isDark ? "rgba(255, 255, 255, 0.04)" : "#fff",
					fontWeight: 400,
					borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#d9d9d9",
					color: isDark ? "#c4cad4" : "#5f5f5f",
					marginTop: -18,
					marginLeft: 4,
					position: "relative",
					zIndex: 1,
					border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "#d9d9d9"}`,
					borderRadius: 6,
					paddingInline: 8,
					display: "inline-flex",
					alignItems: "center",
					fontFamily: "Roboto, sans-serif",
					fontSize: 12,
					lineHeight: "16px",
				}}
			>
				{CATEGORY_LABELS[item.category]}
			</Box>

			<Text
				lineClamp={2}
				style={{
					minHeight: 48,
					fontFamily: "Roboto, sans-serif",
					fontWeight: 400,
					fontSize: 15,
					lineHeight: "24px",
					letterSpacing: 0,
				}}
			>
				{item.title}
			</Text>

			<Box mt="auto" style={{ minHeight: 52 }}>
				<Text
					c={isDark ? "#c4cad4" : "#7f7f7f"}
					style={{
						fontFamily: "Roboto, sans-serif",
						fontWeight: 700,
						fontSize: 14,
						lineHeight: "20px",
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
					{item.needsRevision ? <RevisionBadge isDark={isDark} /> : null}
				</Box>
			</Box>
		</Stack>
	</Stack>
);

const renderGridCard = (item: AdListItem, index: number, isDark: boolean) => {
	const hasId = typeof item.id === "number";
	const key = item.id ?? `${item.title}-${index}`;

	const sharedStyles = {
		aspectRatio: GRID_CARD_ASPECT_RATIO,
		minHeight: GRID_CARD_MIN_HEIGHT,
		padding: 12,
		borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ece7e2",
		boxShadow: isDark ? "none" : "0 1px 0 rgba(27, 31, 35, 0.02)",
	};

	if (hasId) {
		return (
			<Card
				key={key}
				withBorder
				radius={16}
				bg={isDark ? "var(--mantine-color-dark-7)" : "#ffffff"}
				component={Link}
				to={`/ads/${item.id}`}
				style={{
					...sharedStyles,
					cursor: "pointer",
					textDecoration: "none",
					color: "inherit",
				}}
			>
				{renderGridCardContent(item, true, isDark)}
			</Card>
		);
	}

	return (
		<Card
			key={key}
			withBorder
			radius={16}
			bg={isDark ? "var(--mantine-color-dark-7)" : "#ffffff"}
			style={sharedStyles}
		>
			{renderGridCardContent(item, false, isDark)}
		</Card>
	);
};

const renderListCardContent = (
	item: AdListItem,
	hasId: boolean,
	isDark: boolean,
) => (
	<Box
		style={{
			display: "grid",
			gridTemplateColumns: "152px 1fr",
			minHeight: 112,
		}}
	>
		<Paper
			radius={0}
			bg={isDark ? "var(--mantine-color-dark-6)" : "#f6f4f2"}
			style={{
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderTopLeftRadius: 12,
				borderBottomLeftRadius: 12,
			}}
		>
			<IconPhoto
				size={52}
				stroke={1.6}
				color={isDark ? "#69758a" : "#a7a7a7"}
			/>
		</Paper>

		<Stack gap={6} px={20} py={12} justify="center">
			<Text
				c={isDark ? "#9ea7b6" : "#9a9a9a"}
				style={{
					fontFamily: "Roboto, sans-serif",
					fontWeight: 400,
					fontSize: 14,
					lineHeight: "20px",
				}}
			>
				{CATEGORY_LABELS[item.category]}
			</Text>

			<Text
				style={{
					fontFamily: "Roboto, sans-serif",
					fontWeight: 400,
					fontSize: 16,
					lineHeight: "24px",
					letterSpacing: 0,
				}}
			>
				{item.title}
			</Text>

			<Text
				c={isDark ? "#c4cad4" : "#7f7f7f"}
				style={{
					fontFamily: "Roboto, sans-serif",
					fontWeight: 700,
					fontSize: 14,
					lineHeight: "20px",
					letterSpacing: 0,
				}}
			>
				{formatPrice(item.price)}
			</Text>

			{item.needsRevision ? <RevisionBadge isDark={isDark} /> : null}

			{!hasId ? (
				<Text size="xs" c="dimmed">
					Переход недоступен: backend не вернул id
				</Text>
			) : null}
		</Stack>
	</Box>
);

const renderListCard = (item: AdListItem, index: number, isDark: boolean) => {
	const hasId = typeof item.id === "number";
	const key = item.id ?? `${item.title}-${index}`;

	const sharedStyles = {
		padding: 0,
		borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ece7e2",
		boxShadow: isDark ? "none" : "0 1px 0 rgba(27, 31, 35, 0.02)",
		overflow: "hidden",
	};

	if (hasId) {
		return (
			<Card
				key={key}
				withBorder
				radius={16}
				bg={isDark ? "var(--mantine-color-dark-7)" : "#ffffff"}
				component={Link}
				to={`/ads/${item.id}`}
				style={{
					...sharedStyles,
					cursor: "pointer",
					textDecoration: "none",
					color: "inherit",
				}}
			>
				{renderListCardContent(item, true, isDark)}
			</Card>
		);
	}

	return (
		<Card
			key={key}
			withBorder
			radius={16}
			bg={isDark ? "var(--mantine-color-dark-7)" : "#ffffff"}
			style={sharedStyles}
		>
			{renderListCardContent(item, false, isDark)}
		</Card>
	);
};

export const AdsResults = ({ items, layout, isFiltered = false }: Props) => {
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";

	if (items.length === 0) {
		return (
			<Card
				withBorder
				radius={16}
				p="xl"
				bg={isDark ? "var(--mantine-color-dark-7)" : "#ffffff"}
				style={{
					borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ece7e2",
					boxShadow: isDark ? "none" : "0 1px 0 rgba(27, 31, 35, 0.02)",
				}}
			>
				<Stack gap={8} align="center" py={28}>
					<Text fw={700} size="lg">
						{isFiltered ? "Ничего не найдено" : "Объявлений пока нет"}
					</Text>
					<Text c="dimmed" ta="center" maw={420}>
						{isFiltered
							? "Попробуйте изменить запрос или сбросить часть фильтров."
							: "Когда объявления появятся, они будут показаны здесь."}
					</Text>
				</Stack>
			</Card>
		);
	}

	if (layout === "list") {
		return (
			<Stack gap={12}>
				{items.map((item, index) => renderListCard(item, index, isDark))}
			</Stack>
		);
	}

	return (
		<SimpleGrid
			cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5 }}
			spacing={14}
			verticalSpacing={14}
		>
			{items.map((item, index) => renderGridCard(item, index, isDark))}
		</SimpleGrid>
	);
};
