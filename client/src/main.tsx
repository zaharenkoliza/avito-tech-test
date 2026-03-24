import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { useAppSelector } from './app/hooks'
import { store } from './app/store'
import './index.css'

const theme = createTheme({
	fontFamily: 'Manrope, sans-serif',
	headings: {
		fontFamily: 'Manrope, sans-serif',
	},
})

const Root = () => {
	const colorScheme = useAppSelector((state) => state.theme.colorScheme)

	return (
		<MantineProvider theme={theme} defaultColorScheme={colorScheme} forceColorScheme={colorScheme}>
			<Notifications />
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</MantineProvider>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<Root />
		</Provider>
	</StrictMode>,
)
