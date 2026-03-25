import { Center, Loader } from "@mantine/core";

interface AppLoaderProps {
	minHeight?: number;
	padding?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const AppLoader = ({
	minHeight = 220,
	padding = "xl",
}: AppLoaderProps) => {
	return (
		<Center p={padding} mih={minHeight}>
			<Loader type="bars" size="xl" />
		</Center>
	);
};
