<template>
	<router-view />
</template>

<script setup lang="ts">
	// import { onBeforeMount } from "vue";
	// import { useUserStore } from "@stores/user";
	// import $axios from "@api/axios";
	// import getUserFromLocalStorage from "@utils/localstorage";
	// import { handle } from "@utils/error";

	// $axios.get("test").then((res) => console.log(res));

	// onMounted(() => {
	// 	console.log("logged user in app: ", loggedInUser);
	// });

	// onBeforeMount(async () => {
	// 	const { checkValidUser, loggedInUser } = useUserStore();
	// 	await checkValidUser();
	// 	console.log("logged user in app: ", loggedInUser);
	// });

	// onBeforeMount(async () => {
	// 	const userStore = useUserStore();
	// 	const user = getUserFromLocalStorage();
	// 	// console.log("loggedInUser: ", userStore.getLoggedUser);
	// 	// console.log("user_id: ", user?._id);
	// 	if (!userStore.getLoggedUser && user) {
	// 		await $axios
	// 		.get("test")
	// 		.then(async (res) => {
	// 				userStore.getLoggedUser = res.data;
	// 				console.log("loggedInUser: ", userStore.getLoggedUser);
	// 			})
	// 			.catch(handle);
	// 	}
	// });
</script>
