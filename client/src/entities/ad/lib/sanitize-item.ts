import type { ItemWithRevision } from "../model/types";

type Category = ItemWithRevision["category"];
type ParamsValue = Record<string, unknown>;

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";
const isOneOf = <T extends string>(
	value: unknown,
	options: readonly T[],
): value is T => typeof value === "string" && options.includes(value as T);

const pickString = (params: ParamsValue | undefined, key: string) => {
	const value = params?.[key];
	return isString(value) ? value : undefined;
};

const pickNumber = (params: ParamsValue | undefined, key: string) => {
	const value = params?.[key];
	return isNumber(value) ? value : undefined;
};

const pickEnum = <T extends string>(
	params: ParamsValue | undefined,
	key: string,
	options: readonly T[],
) => {
	const value = params?.[key];
	return isOneOf(value, options) ? value : undefined;
};

const categorySanitizers: Record<
	Category,
	(params: ParamsValue | undefined) => ParamsValue
> = {
	auto: (params) => ({
		brand: pickString(params, "brand"),
		model: pickString(params, "model"),
		yearOfManufacture: pickNumber(params, "yearOfManufacture"),
		transmission: pickEnum(params, "transmission", [
			"automatic",
			"manual",
		] as const),
		mileage: pickNumber(params, "mileage"),
		enginePower: pickNumber(params, "enginePower"),
	}),
	real_estate: (params) => ({
		type: pickEnum(params, "type", ["flat", "house", "room"] as const),
		address: pickString(params, "address"),
		area: pickNumber(params, "area"),
		floor: pickNumber(params, "floor"),
	}),
	electronics: (params) => ({
		type: pickEnum(params, "type", ["phone", "laptop", "misc"] as const),
		brand: pickString(params, "brand"),
		model: pickString(params, "model"),
		condition: pickEnum(params, "condition", ["new", "used"] as const),
		color: pickString(params, "color"),
	}),
};

export const sanitizeParamsForCategory = (
	category: Category,
	params: ParamsValue | undefined,
) => categorySanitizers[category](params);

export const sanitizeItemForCategory = (
	item: ItemWithRevision,
): ItemWithRevision =>
	({
		...item,
		params: sanitizeParamsForCategory(
			item.category,
			(item.params ?? {}) as Record<string, unknown>,
		),
	}) as ItemWithRevision;
