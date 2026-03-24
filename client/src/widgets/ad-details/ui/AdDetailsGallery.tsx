import { Paper, SimpleGrid, Stack, useMantineColorScheme } from '@mantine/core'
import { IconPhoto } from '@tabler/icons-react'

export const AdDetailsGallery = () => {
	const { colorScheme } = useMantineColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<Stack gap="sm">
			<Paper
				radius="md"
				h={360}
				bg={isDark ? 'dark.6' : 'gray.1'}
				style={{ display: 'grid', placeItems: 'center' }}
			>
				<IconPhoto size={80} color={isDark ? '#6f7a90' : '#9ca3af'} />
			</Paper>
			<SimpleGrid cols={4} spacing="xs">
				{Array.from({ length: 4 }).map((_, index) => (
					<Paper
						key={index}
						radius="sm"
						h={74}
						bg={isDark ? 'dark.5' : 'gray.0'}
						style={{ display: 'grid', placeItems: 'center' }}
					>
						<IconPhoto size={28} color={isDark ? '#6f7a90' : '#9ca3af'} />
					</Paper>
				))}
			</SimpleGrid>
		</Stack>
	)
}
