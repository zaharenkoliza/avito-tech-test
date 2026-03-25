import { Alert, Button, Stack, Text } from '@mantine/core'
import { Component } from 'react'

import type { ReactNode } from 'react'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
}

const DefaultFallback = () => (
	<Stack p="lg">
		<Alert color="red" title="Ошибка приложения">
			<Text size="sm">Произошла непредвиденная ошибка интерфейса.</Text>
		</Alert>
		<Button variant="default" onClick={() => window.location.reload()}>
			Перезагрузить страницу
		</Button>
	</Stack>
)

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false }

	static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	componentDidCatch(error: unknown) {
		console.error('UI ErrorBoundary caught an error', error)
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback ?? <DefaultFallback />
		}

		return this.props.children
	}
}
