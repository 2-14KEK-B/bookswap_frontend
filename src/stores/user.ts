import { defineStore } from "pinia";
import { computed, ref, WritableComputedRef } from "vue";
// import { useRouter } from "vue-router";
import { router } from "../modules/router";
import { AxiosResponse } from "axios";
import $axios from "@api/axios";
import { handle } from "@utils/error";
import { User, EditUser } from "@interfaces/user";
import { LoginCred, RegisterCred } from "@interfaces/auth";

export const useUserStore = defineStore("user", () => {
	const loggedInUser = ref<User>();

	const getLoggedUser: WritableComputedRef<User | undefined> = computed({
		get(): User | undefined {
			return loggedInUser.value;
		},
		set(newUser?: User): void {
			loggedInUser.value = newUser;
		},
	});

	function saveUserData(res: AxiosResponse) {
		const user: User = res.data;
		// console.log(res.data);
		localStorage.setItem("user", JSON.stringify(user));
		loggedInUser.value = user;
	}

	async function checkValidUser() {
		return $axios
			.get("auth")
			.then((res) => {
				saveUserData(res);
				// console.log("logged user after test: ", loggedInUser.value);
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
				if (loggedInUser.value?.role === "admin") router.push({ name: "admin_home" });
				else router.push({ name: "home" });
			})
			.catch(handle);
	}
	async function loginWithGoogle(token: string) {
		return $axios
			.post("auth/google", { token: token })
			.then(async (res) => {
				saveUserData(res);
				if (loggedInUser.value?.role === "admin") router.push({ name: "admin_home" });
				else router.push({ name: "home" });
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
		localStorage.removeItem("user");
		loggedInUser.value = undefined;
		await router.push({ name: "auth" });
	}

	return {
		getLoggedUser,
		login,
		loginWithGoogle,
		register,
		logOut,
		checkValidUser,
		edit,
	};
});
