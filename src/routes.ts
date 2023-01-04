import { useBookStore } from "@stores/book";
import { useUserStore } from "@stores/user";
import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("@layouts/MainLayout.vue"),
		children: [
			{
				path: "",
				name: "home",
				component: () => import("@views/HomeView.vue"),
			},
			{
				path: "message",
				name: "message",
				component: () => import("@views/MessageView.vue"),
			},
			{
				path: "editProfile",
				name: "editProfile",
				component: () => import("@views/EditProfile.vue"),
			},
			{
				path: "auth",
				name: "auth",
				component: () => import("@views/AuthView.vue"),
			},
			{
				path: "newBook",
				name: "newBook",
				component: () => import("@views/NewBook.vue"),
			},
			{
				path: "me",
				name: "myProfile",
				component: () => import("@views/MyProfileView.vue"),
				beforeEnter: async () => {
					const userStore = useUserStore();
					await userStore.getLoggedIn();
				},
			},
			{
				path: "user/:id",
				name: "userProfile",
				component: () => import("@views/UserProfileView.vue"),
				beforeEnter: async (to) => {
					const userStore = useUserStore();
					const user = await userStore.getById(to.params.id as string);
					to.meta.user = user;
				},
			},
			{
				path: "book/:id",
				name: "book",
				component: () => import("@views/BookView.vue"),
				beforeEnter: async (to) => {
					const bookStore = useBookStore();
					const book = await bookStore.getBookById(to.params.id as string);
					to.meta.book = book;
				},
			},
			{
				path: "borrow/:id",
				name: "borrowBook",
				component: () => import("@views/BorrowBook.vue"),
				beforeEnter: async (to) => {
					const userStore = useUserStore();
					const bookStore = useBookStore();
					const book = await bookStore.getBookById(to.params.id as string);
					if (book) {
						const user = await userStore.getById(book?.uploader);
						if (user) {
							to.meta.book = book;
							to.meta.user = user;
						}
					}
				},
			},
		],
	},
	{
		path: "/admin",
		component: () => import("@layouts/AdminLayout.vue"),
		children: [
			{
				path: "",
				name: "admin_home",
				component: () => import("@views/HomeView.vue"),
			},
			{
				path: "user",
				name: "admin_user",
				component: () => import("@views/admin/UserView.vue"),
			},
			{
				path: "book",
				name: "admin_book",
				component: () => import("@views/admin/BookView.vue"),
			},
			{
				path: "borrow",
				name: "admin_borrow",
				component: () => import("@views/admin/BorrowView.vue"),
			},
			{
				path: "message",
				name: "admin_message",
				component: () => import("@views/admin/MessageView.vue"),
			},
		],
	},
	{
		path: "/:pathMatch(.*)*",
		name: "notfound",
		component: () => import("@views/404View.vue"),
	},
];
