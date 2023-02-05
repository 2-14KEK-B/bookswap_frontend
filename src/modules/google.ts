import vue3GoogleLogin from "vue3-google-login";
import type { App, Plugin } from "vue";

type GoogleOptions = {
	clientId?: string;
};

const options: GoogleOptions = {
	clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export const install = (app: App) => {
	app.use<GoogleOptions>(vue3GoogleLogin as Plugin, options);
};
