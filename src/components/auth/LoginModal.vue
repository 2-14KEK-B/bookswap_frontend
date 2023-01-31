<template>
	<q-dialog v-model="appStore.login">
		<q-card
			:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'"
			style="min-width: 350px"
			data-cy="loginModal"
			class="q-pa-md"
		>
			<q-card-section class="row q-pt-none q-px-none">
				<div class="text-h4 q-pr-lg">{{ $t("auth.login") }}</div>
				<q-space />
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-card-section>
			<q-separator />
			<q-form style="min-width: 300px" @submit.prevent="login">
				<q-input
					v-model="userCred.emailOrUsername"
					type="text"
					:label="$t('auth.emailOrUsername') + ':'"
					autocomplete="on"
					lazy-rules
					reactive-rules
					data-cy="emailOrUsernameLogin"
					:rules="[(val) => !!val || $t('formValidation.required')]"
				/>
				<q-input
					v-model="userCred.password"
					type="password"
					:label="$t('user.password') + ':'"
					autocomplete="on"
					lazy-rules
					reactive-rules
					data-cy="passwordLogin"
					:rules="[(val) => !!val || $t('formValidation.required')]"
				/>
				<q-btn dense no-caps @click="appStore.passwordReset = true">{{ $t("auth.forgottenPassword") }}</q-btn>
				<div class="q-gutter-md q-py-sm flex justify-evenly">
					<q-btn
						:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
						:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
						:disabled="isDisabled"
						type="submit"
						no-caps
						data-cy="loginButton"
						:label="$t('auth.login')"
					/>
					<!-- @click="emits('to-register')" -->
					<q-btn
						:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
						:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
						:label="$q.screen.gt.xs ? $t('auth.goToRegister') : $t('auth.register')"
						no-caps
						data-cy="openRegisterButton"
						@click="toRegister"
					/>
					<GoogleLogin :callback="loginWithGoogle" popup-type="TOKEN" auto-login>
						<q-btn
							:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
							:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
							:icon="fabGoogle"
							no-caps
							:label="$q.screen.gt.xs ? $t('auth.googleLogin') : ''"
						/>
					</GoogleLogin>
				</div>
			</q-form>
		</q-card>
	</q-dialog>
	<PasswordResetModal v-if="appStore.passwordReset" />
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { useAppStore } from "@stores/app";
	import { useAuthStore } from "@stores/auth";
	import { CallbackTypes, GoogleLogin } from "vue3-google-login";
	import PasswordResetModal from "@components/auth/PasswordResetModal.vue";
	import { fabGoogle } from "@quasar/extras/fontawesome-v6";
	import { matClose } from "@quasar/extras/material-icons";
	import type { LoginCred } from "@interfaces/auth";

	const appStore = useAppStore();
	const authStore = useAuthStore();
	const userCred = ref<LoginCred>({ emailOrUsername: "", password: "" });

	async function login() {
		await authStore.login(userCred.value);
		appStore.login = false;
	}

	async function loginWithGoogle(res: CallbackTypes.TokenPopupResponse) {
		await authStore.loginWithGoogle(res.access_token);
		appStore.login = false;
		// emits("login-with-google", res.access_token);
	}

	const isDisabled = computed(() => {
		if (userCred.value.password.length < 4 || userCred.value.emailOrUsername.length < 4) {
			return true;
		} else return false;
	});

	function toRegister() {
		appStore.login = false;
		appStore.register = true;
	}

	// const emits = defineEmits<{
	// 	(e: "login", userCred: LoginCred): void;
	// 	(e: "to-register"): void;
	// 	(e: "login-with-google", token: string): void;
	// }>();
</script>

<style scoped>
	#title {
		text-decoration: underline;
	}
</style>
