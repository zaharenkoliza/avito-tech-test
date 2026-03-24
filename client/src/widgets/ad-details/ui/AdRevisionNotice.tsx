import { Card, Group, Stack, Text, ThemeIcon, useMantineColorScheme } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

interface Props {
	missing: string[]
}

export const AdRevisionNotice = ({ missing }: Props) => {
	const { colorScheme } = useMantineColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<Card
			withBorder
			radius="md"
			bg={isDark ? 'rgba(255, 163, 77, 0.12)' : '#f7efe0'}
			style={isDark ? { borderColor: 'rgba(255, 163, 77, 0.35)' } : undefined}
		>
			<Stack gap={6}>
				<Group gap="xs">
					<ThemeIcon color="orange" size="sm" variant={isDark ? 'filled' : 'light'}>
						<IconAlertCircle size={14} />
					</ThemeIcon>
					<Text fw={700} c={isDark ? 'orange.2' : undefined}>
						Требуются доработки
					</Text>
				</Group>
				<Text size="sm" c={isDark ? 'gray.2' : undefined}>
					У объявления не заполнены поля:
				</Text>
				<Stack gap={2}>
					{missing.map((field) => (
						<Text key={field} size="sm" c={isDark ? 'gray.2' : undefined}>
							• {field}
						</Text>
					))}
				</Stack>
			</Stack>
		</Card>
	)
}
