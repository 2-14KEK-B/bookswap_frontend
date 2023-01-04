<template>
	<div style="width: 500px">
		<p class="text-h4">Register</p>
		<q-form @submit.prevent="emits('register', userCred)">
			<q-input v-model="userCred.username" type="text" label="Username:" />
			<q-input v-model="userCred.email" type="text" label="Email:" />
			<q-input v-model="userCred.password" type="password" label="Password:" autocomplete="on" />
			<div class="q-py-sm flex justify-evenly">
				<q-btn :disabled="isDisabled" type="submit">Register</q-btn>
				<q-btn @click="emits('to-login')">Go to Login</q-btn>
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { computed, reactive } from "vue";
	import type { RegisterCred } from "@interfaces/auth";

	const emits = defineEmits<{ (e: "register", userCred: RegisterCred): void; (e: "to-login"): void }>();
	const userCred = reactive<RegisterCred>({ email: "", username: "", password: "" });

	const isDisabled = computed(() => {
		if (userCred["password"].length < 4 || userCred["email"].length < 4) {
			return true;
		} else return false;
	});
</script>

<style scoped></style>
