interface AppConfig {
	apiBaseUrl: string;
	pageSize: number;
}

const env = import.meta.env as ImportMetaEnv & { VITE_API_BASE_URL?: string };
const API_BASE_URL: string = env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const APP_CONFIG: AppConfig = {
	apiBaseUrl: API_BASE_URL,
	pageSize: 10,
};
