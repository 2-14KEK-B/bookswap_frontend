import axios from "axios";
import { Loading, Notify } from "quasar";
import { matClose } from "@quasar/extras/material-icons";

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

// Add a request interceptor
$axios.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		return config;
	},
	function (error) {
		if (axios.isAxiosError(error)) {
			console.log("error from $axios.interceptors.request: ", error.response);
			Loading.hide();
			Notify.create({
				message: error.response?.data as string,
				color: "red",
			});
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
		Loading.hide();
		if (response.status < 400) {
			return response;
		} else {
			return Promise.reject(response);
		}
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		// return response;
	},
	function (error) {
		if (axios.isAxiosError(error)) {
			console.log("error from $axios.interceptors.request: ", error.response);
			Loading.hide();
			Notify.create({
				message: error.response?.data as string,
				color: "red",
			});
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

export default $axios;
