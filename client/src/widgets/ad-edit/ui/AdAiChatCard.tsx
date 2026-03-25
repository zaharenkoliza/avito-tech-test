import {
	ActionIcon,
	Badge,
	Card,
	Paper,
	Stack,
	Text,
	TextInput,
	useMantineColorScheme,
} from "@mantine/core";
import { IconBulb, IconMessageCircle2, IconSend2 } from "@tabler/icons-react";
import { useState } from "react";

import { AiRequestErrorNotice } from "./AiRequestErrorNotice";

import type { ChatMessage } from "@/shared/api";

interface Props {
	chat: ChatMessage[];
	isSending: boolean;
	error?: string;
	onCloseError: () => void;
	onSend: (message: string) => void;
}

export const AdAiChatCard = ({
	chat,
	isSending,
	error,
	onCloseError,
	onSend,
}: Props) => {
	const [chatInput, setChatInput] = useState("");
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";

	const submit = () => {
		if (isSending) return;
		const message = chatInput.trim();
		if (!message) return;
		onSend(message);
		setChatInput("");
	};

	return (
		<Card
			withBorder
			radius="lg"
			p="lg"
			bg={isDark ? "rgba(255, 146, 43, 0.12)" : "orange.0"}
			style={{
				borderColor: isDark
					? "rgba(255, 163, 77, 0.28)"
					: "var(--mantine-color-orange-2)",
			}}
		>
			<Stack>
				<Stack gap={6}>
					<Badge
						variant="light"
						color="orange"
						size="sm"
						radius="sm"
						leftSection={<IconBulb size={12} />}
						style={{ alignSelf: "flex-start" }}
					>
						AI
					</Badge>
					<Text fw={600}>Чат с AI</Text>
				</Stack>

				<Stack gap="xs" mah={220} style={{ overflowY: "auto" }}>
					{chat.map((entry, index) => (
						<Paper
							key={`${entry.role}-${index}`}
							p="xs"
							radius="md"
							bg={
								entry.role === "user"
									? isDark
										? "rgba(255, 163, 77, 0.18)"
										: "orange.1"
									: isDark
										? "dark.6"
										: "white"
							}
							style={{
								border: "1px solid",
								borderColor:
									entry.role === "user"
										? isDark
											? "rgba(255, 163, 77, 0.26)"
											: "var(--mantine-color-orange-2)"
										: isDark
											? "rgba(255, 255, 255, 0.08)"
											: "var(--mantine-color-orange-1)",
							}}
						>
							<Badge size="xs" mb={4} color="orange" variant="light">
								{entry.role === "user" ? "Вы" : "AI"}
							</Badge>
							<Text size="sm">{entry.content}</Text>
						</Paper>
					))}
				</Stack>

				{error ? <AiRequestErrorNotice onClose={onCloseError} /> : null}

				<TextInput
					value={chatInput}
					onChange={(e) => setChatInput(e.currentTarget.value)}
					placeholder="Спросите что-то про объявление"
					disabled={isSending}
					radius="md"
					leftSection={
						<IconMessageCircle2
							size={16}
							color="var(--mantine-color-orange-6)"
						/>
					}
					rightSection={
						<ActionIcon
							variant="subtle"
							color="orange"
							radius="xl"
							onClick={submit}
							loading={isSending}
							disabled={!chatInput.trim() || isSending}
							aria-label="Отправить сообщение"
						>
							<IconSend2 size={16} stroke={1.8} />
						</ActionIcon>
					}
					styles={{
						input: {
							backgroundColor: isDark ? "var(--mantine-color-dark-6)" : "white",
							borderColor: isDark
								? "rgba(255, 163, 77, 0.28)"
								: "var(--mantine-color-orange-2)",
						},
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							submit();
						}
					}}
				/>
			</Stack>
		</Card>
	);
};
