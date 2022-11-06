import { defineStore } from "pinia";
import { computed, ref, WritableComputedRef } from "vue";
// import { useRouter } from "vue-router";
import { router } from "../modules/router";
import { AxiosResponse } from "axios";
import $axios from "@api/axios";
import { handle } from "@utils/error";
import { User } from "@interfaces/user";
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

	function handleUserSuccess(res: AxiosResponse) {
		// console.log("user in handlesuccess: ", res.data);
		const user: User = res.data;
		localStorage.setItem("user", JSON.stringify(user));
		loggedInUser.value = user;
	}

	async function checkValidUser() {
		return $axios
			.get("auth")
			.then((res) => {
				handleUserSuccess(res);
				// console.log("logged user after test: ", loggedInUser.value);
			})
			.catch((error) => {
				handle(error);
			});
	}

	async function login(userData: LoginCred) {
		return $axios
			.post("auth/login", userData)
			.then(async (res) => {
				handleUserSuccess(res);
				// const user: User = res.data;
				// console.log(res);
				// localStorage.setItem("user", JSON.stringify(user));
				// loggedInUser.value = user;
				if (loggedInUser.value?.role === "admin") router.push({ name: "admin_home" });
				else router.push({ name: "home" });
				// $axios.get("test").then((res) => console.log("test: ", res));
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
		register,
		logOut,
		checkValidUser,
		// loginWithGoogle,
	};
});