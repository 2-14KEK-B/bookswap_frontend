import axios from "axios";

const API_URL = import.meta.env.API_URL ?? "http://localhost:3000/";

const $axios = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

export default $axios;
