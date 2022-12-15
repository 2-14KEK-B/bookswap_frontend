import { App } from "vue";
import vue3GoogleLogin from "vue3-google-login";

export const install = (app: App) => {
	app.use(vue3GoogleLogin, {
		clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	});
};
