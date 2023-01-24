import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
	const login = ref(false);
	const register = ref(false);
	const adminEdit = ref(false);
	const editBorrow = ref(false);
	const editOrCreateBookRate = ref(false);
	const editOrCreateUserRate = ref(false);
	const messageModal = ref(false);
	const isContactsOpened = ref(false);
	const isMessageOpened = ref(false);
	const isOpenedBorrowNotification = ref(false);
	const isOpenedUserRateNotification = ref(false);

	return {
		login,
		register,
		adminEdit,
		editBorrow,
		editOrCreateBookRate,
		editOrCreateUserRate,
		messageModal,
		isContactsOpened,
		isMessageOpened,
		isOpenedBorrowNotification,
		isOpenedUserRateNotification,
	};
});
