import { Button, Paper, Stack, Text, useMantineColorScheme } from '@mantine/core'

interface Props {
	onClose: () => void
}

export const AiRequestErrorNotice = ({ onClose }: Props) => {
	const { colorScheme } = useMantineColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<Paper
			p={8}
			radius="sm"
			bg={isDark ? 'rgba(250, 82, 82, 0.14)' : '#fde8e7'}
			withBorder={false}
			shadow={undefined}
			style={{
				border: `1px solid ${isDark ? 'rgba(250, 82, 82, 0.32)' : '#f7c2be'}`,
				boxShadow: 'none',
			}}
		>
			<Stack gap={8} align="flex-start">
				<Stack gap={8}>
					<Text c={isDark ? 'red.3' : '#d94841'} fw={600} fz={12} lh="16px">
						Произошла ошибка при запросе к AI
					</Text>
					<Text fz={12} lh="16px" c={isDark ? 'gray.2' : 'dark.7'}>
						Попробуйте повторить запрос или закройте уведомление
					</Text>
				</Stack>
				<Button size="xs" variant={isDark ? 'light' : 'filled'} color="red" onClick={onClose}>
					Закрыть
				</Button>
			</Stack>
		</Paper>
	)
}
