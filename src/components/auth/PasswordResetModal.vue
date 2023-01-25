<template>
	<q-dialog v-model="appStore.passwordReset">
		<q-card :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'" style="min-width: 300px" class="q-pa-md">
			<q-card-section class="row q-pt-none q-px-none">
				<div class="text-h4 q-pr-lg">{{ $t("auth.newPasswordRequest") }}</div>
				<q-space />
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-card-section>
			<q-separator />
			<q-form @submit.prevent="sendRequest">
				<q-input
					v-model="email"
					:label="$t('user.email')"
					lazy-rules
					reactive-rules
					class="q-my-sm"
					:rules="[(val) => !!val || $t('formValidation.required')]"
				/>

				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					:disabled="email.length < 5"
					type="submit"
					no-caps
					:label="$t('button.send')"
				/>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useAuthStore } from "@stores/auth";
	import { matClose } from "@quasar/extras/material-icons";

	const appStore = useAppStore();
	const authStore = useAuthStore();

	const email = ref("");

	async function sendRequest() {
		await authStore.sendResetPasswordRequest(email.value);
		appStore.passwordReset = false;
	}
</script>

<style scoped></style>
