import { useBookStore } from "@stores/book";
import { useUserStore } from "@stores/user";
import { getOverallRate, isLoggedInUserAlreadyRated } from "@utils/bookHelper";
import type { User } from "@interfaces/user";
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
				path: "newBook",
				name: "newBook",
				component: () => import("@views/NewBookView.vue"),
			},
			{
				path: "me",
				name: "myProfile",
				component: () => import("@views/loggedIn/ProfileView.vue"),
				beforeEnter: async () => {
					const userStore = useUserStore();
					await userStore.getLoggedIn();
				},
			},
			{
				path: "books",
				name: "myBooks",
				component: () => import("@views/loggedIn/BooksView.vue"),
			},
			{
				path: "user/:id",
				name: "userProfile",
				component: () => import("@views/UserProfileView.vue"),
				beforeEnter: async (to) => {
					const userStore = useUserStore();
					const user = await userStore.getById(to.params.id as string);
					if (user) {
						userStore.openedUser = user;
					}
				},
			},
			{
				path: "book/:id",
				name: "book",
				component: () => import("@views/BookView.vue"),
				beforeEnter: async (to) => {
					const bookStore = useBookStore();
					const book = await bookStore.getBookById(to.params.id as string);
					if (book) {
						bookStore.openedBook = book;
						bookStore.openedBook.overallRate = getOverallRate(bookStore.openedBook.rates);
						const userStore = useUserStore();
						if (userStore.loggedInUser) {
							bookStore.openedBook.loggedInAlreadyRated = isLoggedInUserAlreadyRated(bookStore.openedBook.rates);
						}
					}
				},
			},
			{
				path: "borrow/:id",
				name: "borrowBook",
				component: () => import("@views/BorrowBookView.vue"),
				beforeEnter: async (to) => {
					const bookStore = useBookStore();
					const book = await bookStore.getBookById(to.params.id as string);
					if (book) {
						bookStore.openedBook = book;
						bookStore.openedBook.overallRate = getOverallRate(bookStore.openedBook.rates);
						const userStore = useUserStore();
						const user = await userStore.getById((book?.uploader as User)._id as string);
						if (user && bookStore.openedBook) {
							bookStore.openedBook.uploader = user;
							bookStore.openedBook.loggedInAlreadyRated = isLoggedInUserAlreadyRated(bookStore.openedBook.rates);
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
