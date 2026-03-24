import { Card, Paper, Stack, Text } from '@mantine/core'

import type { DiffPart } from '@/shared/utils/diff'

interface Props {
	diff: DiffPart[]
}

export const DescriptionDiffCard = ({ diff }: Props) => (
	<Card withBorder>
		<Stack>
			<Text fw={600}>Было {'>'} Стало</Text>
			<Paper p="sm" bg="gray.0">
				{diff.map((part, idx) => (
					<Text
						key={`${part.type}-${idx}`}
						component="span"
						style={{
							background:
								part.type === 'added'
									? '#d3f9d8'
									: part.type === 'removed'
										? '#ffe3e3'
										: 'transparent',
							textDecoration: part.type === 'removed' ? 'line-through' : 'none',
						}}
					>
						{part.value}
					</Text>
				))}
			</Paper>
		</Stack>
	</Card>
)
