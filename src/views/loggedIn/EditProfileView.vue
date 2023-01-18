<template>
	<div class="q-mx-lg">
		<h4>Edit profil</h4>
	</div>
	<div class="q-pa-lg">
		<q-form @submit.prevent="editUser" @reset="reset">
			<q-input v-model="userData.username" label="Username" />
			<q-input v-model="userData.fullname" label="Fullname" />
			<q-input v-model="userData.picture" label="Picture" />
			<div class="q-my-lg">
				<q-btn label="Submit" type="submit" color="primary" />
				<q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import type { EditUser } from "@interfaces/user";
	import { useUserStore } from "@stores/user";
	import { ref, readonly } from "vue";
	import { useRouter } from "vue-router";

	const userStore = useUserStore();
	const router = useRouter();

	const defaultData = readonly<Partial<EditUser>>({
		username: userStore.loggedInUser?.username,
		fullname: userStore.loggedInUser?.fullname,
		picture: userStore.loggedInUser?.picture,
	});
	const userData = ref<EditUser>({
		username: defaultData.username,
		fullname: defaultData.fullname,
		picture: defaultData.picture,
	});

	async function editUser() {
		let dataToSend: EditUser = {};
		if (userData.value.username != defaultData.username) {
			dataToSend.username = userData.value.username;
		}
		if (userData.value.fullname != defaultData.fullname) {
			dataToSend.fullname = userData.value.fullname;
		}
		if (userData.value.picture != defaultData.picture) {
			dataToSend.picture = userData.value.picture;
		}

		if (dataToSend.username || dataToSend.fullname || dataToSend.picture) {
			await userStore.editLoggedIn(dataToSend);
			await router.push("/me");
		}
	}

	function reset() {
		Object.assign(userData.value, defaultData);
	}
</script>

<style scoped></style>
