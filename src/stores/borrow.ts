import { defineStore } from "pinia";
import { computed, ref } from "vue";
import $axios from "@api/axios";
import { Loading, Notify } from "quasar";
import { getSeparatedBorrows } from "@utils/borrowHelper";
import { createNotification } from "@utils/notificationHelper";
import type { Borrow, CreateBorrow, ModifyBorrow } from "@interfaces/borrow";
import type { PaginateResult, PathQuery } from "@interfaces/paginate";
import type { User } from "@interfaces/user";
import { i18n } from "../modules/i18n";
import type { Composer } from "vue-i18n";

export const useBorrowStore = defineStore("borrow", () => {
	const loggedInBorrows = ref<Borrow[]>([]);
	const openedBorrow = ref<Borrow>();

	const borrows = computed(() => getSeparatedBorrows(loggedInBorrows.value, "borrow"));
	const lends = computed(() => getSeparatedBorrows(loggedInBorrows.value, "lend"));

	async function getLoggedInBorrows() {
		try {
			Loading.show();
			await $axios.get(`/user/me/borrow`);
		} catch (error) {
			return;
		}
	}

	async function getBorrowById(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/borrow/${id}`);
			return data;
		} catch (error) {
			return;
		}
	}

	async function createBorrow(borrowData: CreateBorrow) {
		try {
			Loading.show();
			const { data } = await $axios.post<Borrow>(`/borrow`, borrowData);
			if (borrowData.from) {
				createNotification(borrowData.from, data._id, "borrow", "create");
			} else if (borrowData.to) {
				createNotification(borrowData.to, data._id, "lend", "create");
			}
			loggedInBorrows.value.push(data);
			const { t } = i18n.global as Composer;
			Notify.create({ message: t("borrow.requestSent") });
		} catch (error) {
			return;
		}
	}

	async function editBorrow(borrowData: ModifyBorrow, id?: string) {
		try {
			if (!id) return;
			Loading.show();
			const { data } = await $axios.patch<Borrow>(`/borrow/${id}`, borrowData);
			const { type } = data;
			if (type == "borrow") {
				createNotification((data.from as User)._id as string, id, "borrow", "update");
			} else {
				createNotification((data.from as User)._id as string, id, "lend", "update");
			}
			loggedInBorrows.value.some((borrow) => {
				if (borrow._id == data._id) {
					Object.assign(borrow, data);
					return true;
				}
				return false;
			});
		} catch (error) {
			return;
		}
	}

	async function verifyBorrow(type: "borrow" | "lend", userId: string, borrowId: string) {
		try {
			Loading.show();
			await $axios.patch(`/borrow/${borrowId}/verify`);
			if (type == "borrow") {
				createNotification(userId, borrowId, "borrow", "verify");
			} else {
				createNotification(userId, borrowId, "lend", "verify");
			}
			loggedInBorrows.value.some((borrow) => {
				if (borrow._id == borrowId) {
					borrow.verified = true;
					return true;
				}
				return false;
			});
		} catch (error) {
			return;
		}
	}

	async function deleteBorrow(type: "borrow" | "lend", userId: string, id: string) {
		try {
			Loading.show();
			await $axios.delete(`/borrow/${id}`);
			createNotification(userId, id, "borrow", "delete");
			loggedInBorrows.value = loggedInBorrows.value.filter((borrow) => borrow._id != id);
		} catch (error) {
			return;
		}
	}

	async function adminGetBorrows(query: PathQuery = { skip: 0, limit: 10 }) {
		try {
			Loading.show();

			let path = `/admin/borrow?skip=${query.skip}&limit=${query.limit}`;
			if (query.sortBy) {
				path += `&sortBy=${query.sortBy}`;
			}
			if (query.keyword) {
				path += `&keyword=${query.keyword}`;
			}

			const { data } = await $axios.get(path);
			return data as PaginateResult<Borrow>;
		} catch (error) {
			return;
		}
	}
	async function adminGetBorrowById(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/borrow/${id}`);
		} catch (error) {
			return;
		}
	}
	async function adminDeleteBorrow(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/borrow/${id}`);
		} catch (error) {
			return;
		}
	}

	async function adminEditBorrow(borrowData: ModifyBorrow, id?: string) {
		try {
			Loading.show();
			await $axios.patch(`/admin/borrow/${id}`, borrowData);
		} catch (error) {
			return;
		}
	}

	return {
		loggedInBorrows,
		openedBorrow,
		borrows,
		lends,
		getLoggedInBorrows,
		getById: getBorrowById,
		createBorrow,
		editBorrow,
		verifyBorrow,
		deleteBorrow,
		adminGetBorrows,
		adminGetBorrowById,
		adminDeleteBorrow,
		adminEditBorrow,
	};
});
