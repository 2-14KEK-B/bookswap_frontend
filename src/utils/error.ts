import type { AxiosError } from "axios";

export async function handle(error: AxiosError) {
	if (error.response) {
		console.log(error.response.data);
	}
}
