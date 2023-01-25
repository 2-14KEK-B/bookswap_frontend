<template>
	<div
		style="height: 100vh"
		class="flex justify-center items-center"
		:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
	>
		<q-card
			style="min-width: 400px; max-width: 500px"
			class="q-pa-lg"
			:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'"
		>
			<q-card-section class="row q-pt-none q-px-none">
				<div class="text-h4 q-pr-lg">{{ t("sendNewPassword") }}</div>
			</q-card-section>
			<q-separator />
			<q-form @submit="sendNewPassword">
				<q-input v-model="oldPassword" type="password" :label="t('oldPassword')" />
				<q-input v-model="newPassword" type="password" :label="t('newPassword')" />
				<q-input v-model="temp" type="password" :label="t('againNewPassword')" />
				<q-btn
					class="q-mt-lg q-py-sm"
					type="submit"
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					no-caps
					:label="$t('button.send')"
				/>
				<!-- :disable="oldPassword == newPassword || newPassword != temp" -->
			</q-form>
		</q-card>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { useAuthStore } from "@stores/auth";
	import { useI18n } from "vue-i18n";

	const route = useRoute();
	const router = useRouter();
	const authStore = useAuthStore();
	const { t } = useI18n({
		messages: {
			en: {
				sendNewPassword: "Send new password",
				oldPassword: "Old password",
				newPassword: "New password",
				againNewPassword: "New password again",
			},
			hu: {
				sendNewPassword: "Új jelszó küldése",
				oldPassword: "Régi jelszó",
				newPassword: "Új jelszó",
				againNewPassword: "Új jelszó újra",
			},
		},
	});

	const oldPassword = ref("");
	const newPassword = ref("");
	const temp = ref("");

	async function sendNewPassword() {
		if (newPassword.value != temp.value) {
			return;
		}
		await authStore.resetPassword(route.query.token as string, oldPassword.value, newPassword.value);
		await router.push("/");
	}
</script>

<style scoped></style>
