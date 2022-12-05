<template>
	<div>
		<h1>Edit profil</h1>
	</div>
	<div>
		<q-form @submit.prevent="editUser">
			<q-input v-model="usernameinput" rounded outlined class="input" label="Username" />
			<q-input v-model="fullnameinput" rounded outlined class="input" label="Fullname" />
			<q-input v-model="picinput" rounded outlined class="input" label="Picture" />
			<q-btn type="submit">Edit</q-btn>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { useUserStore } from "@stores/user";
	import { ref } from "vue";
	import { useRouter } from "vue-router";

	const userStore = useUserStore();
	const router = useRouter();

	const usernameinput = ref(userStore.getLoggedUser?.username);
	const fullnameinput = ref(userStore.getLoggedUser?.fullname);
	const picinput = ref(userStore.getLoggedUser?.picture);

	async function editUser() {
		await userStore.edit({ username: usernameinput.value, fullname: fullnameinput.value, picture: picinput.value })
		await router.push("/me")
	}

</script>

<style scoped>
</style>
