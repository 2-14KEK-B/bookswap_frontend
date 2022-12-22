import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "@api/axios";
import socket from "@api/socket";
import { router } from "../modules/router";
import { useMessageStore } from "./message";
import { handle } from "@utils/error";
import { setInfoFromOtherUser } from "@utils/message";
import { AxiosResponse } from "axios";
import { Message } from "@interfaces/message";
import { User, EditUser } from "@interfaces/user";
import { LoginCred, RegisterCred } from "@interfaces/auth";

export const useUserStore = defineStore("user", () => {
	const loggedInUser = ref<User>();

	function saveUserData(res: AxiosResponse) {
		const messageStore = useMessageStore();
		const user: User = res.data;
		// console.log(user);
		localStorage.setItem("user_id", user._id as string);
		loggedInUser.value = user;
		messageStore.messages = (user.messages as Message[])?.map((message) => setInfoFromOtherUser(message));
		socket.connect();
		socket.emit("user-online", user._id as string);
	}

	async function checkValidUser() {
		return $axios
			.get("auth")
			.then((res) => {
				saveUserData(res);
			})
			.catch((error) => {
				handle(error);
			});
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
		return $axios
			.post("auth/login", loginData)
			.then(async (res) => {
				saveUserData(res);
				router.push({ name: "home" });
			})
			.catch(handle);
	}
	async function loginWithGoogle(token: string) {
		return $axios
			.post("auth/google", { token: token })
			.then(async (res) => {
				saveUserData(res);
				router.push({ name: "home" });
			})
			.catch(handle);
	}
	async function edit(userData: EditUser) {
		return $axios
			.patch(`user/${loggedInUser.value?._id}`, userData)
			.then(async (res) => {
				saveUserData(res);
			})
			.catch(handle);
	}

	async function register(userData: RegisterCred) {
		return $axios.post("auth/register", userData).catch(handle);
	}

	async function logOut() {
		$axios.post("auth/logout").catch(handle);
		socket.disconnect();
		localStorage.removeItem("user_id");
		loggedInUser.value = undefined;
		await router.push({ name: "auth" });
	}

	return {
		socket,
		loggedInUser,
		login,
		loginWithGoogle,
		register,
		logOut,
		checkValidUser,
		edit,
	};
});
