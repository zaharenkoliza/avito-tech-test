import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Category } from "@/entities/ad";

export interface ListState {
	q: string;
	categories: Category[];
	needsRevision: boolean;
	sortColumn: "title" | "createdAt" | "price";
	sortDirection: "asc" | "desc";
	page: number;
	layout: "grid" | "list";
}

const initialState: ListState = {
	q: "",
	categories: [],
	needsRevision: false,
	sortColumn: "createdAt",
	sortDirection: "desc",
	page: 1,
	layout: "grid",
};

const listSlice = createSlice({
	name: "list",
	initialState,
	reducers: {
		setFromQueryState: (state, action: PayloadAction<Partial<ListState>>) => ({
			...initialState,
			layout: state.layout,
			...action.payload,
		}),
		setQuery(state, action: PayloadAction<string>) {
			state.q = action.payload;
			state.page = 1;
		},
		toggleCategory(state, action: PayloadAction<Category>) {
			if (state.categories.includes(action.payload)) {
				state.categories = state.categories.filter((v) => v !== action.payload);
			} else {
				state.categories.push(action.payload);
			}
			state.page = 1;
		},
		setNeedsRevision(state, action: PayloadAction<boolean>) {
			state.needsRevision = action.payload;
			state.page = 1;
		},
		setSort(
			state,
			action: PayloadAction<{
				sortColumn: ListState["sortColumn"];
				sortDirection: ListState["sortDirection"];
			}>,
		) {
			state.sortColumn = action.payload.sortColumn;
			state.sortDirection = action.payload.sortDirection;
		},
		setPage(state, action: PayloadAction<number>) {
			state.page = action.payload;
		},
		setLayout(state, action: PayloadAction<ListState["layout"]>) {
			state.layout = action.payload;
		},
		resetFilters(state) {
			state.categories = [];
			state.needsRevision = false;
			state.q = "";
			state.page = 1;
			state.sortColumn = "createdAt";
			state.sortDirection = "desc";
		},
	},
});

export const {
	setFromQueryState,
	setQuery,
	toggleCategory,
	setNeedsRevision,
	setSort,
	setPage,
	setLayout,
	resetFilters,
} = listSlice.actions;

export const listReducer = listSlice.reducer;
