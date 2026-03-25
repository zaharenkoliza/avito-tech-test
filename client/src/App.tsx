import { ActionIcon, Affix, Container, Stack, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

import { ErrorBoundary } from './app/ErrorBoundary'
import { AppRouter } from './app/router'

function App() {
	const { colorScheme, setColorScheme } = useMantineColorScheme()

	return (
		<>
			<Affix position={{ bottom: 16, right: 16 }} zIndex={1000}>
				<ActionIcon
					variant="filled"
					radius="xl"
					size="lg"
					onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
					aria-label="Переключить тему"
				>
					{colorScheme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
				</ActionIcon>
			</Affix>
			<Container size={1335} pt={24} pb="md" px={0}>
				<Stack gap="md">
					<ErrorBoundary>
						<AppRouter />
					</ErrorBoundary>
				</Stack>
			</Container>
		</>
	)
}

export default App
