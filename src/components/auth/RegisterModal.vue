<template>
	<q-card style="width: 500px" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'">
		<p class="text-h4">Register</p>
		<q-form @submit.prevent="emits('register', userCred)">
			<q-input v-model="userCred.username" type="text" label="Username:" />
			<q-input v-model="userCred.email" type="text" label="Email:" />
			<q-input v-model="userCred.password" type="password" label="Password:" autocomplete="on" />
			<div class="q-py-sm flex justify-evenly">
				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					:disabled="isDisabled"
					type="submit"
					label="Register"
				/>
				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					label="Go to Login"
					@click="emits('to-login')"
				/>
			</div>
		</q-form>
	</q-card>
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
