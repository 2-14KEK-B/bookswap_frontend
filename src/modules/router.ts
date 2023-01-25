import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../routes";
import { useUserStore } from "@stores/user";
import $axios from "@api/axios";
import { useAuthStore } from "@stores/auth";
import type { App } from "vue";

const publicPathNames = ["home", "auth", "userProfile", "book"];
const adminPathsNames = ["admin_home", "admin_user", "admin_book", "admin_borrow", "admin_message"];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to) => {
	const userStore = useUserStore();
	const authStore = useAuthStore();
	const user_id: string | null = localStorage.getItem("user_id");
	if (!userStore.loggedInUser) {
		if (user_id != null) {
			await authStore.checkValidUser();
		} else {
			if (!publicPathNames.includes(to.name as string)) {
				return { name: "auth" };
			}
		}
	}
	if (adminPathsNames.includes(to.name as string)) {
		const { data } = await $axios.get("/auth");
		if (data.role !== "admin") return "/";
	}
});

const install = (app: App) => {
	app.use(router);
};

export { install, router };
