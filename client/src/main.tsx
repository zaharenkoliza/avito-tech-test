import {
	createTheme,
	localStorageColorSchemeManager,
	MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { store } from "./app/store";
import "./index.css";

dayjs.locale("ru");

const colorSchemeManager = localStorageColorSchemeManager({
	key: "avito_theme_mode",
});

const theme = createTheme({
	fontFamily: "Manrope, sans-serif",
	headings: {
		fontFamily: "Manrope, sans-serif",
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<MantineProvider
				theme={theme}
				defaultColorScheme="light"
				colorSchemeManager={colorSchemeManager}
			>
				<Notifications />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</MantineProvider>
		</Provider>
	</StrictMode>,
);
