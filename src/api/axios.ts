import axios from "axios";
import API_URL from "../config/api_url";

const $axios = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

export default $axios;
