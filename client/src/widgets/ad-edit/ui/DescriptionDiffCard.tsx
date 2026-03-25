import {
	Badge,
	Button,
	Card,
	Divider,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
} from "@mantine/core";
import { useMemo } from "react";

type DiffType = "same" | "added" | "removed";

interface DiffPart {
	type: DiffType;
	value: string;
}

interface Props {
	originalText: string;
	improvedText: string;
	onApply: () => void;
	onClose: () => void;
}

const tokenize = (text: string): string[] => {
	const normalized = text.trim();
	if (!normalized) return [];
	return normalized.split(/\s+/);
};

const buildWordDiff = (before: string, after: string): DiffPart[] => {
	const a = tokenize(before);
	const b = tokenize(after);
	const dp = Array.from({ length: a.length + 1 }, () =>
		Array<number>(b.length + 1).fill(0),
	);

	for (let i = a.length - 1; i >= 0; i -= 1) {
		for (let j = b.length - 1; j >= 0; j -= 1) {
			if (a[i] === b[j]) {
				dp[i][j] = dp[i + 1][j + 1] + 1;
			} else {
				dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
			}
		}
	}

	const parts: DiffPart[] = [];
	let i = 0;
	let j = 0;

	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			parts.push({ type: "same", value: a[i] });
			i += 1;
			j += 1;
			continue;
		}

		if (dp[i + 1][j] >= dp[i][j + 1]) {
			parts.push({ type: "removed", value: a[i] });
			i += 1;
		} else {
			parts.push({ type: "added", value: b[j] });
			j += 1;
		}
	}

	while (i < a.length) {
		parts.push({ type: "removed", value: a[i] });
		i += 1;
	}

	while (j < b.length) {
		parts.push({ type: "added", value: b[j] });
		j += 1;
	}

	return parts;
};

const renderDiffText = (parts: DiffPart[], mode: "before" | "after") => {
	const visible =
		mode === "before"
			? parts.filter((part) => part.type !== "added")
			: parts.filter((part) => part.type !== "removed");

	if (visible.length === 0) {
		return (
			<Text c="dimmed" size="sm">
				Текст отсутствует
			</Text>
		);
	}

	return (
		<Text size="sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
			{visible.map((part, index) => {
				const isRemoved = part.type === "removed" && mode === "before";
				const isAdded = part.type === "added" && mode === "after";
				return (
					<span
						key={`${mode}-${part.type}-${index}`}
						style={{
							background: isAdded
								? "#d3f9d8"
								: isRemoved
									? "#ffe3e3"
									: "transparent",
							textDecoration: isRemoved ? "line-through" : "none",
							borderRadius: 4,
						}}
					>
						{part.value}
						{index < visible.length - 1 ? " " : ""}
					</span>
				);
			})}
		</Text>
	);
};

export const DescriptionDiffCard = ({
	originalText,
	improvedText,
	onApply,
	onClose,
}: Props) => {
	const hasOriginalText = Boolean(originalText.trim());
	const parts = useMemo(
		() => buildWordDiff(originalText, improvedText),
		[originalText, improvedText],
	);

	return (
		<Card withBorder>
			<Stack gap="md">
				<Group justify="space-between" wrap="wrap">
					<Text fw={600}>
						{hasOriginalText ? "Было > Стало" : "Предложенное описание"}
					</Text>
					<Badge color="green" variant="light">
						AI предложение
					</Badge>
				</Group>
				<Divider />
				{hasOriginalText ? (
					<Grid>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Stack gap="xs">
								<Text size="sm" fw={600} c="dimmed">
									Было
								</Text>
								<Paper p="sm" bg="gray.0" withBorder>
									{renderDiffText(parts, "before")}
								</Paper>
							</Stack>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Stack gap="xs">
								<Text size="sm" fw={600} c="dimmed">
									Стало
								</Text>
								<Paper p="sm" bg="green.0" withBorder>
									{renderDiffText(parts, "after")}
								</Paper>
							</Stack>
						</Grid.Col>
					</Grid>
				) : (
					<Stack gap="xs">
						<Text size="sm" fw={600} c="dimmed">
							Текст от AI
						</Text>
						<Paper p="sm" bg="green.0" withBorder>
							<Text
								size="sm"
								style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}
							>
								{improvedText}
							</Text>
						</Paper>
					</Stack>
				)}
				<Group justify="flex-end">
					<Button size="xs" variant="default" onClick={onClose}>
						Закрыть
					</Button>
					<Button size="xs" onClick={onApply}>
						Применить
					</Button>
				</Group>
			</Stack>
		</Card>
	);
};
