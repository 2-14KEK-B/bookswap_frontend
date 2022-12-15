/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRouter, createWebHistory } from "vue-router";
import { App } from "vue";
import { routes } from "../routes";
import { useUserStore } from "@stores/user";

const publicPathNames = ["home", "auth"];
const adminPathsNames = ["admin_home", "admin_user", "admin_book", "admin_borrow", "admin_message"];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to, from) => {
	const userStore = useUserStore();
	const user_id: string | null = localStorage.getItem("user_id");
	if (!userStore.getLoggedUser) {
		if (user_id) {
			await userStore.checkValidUser();
		} else {
			if (!publicPathNames.includes(to.name as string)) {
				return { name: "auth" };
			}
		}
	}
	if (adminPathsNames.includes(to.name as string) && userStore.getLoggedUser?.role !== "admin") {
		return "/";
	}
});

const install = (app: App) => {
	app.use(router);
};

export { install, router };
