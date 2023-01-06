import { defineStore } from "pinia";
import { ref } from "vue";
import { Loading } from "quasar";
import $axios from "@api/axios";
import { useBorrowStore } from "./borrow";
import type { CreateUserRate, ModifyUserRate, UserRate } from "@interfaces/userRate";

export const useUserRateStore = defineStore("userRate", () => {
	//TODO: meg kell csinálni, hogy "loggedInRates" ne legyen, hanem csak a borrowból legyen kiszedve az összes userrate
	const loggedInRates = ref<{ from: UserRate[]; to: UserRate[] }>({ from: [], to: [] });

	async function getLoggedInUserRates() {
		try {
			Loading.show();
			const { data } = await $axios.get("/user/me/rate");
			return data as UserRate[];
		} catch (error) {
			return;
		}
	}

	async function getUserRatesByUserId(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/user/${id}/rate`);
			return data as UserRate[];
		} catch (error) {
			return;
		}
	}

	async function getUserRatesByBorrowId(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/borrow/${id}/rate`);
			return data as UserRate[];
		} catch (error) {
			return;
		}
	}

	async function createUserRate(userId: string, borrowId: string, userRateData: CreateUserRate) {
		try {
			Loading.show();
			const { data } = await $axios.post<UserRate>(`/user/${userId}/rate`, { ...userRateData, borrow: borrowId });
			const borrowStore = useBorrowStore();
			loggedInRates.value.from.push(data);
			borrowStore.loggedInBorrows.forEach((b) => {
				if (b._id == borrowId) {
					b.user_rates?.push(data);
				}
			});
		} catch (error) {
			return;
		}
	}

	async function editUserRate(userId: string, rateId: string, borrowId: string, userRateData: ModifyUserRate) {
		try {
			Loading.show();
			const { data } = await $axios.patch<UserRate>(`/user/${userId}/rate/${rateId}`, userRateData);
			loggedInRates.value.from.forEach((rate) => {
				if (rate._id == rateId) {
					Object.assign(rate, data);
					return;
				}
			});
			const borrowStore = useBorrowStore();
			borrowStore.loggedInBorrows.forEach((b) => {
				if (b._id == borrowId) {
					b.user_rates?.forEach((rate) => {
						if (data._id == rateId) {
							Object.assign(rate, data);
							return;
						}
					});
				}
			});
		} catch (error) {
			return;
		}
	}
	async function deleteUserRate(userId: string, rateId: string, borrowId: string) {
		try {
			Loading.show();
			const { status } = await $axios.delete(`/user/${userId}/rate/${rateId}`);
			if (status == 204) {
				loggedInRates.value.from = loggedInRates.value.from.filter((rate) => rate._id == rateId);
				const borrowStore = useBorrowStore();
				borrowStore.loggedInBorrows.forEach((b) => {
					if (b._id == borrowId) {
						b.user_rates = (b.user_rates as UserRate[])?.filter((rate) => rate._id == rateId);
					}
				});
			}
		} catch (error) {
			return;
		}
	}

	async function adminGetUserRates() {
		try {
			const { data } = await $axios.get("/admin/user/rate");
			return data as UserRate[];
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
