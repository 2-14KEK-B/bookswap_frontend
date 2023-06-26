import $axios from "@api/axios";
import socket from "@api/socket";
import { Loading, Notify, LocalStorage } from "quasar";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useBookStore } from "./book";
import { useBorrowStore } from "./borrow";
import { useMessageStore } from "./message";
import { useUserRateStore } from "./userRate";
import { router } from "../modules/router";
import { type availableLocales, setLocale } from "../modules/i18n";
import { setInitialMessageInfo } from "@utils/messageHelper";
import { isEmail } from "@utils/validationHelper";
import type { LoginCred } from "@interfaces/auth";
import type { Message } from "@interfaces/message";
import type { User } from "@interfaces/user";
import type { Borrow } from "@interfaces/borrow";
import type { UserRate } from "@interfaces/userRate";
import type { Book } from "@interfaces/book";

export const useAuthStore = defineStore("auth", () => {
	async function checkValidUser() {
		try {
			Loading.show();
			const { data } = await $axios.get("/auth");
			saveUserData(data);
		} catch (error) {
			socket.disconnect();
			LocalStorage.remove("user_id");
			await router.push({ name: "home" });
		}
	}

	function saveUserData(user: User) {
		const userStore = useUserStore();
		const bookStore = useBookStore();
		const borrowStore = useBorrowStore();
		const messageStore = useMessageStore();
		const userRateStore = useUserRateStore();
		LocalStorage.set("user_id", user._id as string);
		setLocale(user.locale as availableLocales);

		userStore.loggedInUser = user;
		bookStore.loggedInBooks = user.books as Book[];
		messageStore.loggedInMessages = (user.messages as Message[])?.map((message) => setInitialMessageInfo(message));
		borrowStore.loggedInBorrows = user.borrows as Borrow[];
		userRateStore.loggedInRates = user.user_rates as { from: UserRate[]; to: UserRate[] };

		socket.connect();
		socket.emit("user-online", user._id as string);
	}

	async function login(userData: LoginCred) {
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

	async function loginWithFacebook(userId: string, token: string) {
		try {
			Loading.show();
			const { data } = await $axios.post("/auth/facebook", { userID: userId, token: token });
			// console.log(data);
			saveUserData(data);
			await router.push({ name: "home" });
		} catch (error) {
			return;
		}
	}

	async function register(userData: Partial<User>) {
		try {
			Loading.show();
			const { status } = await $axios.post("/auth/register", userData);
			if (status < 400) {
				Notify.create({ message: "E-mail has been sent. Check you incoming e-mails" });
			}
		} catch (error) {
			return;
		}
	}

	async function validateEmail(token: string) {
		try {
			const { status, data } = await $axios.get(`/auth/verify-email?token=${token}`);
			if (status < 400) {
				Notify.create({ message: data });
			}
		} catch (error) {
			return;
		}
	}

	async function sendResetPasswordRequest(email: string) {
		try {
			if (!isEmail.test(email)) {
				return;
			}
			const { status, data } = await $axios.post("/auth/forgot-password", { email });
			if (status < 400) {
				Notify.create({ message: data });
			}
		} catch (error) {
			return;
		}
	}

	async function resetPassword(token: string, oldPassword: string, newPassword: string) {
		try {
			const { status, data } = await $axios.post("/auth/reset-password", { token, oldPassword, newPassword });
			if (status < 400) {
				Notify.create({ message: data });
			}
		} catch (error) {
			return;
		}
	}

	async function logOut() {
		try {
			Loading.show();
			await $axios.get("/auth/logout");
			socket.disconnect();
			LocalStorage.remove("user_id");
			const userStore = useUserStore();
			userStore.loggedInUser = undefined;
			await router.push({ name: "home" });
		} catch (error) {
			return;
		}
	}

	return {
		login,
		loginWithGoogle,
		loginWithFacebook,
		register,
		validateEmail,
		sendResetPasswordRequest,
		resetPassword,
		logOut,
		checkValidUser,
	};
});
