/* eslint-disable */

export {};

declare global {
	interface ImportMetaEnv {
		MODE: "development" | "production";
		VITE_GOOGLE_CLIENT_ID: string;
		VITE_IMAGE_CLOUD: string;
		VITE_FACEBOOK_APP_ID: string;
		VITE_API_URL: string;
		VITE_NODE_ENV: string;
	}
}
