<template>
	<div>Password Reset</div>
	<q-form @submit="sendNewPassword">
		<q-input v-model="oldPassword" label="Old password:" />
		<q-input v-model="newPassword" label="New password:" />
		<q-input v-model="temp" label="New password again:" />

		<q-btn type="submit" label="Send" />
	</q-form>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { useAuthStore } from "@stores/auth";

	const route = useRoute();
	const router = useRouter();
	const authStore = useAuthStore();

	const oldPassword = ref("");
	const newPassword = ref("");
	const temp = ref("");

	async function sendNewPassword() {
		if (newPassword.value != temp.value) {
			console.log("nem ugyan az a két jelszó");
			return;
		}
		await authStore.resetPassword(route.params["token"] as string, oldPassword.value, newPassword.value);
		await router.push("/");
	}
</script>

<style scoped></style>
