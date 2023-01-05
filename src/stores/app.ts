import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
	const adminEdit = ref(false);
	const bookRate = ref(false);
	const userRate = ref(false);
	const messageModal = ref(false);

	return { adminEdit, bookRate, userRate, messageModal };
});
