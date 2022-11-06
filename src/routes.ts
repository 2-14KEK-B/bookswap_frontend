import { RouteRecordRaw } from "vue-router";

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
				path: "auth",
				name: "auth",
				component: () => import("@views/AuthView.vue"),
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
	// {
	// 	path: "/home",
	// 	name: "home",
	// 	component: () => import("@views/HomeView.vue"),
	// },
	// { path: "/admin", name: "admin", component: () => import("@views/AdminView.vue") },
	// {
	// 	path: "/auth",
	// 	name: "auth",
	// 	component: () => import("@views/AuthView.vue"),
	// },
	// {
	// 	path: "/book",
	// 	name: "book",
	// 	component: () => import("@views/BookView.vue"),
	// },
	// {
	// 	path: "/borrow",
	// 	name: "borrow",
	// 	component: () => import("@views/BorrowView.vue"),
	// },
	// {
	// 	path: "/message",
	// 	name: "message",
	// 	component: () => import("@views/MessageView.vue"),
	// },
	// {
	// 	path: "/:pathMatch(.*)*",
	// 	name: "notfound",
	// 	component: () => import("@views/404View.vue"),
	// },import component from './vite-env.d';
];
