import { AxiosError } from "axios";
import { router } from "../modules/router";
import { useUserStore } from "@stores/user";

export async function handle(error: AxiosError) {
	const userStore = useUserStore();
	if (error.response) {
		console.log(error.response.data);
	}
	// await handleUnauthorized(error)
	console.log(error.response?.status);
	if (error.response && error.response.status > 400) {
		localStorage.removeItem("user");
		userStore.getLoggedUser = undefined;
		await router.push({ name: "auth" });
	}
}

// async function handleUnauthorized(error: AxiosError) {
// }
