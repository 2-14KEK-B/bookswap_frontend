/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRouter, createWebHistory } from "vue-router";
import { App } from "vue";
import { routes } from "../routes";
import { User } from "@interfaces/user";
import getUserFromLocalStorage from "./../utils/localstorage";
import { useUserStore } from "@stores/user";
import $axios from "@api/axios";

const publicPathNames = ["home", "auth"];
const adminPathsNames = ["admin_home", "admin_user", "admin_book", "admin_borrow", "admin_message"];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to, from) => {
	const userStore = useUserStore();
	const user: User | null = getUserFromLocalStorage();
	// console.log(user, userStore.getLoggedUser);
	// console.log(getUserFromLocalStorage())
	if (!userStore.getLoggedUser) {
		if (user) {
			await userStore.checkValidUser();
		} else {
			if (!publicPathNames.includes(to.name as string)) {
				return { name: "auth" };
			}
		}
	}
	if (adminPathsNames.includes(to.name as string)) {
		const { data } = await $axios.get("auth");
		if (data.role !== "admin") return "/";
	}
});

const install = (app: App) => {
	app.use(router);
};

export { install, router };
