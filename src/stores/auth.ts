import $axios from "@api/axios";
import socket from "@api/socket";
import { Loading } from "quasar";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useBorrowStore } from "./borrow";
import { useMessageStore } from "./message";
import { useUserRateStore } from "./userRate";
import { router } from "../modules/router";
import { setInfoFromOtherUser } from "@utils/message";
import type { LoginCred, RegisterCred } from "@interfaces/auth";
import type { Message } from "@interfaces/message";
import type { User } from "@interfaces/user";
import type { Borrow } from "@interfaces/borrow";
import type { UserRate } from "@interfaces/userRate";
import { useBookStore } from "./book";
import type { Book } from "@interfaces/book";

export const userAuthStore = defineStore("auth", () => {
	async function checkValidUser() {
		try {
			Loading.show();
			const { data } = await $axios.get("/auth");
			saveUserData(data);
		} catch (error) {
			socket.disconnect();
			localStorage.removeItem("user_id");
			await router.push({ name: "home" });
		}
	}

	function saveUserData(user: User) {
		const userStore = useUserStore();
		const bookStore = useBookStore();
		const borrowStore = useBorrowStore();
		const messageStore = useMessageStore();
		const userRateStore = useUserRateStore();
		localStorage.setItem("user_id", user._id as string);

		userStore.loggedInUser = user;
		bookStore.loggedInBooks = user.books as Book[];
		messageStore.loggedInMessages = (user.messages as Message[])?.map((message) =>
			setInfoFromOtherUser(message, user._id as string),
		);
		borrowStore.loggedInBorrows = user.borrows as Borrow[];
		userRateStore.loggedInRates = user.user_rates as { from: UserRate[]; to: UserRate[] };
		socket.connect();
		socket.emit("user-online", user._id as string);
	}

	async function login(userData: LoginCred) {
		const isEmail = new RegExp(
			/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,
		);
		const loginData: { email?: string; username?: string; password: string } = { password: userData.password };
		if (isEmail.test(userData.emailOrUsername)) {
			loginData.email = userData.emailOrUsername;
		} else {
			loginData.username = userData.emailOrUsername;
		}
		try {
			Loading.show();
			const { data } = await $axios.post("/auth/login", loginData);
			saveUserData(data);
			await router.push({ name: "home" });
		} catch (error) {
			return;
		}
	}

	async function loginWithGoogle(token: string) {
		try {
			Loading.show();
			const { data } = await $axios.post("/auth/google", { token: token });
			saveUserData(data);
			await router.push({ name: "home" });
		} catch (error) {
			return;
		}
	}

	async function register(userData: RegisterCred) {
		try {
			Loading.show();
			await $axios.post("/auth/register", userData);
		} catch (error) {
			return;
		}
	}

	async function logOut() {
		try {
			const userStore = useUserStore();
			Loading.show();
			await $axios.post("/auth/logout");
			socket.disconnect();
			localStorage.removeItem("user_id");
			userStore.loggedInUser = undefined;
			await router.push({ name: "home" });
		} catch (error) {
			return;
		}
	}

	return { login, loginWithGoogle, register, logOut, checkValidUser };
});
