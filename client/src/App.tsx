import { ActionIcon, Affix, Container, Stack } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

import { ErrorBoundary } from './app/ErrorBoundary'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { AppRouter } from './app/router'
import { toggleTheme } from './features/theme-toggle'

function App() {
	const dispatch = useAppDispatch()
	const colorScheme = useAppSelector((state) => state.theme.colorScheme)

	return (
		<>
			<Affix position={{ bottom: 16, right: 16 }} zIndex={1000}>
				<ActionIcon
					variant="filled"
					radius="xl"
					size="lg"
					onClick={() => dispatch(toggleTheme())}
					aria-label="Переключить тему"
				>
					{colorScheme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
				</ActionIcon>
			</Affix>
			<Container size={1335} py="md" px={0}>
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
