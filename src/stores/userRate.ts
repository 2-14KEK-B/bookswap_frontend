import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "@api/axios";
import { Loading } from "quasar";
import { useBorrowStore } from "./borrow";
import { createNotification } from "@utils/notificationHelper";
import type { CreateUserRate, ModifyUserRate, UserRate } from "@interfaces/userRate";

export const useUserRateStore = defineStore("userRate", () => {
	//TODO: meg kell csinálni, hogy "loggedInRates" ne legyen, hanem csak a borrowból legyen kiszedve az összes userrate
	const loggedInRates = ref<{ from: UserRate[]; to: UserRate[] }>({ from: [], to: [] });
	const openedRate = ref<UserRate>();
	const userRateToEdit = ref<UserRate>();

	async function getByUserRateId(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/user/rate/${id}`);
			return data;
		} catch (error) {
			return;
		}
	}

	async function getLoggedInUserRates() {
		try {
			Loading.show();
			const { data } = await $axios.get<UserRate[]>("/user/me/rate");
			return data;
		} catch (error) {
			return;
		}
	}

	async function getUserRatesByUserId(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get<UserRate[]>(`/user/${id}/rate`);
			return data;
		} catch (error) {
			return;
		}
	}

	async function getUserRatesByBorrowId(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get<UserRate[]>(`/borrow/${id}/rate`);
			return data;
		} catch (error) {
			return;
		}
	}

	async function createUserRate(userId: string, borrowId: string, userRateData: CreateUserRate) {
		try {
			Loading.show();
			const { data } = await $axios.post<UserRate>(`/user/${userId}/rate`, { ...userRateData, borrow: borrowId });
			createNotification(userId, data._id as string, "user_rate", "create");
			const borrowStore = useBorrowStore();
			loggedInRates.value.from.push(data);
			borrowStore.loggedInBorrows.some((b) => {
				if (b._id == borrowId) {
					b.user_rates?.push(data);
					return true;
				}
				return false;
			});
		} catch (error) {
			return;
		}
	}

	async function editUserRate(userId: string, rateId: string, borrowId: string, userRateData: ModifyUserRate) {
		try {
			Loading.show();
			const { data } = await $axios.patch<UserRate>(`/user/${userId}/rate/${rateId}`, userRateData);
			createNotification(userId, rateId, "user_rate", "update");
			loggedInRates.value.from.some((rate) => {
				if (rate._id == rateId) {
					Object.assign(rate, data);
					return true;
				}
				return false;
			});
			const borrowStore = useBorrowStore();
			borrowStore.loggedInBorrows.some((b) => {
				if (b._id == borrowId) {
					b.user_rates?.some((rate) => {
						if (data._id == rateId) {
							Object.assign(rate, data);
							return true;
						}
						return false;
					});
					return true;
				}
				return false;
			});
		} catch (error) {
			return;
		}
	}
	async function deleteUserRate(userId: string, rateId: string, borrowId: string) {
		try {
			Loading.show();
			await $axios.delete(`/user/${userId}/rate/${rateId}`);
			createNotification(userId, rateId, "user_rate", "delete");
			loggedInRates.value.from = loggedInRates.value.from.filter((rate) => rate._id != rateId);
			const borrowStore = useBorrowStore();
			borrowStore.loggedInBorrows.some((b) => {
				if (b._id == borrowId) {
					b.user_rates = (b.user_rates as UserRate[])?.filter((rate) => rate._id != rateId);
					return true;
				}
				return false;
			});
		} catch (error) {
			return;
		}
	}

	async function adminGetUserRates() {
		try {
			const { data } = await $axios.get<UserRate[]>("/admin/user/rate");
			return data;
		} catch (error) {
			return;
		}
	}

	async function adminDeleteUserRate(userId: string, rateId: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/user/${userId}/rate/${rateId}`);
		} catch (error) {
			return;
		}
	}

	async function adminEditUserRate(userId: string, rateId: string, userRateData: ModifyUserRate) {
		try {
			Loading.show();
			await $axios.patch(`/admin/user/${userId}/rate/${rateId}`, userRateData);
		} catch (error) {
			return;
		}
	}

	return {
		loggedInRates,
		openedRate,
		userRateToEdit,
		getByUserRateId,
		getLoggedInUserRates,
		getUserRatesByUserId,
		getUserRatesByBorrowId,
		createUserRate,
		editUserRate,
		deleteUserRate,
		adminGetUserRates,
		adminDeleteUserRate,
		adminEditUserRate,
	};
});
