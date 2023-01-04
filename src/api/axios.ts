import axios from "axios";
import { Loading, Notify } from "quasar";
import API_URL from "../config/api_url";

const $axios = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Add a request interceptor
$axios.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		return config;
	},
	function (error) {
		// console.log("error from $axios.interceptors.request: ", error);
		Loading.hide();
		Notify.create({
			message: error.response?.data as string,
			color: "red",
		});
		console.log(error);
		// Do something with request error
		return Promise.reject(error);
	},
);

// Add a response interceptor
$axios.interceptors.response.use(
	function (response) {
		Loading.hide();
		if (response.data) {
			return response;
		} else {
			return Promise.reject(response);
		}
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		// return response;
	},
	function (error) {
		// console.log("error from $axios.interceptors.response: ", error);
		Loading.hide();
		Notify.create({
			message: error.message as string,
			color: "red",
		});
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	},
);

export default $axios;
