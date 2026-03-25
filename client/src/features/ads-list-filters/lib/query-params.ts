import type { Category } from "@/entities/ad";
import type { ListQuery } from "@/shared/api";

export const ALL_CATEGORIES: Category[] = [
	"auto",
	"real_estate",
	"electronics",
];

const SORT_DEFAULT = {
	sortColumn: "createdAt",
	sortDirection: "desc",
} as const;

export const buildListQueryFromSearchParams = (
	params: URLSearchParams,
): Omit<ListQuery, "limit" | "skip"> & { page: number } => {
	const categoriesRaw = params.get("categories");
	const categories = categoriesRaw
		? (categoriesRaw.split(",").filter(Boolean) as Category[])
		: [];

	const sortColumn = params.get("sortColumn");
	const sortDirection = params.get("sortDirection");
	const page = Number(params.get("page") ?? "1");

	return {
		q: params.get("q") ?? "",
		categories,
		needsRevision: params.get("needsRevision") === "true",
		sortColumn:
			sortColumn === "title" ||
			sortColumn === "createdAt" ||
			sortColumn === "price"
				? sortColumn
				: SORT_DEFAULT.sortColumn,
		sortDirection:
			sortDirection === "asc" || sortDirection === "desc"
				? sortDirection
				: SORT_DEFAULT.sortDirection,
		page: Number.isFinite(page) && page > 0 ? page : 1,
	};
};

export const buildSearchParamsFromListState = (query: {
	q: string;
	categories: Category[];
	needsRevision: boolean;
	sortColumn?: string;
	sortDirection?: string;
	page: number;
}) => {
	const params = new URLSearchParams();

	if (query.q) params.set("q", query.q);
	if (query.categories.length > 0)
		params.set("categories", query.categories.join(","));
	if (query.needsRevision) params.set("needsRevision", "true");
	if (query.sortColumn) params.set("sortColumn", query.sortColumn);
	if (query.sortDirection) params.set("sortDirection", query.sortDirection);
	if (query.page > 1) params.set("page", String(query.page));

	return params;
};
