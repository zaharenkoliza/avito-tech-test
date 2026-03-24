import { Badge, Button, Card, Paper, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'

import type { ChatMessage } from '@/shared/api'

interface Props {
	chat: ChatMessage[]
	isSending: boolean
	onSend: (message: string) => void
}

export const AdAiChatCard = ({ chat, isSending, onSend }: Props) => {
	const [chatInput, setChatInput] = useState('')

	const submit = () => {
		if (isSending) return
		const message = chatInput.trim()
		if (!message) return
		onSend(message)
		setChatInput('')
	}

	return (
		<Card withBorder>
			<Stack>
				<Text fw={600}>Чат с AI</Text>
				<Stack gap="xs" mah={220} style={{ overflowY: 'auto' }}>
					{chat.map((entry, index) => (
						<Paper
							key={`${entry.role}-${index}`}
							p="xs"
							bg={entry.role === 'user' ? 'blue.0' : 'gray.0'}
						>
							<Badge size="xs" mb={4}>
								{entry.role === 'user' ? 'Вы' : 'AI'}
							</Badge>
							<Text size="sm">{entry.content}</Text>
						</Paper>
					))}
				</Stack>
				<TextInput
					value={chatInput}
					onChange={(e) => setChatInput(e.currentTarget.value)}
					placeholder="Спросите что-то про объявление"
					disabled={isSending}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							submit()
						}
					}}
				/>
				<Button onClick={submit} loading={isSending}>Отправить</Button>
			</Stack>
		</Card>
	)
}
