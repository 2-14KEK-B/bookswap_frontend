import $axios from "@api/axios";
import socket from "@api/socket";
import { Loading } from "quasar";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useMessageStore } from "./message";
import { router } from "../modules/router";
import { setInfoFromOtherUser } from "@utils/message";
import { LoginCred, RegisterCred } from "@interfaces/auth";
import { Message } from "@interfaces/message";
import { User } from "@interfaces/user";

export const userAuthStore = defineStore("auth", () => {
	async function checkValidUser() {
		try {
			Loading.show();
			const { data } = await $axios.get("/auth");
			saveUserData(data);
		} catch (error) {
			// if (error instanceof AxiosError) {
			// 	Loading.hide();
			// 	Notify.create({
			// 		message: error.response?.data as string,
			// 		color: "red",
			// 	});
			// }
			socket.disconnect();
			localStorage.removeItem("user_id");
			await router.push({ name: "home" });
		}
	}

	function saveUserData(user: User) {
		const userStore = useUserStore();
		const messageStore = useMessageStore();
		localStorage.setItem("user_id", user._id as string);

		userStore.loggedInUser = user;
		messageStore.messages = (user.messages as Message[])?.map((message) => setInfoFromOtherUser(message));
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
