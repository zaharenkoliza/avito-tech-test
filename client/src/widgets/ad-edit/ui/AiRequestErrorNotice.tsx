import { Button, Paper, Stack, Text } from '@mantine/core'

interface Props {
	onClose: () => void
}

export const AiRequestErrorNotice = ({ onClose }: Props) => (
	<Paper
		p={8}
		radius="sm"
		bg="#fde8e7"
		withBorder={false}
		shadow={undefined}
		style={{
			border: '1px solid #f7c2be',
			boxShadow: 'none',
		}}
	>
		<Stack gap={8} align="flex-start">
			<Stack gap={8}>
				<Text c="#d94841" fw={600} fz={12} lh="16px">
					Произошла ошибка при запросе к AI
				</Text>
				<Text fz={12} lh="16px" c="dark.7">
					Попробуйте повторить запрос или закройте уведомление
				</Text>
			</Stack>
			<Button
				size="xs"
				variant="filled"
				onClick={onClose}
				style={{
					backgroundColor: '#FCB3AD',
					color: '#4a1e1b',
				}}
			>
				Закрыть
			</Button>
		</Stack>
	</Paper>
)
