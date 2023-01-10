import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "@api/axios";
import { Loading, Notify } from "quasar";
import { matClose } from "@quasar/extras/material-icons";
import type { User, EditUser } from "@interfaces/user";
import type { PaginateResult, PathQuery } from "@interfaces/paginate";

export const useUserStore = defineStore("user", () => {
	const loggedInUser = ref<User>();
	const openedUser = ref<User>();

	Notify.setDefaults({
		progress: true,
		position: "bottom-right",
		timeout: 2000,
		actions: [{ icon: matClose, color: "white" }],
	});

	async function getById(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/user/${id}`);

			return data as User;
		} catch (error) {
			return;
		}
	}

	async function getLoggedIn() {
		try {
			Loading.show();
			const { data } = await $axios.get(`/user/me`);

			loggedInUser.value = data;
		} catch (error) {
			return;
		}
	}

	async function editLoggedIn(userData: EditUser) {
		try {
			Loading.show();
			const { data } = await $axios.patch(`/user/me`, userData);

			loggedInUser.value = data;
		} catch (error) {
			return;
		}
	}

	async function deleteLoggedIn() {
		try {
			Loading.show();
			await $axios.delete(`/user/me`);
		} catch (error) {
			return;
		}
	}

	async function adminGetUsers(query: PathQuery = { skip: 0, limit: 10 }) {
		try {
			Loading.show();

			let path = `/admin/user?skip=${query.skip}&limit=${query.limit}`;
			if (query.sortBy) {
				path += `&sortBy=${query.sortBy}`;
			}
			if (query.keyword) {
				path += `&keyword=${query.keyword}`;
			}

			const { data } = await $axios.get(path);
			return data as PaginateResult<User>;
		} catch (error) {
			return;
		}
	}

	async function adminEditUser(id: string, userData: EditUser) {
		try {
			Loading.show();
			await $axios.patch(`/admin/user/${id}`, userData);
		} catch (error) {
			return;
		}
	}
	async function adminDeleteUser(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/user/${id}`);
		} catch (error) {
			return;
		}
	}

	return {
		loggedInUser,
		openedUser,
		getById,
		getLoggedIn,
		editLoggedIn,
		deleteLoggedIn,
		adminGetUsers,
		adminEditUser,
		adminDeleteUser,
	};
});
