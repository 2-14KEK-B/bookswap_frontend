import axios from "axios";
import { Loading, Notify } from "quasar";
import { i18n } from "../modules/i18n";
import { matClose } from "@quasar/extras/material-icons";
import type { Composer } from "vue-i18n";

Notify.setDefaults({
	progress: true,
	position: "bottom-right",
	timeout: 2000,
	actions: [{ icon: matClose, color: "white" }],
});

const $axios = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
	withCredentials: true,
});

const { t, locale } = i18n.global as Composer;

// Add a request interceptor
$axios.interceptors.request.use(
	function (config) {
		config.headers["accept-language"] = locale.value;
		// Do something before request is sent
		return config;
	},
	function (error) {
		if (import.meta.env.MODE != "production") console.log("request error: ", error);
		if (axios.isAxiosError(error)) {
			Loading.hide();
			if (error.response) {
				Notify.create({
					message: error.response?.data as string,
					color: "red",
				});
			} else {
				const message = t("unknownError");
				Notify.create({
					message: message,
					color: "red",
				});
			}
		} else {
			Loading.hide();
			Notify.create({
				message: error.message as string,
				color: "red",
			});
		}
		return Promise.reject(error);
	},
);

// Add a response interceptor
$axios.interceptors.response.use(
	function (response) {
		if (import.meta.env.MODE != "production") console.log("response: ", response);
		Loading.hide();
		if (response.status < 400) {
			if (typeof response.data == "string" && response.data.length > 0) {
				Notify.create({
					message: response.data,
				});
			}
			return response;
		} else {
			return Promise.reject(response);
		}
	},
	function (error) {
		Loading.hide();
		if (import.meta.env.MODE != "production") console.log("response error: ", error);
		if (axios.isAxiosError(error)) {
			if (error.response) {
				if (isValidationRes(error.response.data)) {
					Notify.create({
						message: error.response.data.validation.join(" "),
						color: "red",
					});
				} else {
					Notify.create({
						message: error.response.data as string,
						color: "red",
					});
				}
			} else {
				const message = t("noServer");
				Notify.create({
					message: message,
					color: "red",
				});
			}
		} else {
			Notify.create({
				message: error.message as string,
				color: "red",
			});
		}
		return Promise.reject(error);
	},
);

type verificationRes = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[key in "validation" | (string & {})]: Array<string>;
};

function isValidationRes(res: any): res is verificationRes {
	if ((res as verificationRes).validation) {
		return true;
	} else {
		return false;
	}
}

export default $axios;
