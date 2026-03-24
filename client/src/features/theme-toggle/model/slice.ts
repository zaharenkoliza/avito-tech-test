import { createSlice } from '@reduxjs/toolkit'

import { storage } from '@/shared/storage/localStorage'

const THEME_KEY = 'avito_theme_mode'

interface ThemeState {
	colorScheme: 'light' | 'dark'
}

const initialState: ThemeState = {
	colorScheme: storage.get<'light' | 'dark'>(THEME_KEY, 'light'),
}

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		toggleTheme(state) {
			state.colorScheme = state.colorScheme === 'light' ? 'dark' : 'light'
			storage.set(THEME_KEY, state.colorScheme)
		},
		setTheme(state, action: { payload: ThemeState['colorScheme'] }) {
			state.colorScheme = action.payload
			storage.set(THEME_KEY, state.colorScheme)
		},
	},
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer



