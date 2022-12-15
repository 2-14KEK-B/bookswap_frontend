import { defineStore } from "pinia";

import $axios from "@api/axios";
import { handle } from "@utils/error";

export const useMessageStore = defineStore("message", () => {
	async function deleteMessage(id: string) {
		return $axios
			.delete(`/message/${id}`)
			.then(async (res) => {
				console.log(res.status);
			})
			.catch(handle);
	}
	return {
		deleteMessage,
	};
});
