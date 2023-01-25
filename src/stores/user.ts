import { defineStore } from "pinia";
import { computed, ref } from "vue";
import $axios from "@api/axios";
import { Loading } from "quasar";
import { getNotSeenNotificationsCount, sortNotificationsByCreatedAt } from "@utils/userHelper";
import type { User, EditUser } from "@interfaces/user";
import type { PaginateResult, PathQuery } from "@interfaces/paginate";
import type { Notification } from "@interfaces/notification";

export const useUserStore = defineStore("user", () => {
	const loggedInUser = ref<User>();
	const openedUser = ref<User>();
	const notificationSum = computed(() => getNotSeenNotificationsCount(loggedInUser.value?.notifications));
	const sortedNotifications = computed(() => sortNotificationsByCreatedAt(loggedInUser.value?.notifications));
	const openedNotification = ref<Notification | null>(null);

	async function getById(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/user/${id}`);

			return data as User;
		} catch (error) {
			return;
		}
	}

	async function setNotificationSeen(notificationId?: string) {
		try {
			if (loggedInUser.value && notificationId) {
				await $axios.patch(`/user/me/notification/${notificationId}`);
				loggedInUser.value.notifications.some((n) => {
					if (n._id == notificationId) {
						n.seen = true;
						n.updatedAt = new Date().toISOString();
						return true;
					}
					return false;
				});
			}
		} catch (error) {
			return;
		}
	}

	async function deleteNotification(notificationId?: string) {
		try {
			if (loggedInUser.value && notificationId) {
				await $axios.delete(`/user/me/notification/${notificationId}`);
				loggedInUser.value.notifications = loggedInUser.value.notifications.filter((n) => n._id != notificationId);
			}
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
		notificationSum,
		sortedNotifications,
		openedNotification,
		getById,
		setNotificationSeen,
		deleteNotification,
		getLoggedIn,
		editLoggedIn,
		deleteLoggedIn,
		adminGetUsers,
		adminEditUser,
		adminDeleteUser,
	};
});
