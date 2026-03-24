import { Badge, Card, Stack, Text, Title } from '@mantine/core'

export const AdAiAssistantCard = () => (
	<Card withBorder>
		<Stack gap="xs">
			<Badge variant="light" size="sm" radius="xl" style={{ alignSelf: 'flex-start' }}>
				Info
			</Badge>
			<Title order={4}>Запросы к AI</Title>
			<Text c="dimmed" size="sm">
				Для цены и описания можно отправить запрос к AI, чтобы узнать рыночную цену,
				улучшить существующее описание или сгенерировать новое, если поле пустое.
			</Text>
			<Text c="dimmed" size="sm">
				Результат и ошибки каждого запроса показываются рядом с соответствующим полем.
			</Text>
			<Text c="dimmed" size="sm">
				Запросы по цене и описанию работают независимо и могут выполняться параллельно.
			</Text>
		</Stack>
	</Card>
)
