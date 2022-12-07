<template>
	<div class="q-mx-lg">
		<h4>Edit profil</h4>
	</div>
	<div class="q-pa-lg">
		<q-form @submit.prevent="editUser" @reset="reset">
			<q-input v-model="userData.username" label="Username" clearable />
			<q-input v-model="userData.fullname" label="Fullname" clearable />
			<q-input v-model="userData.picture" label="Picture" clearable />
			<div class="q-my-lg">
				<q-btn label="Submit" type="submit" color="primary" />
				<q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { useUserStore } from "@stores/user";
	import { onMounted, ref } from "vue";
	import { useRouter } from "vue-router";

	const userStore = useUserStore();
	const router = useRouter();

	interface ModifiableData {
		username?: string;
		fullname?: string;
		picture?: string;
	}
	let defaultValue: ModifiableData;

	const userData = ref<ModifiableData>({});

	async function editUser() {
		// let dataToSend: ModifiableData = {};
		// Object.keys(userData.value).forEach((x: string | keyof ModifiableData) => {
		// 	if (userData.value[x as keyof ModifiableData] != defaultValue[x as keyof ModifiableData]) {
		// 		dataToSend[x as keyof ModifiableData] = userData.value[x as keyof ModifiableData];
		// 	}
		// 	console.log(userData.value[x as keyof ModifiableData], defaultValue[x as keyof ModifiableData]);
		// });
		if (Object.keys(userData.value).length > 0) {
			await userStore.edit(userData.value);
			await router.push("/me");
		}
	}

	function reset() {
		userData.value = defaultValue;
	}

	onMounted(() => {
		if (userStore.getLoggedUser) {
			const loggedInUser = userStore.getLoggedUser;
			defaultValue = {
				username: loggedInUser.username || "",
				fullname: loggedInUser.fullname || "",
				picture: loggedInUser.picture || "",
			};
		}
	});
</script>

<style scoped></style>
