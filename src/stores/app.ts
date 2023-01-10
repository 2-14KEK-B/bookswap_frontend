import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
	const adminEdit = ref(false);
	const editBorrow = ref(false);
	const createBookRate = ref(false);
	const editBookRate = ref(false);
	const createUserRate = ref(false);
	const editUserRate = ref(false);
	const messageModal = ref(false);

	return { adminEdit, editBorrow, createBookRate, editBookRate, createUserRate, editUserRate, messageModal };
});
