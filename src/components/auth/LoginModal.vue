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
			<q-separator class="q-mb-xs" />
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
				<q-btn
					dense
					no-caps
					flat
					class="q-my-xs"
					:label="$t('auth.forgottenPassword')"
					@click="appStore.passwordReset = true"
				/>
				<div class="column">
					<div class="col-6 q-gutter-md q-py-sm flex justify-evenly">
						<q-btn
							:color="$q.dark.isActive ? 'grey-5' : 'grey-7'"
							:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
							:disabled="isDisabled"
							type="submit"
							no-caps
							:style="{ width: $q.screen.gt.xs ? 240 + 'px' : 140 + 'px' }"
							data-cy="loginButton"
							:label="$t('auth.login')"
						/>
						<!-- @click="emits('to-register')" -->
						<q-btn
							:color="$q.dark.isActive ? 'grey-5' : 'grey-7'"
							:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
							:label="$q.screen.gt.xs ? $t('auth.goToRegister') : $t('auth.register')"
							no-caps
							:style="{ width: $q.screen.gt.xs ? 240 + 'px' : 140 + 'px' }"
							data-cy="openRegisterButton"
							@click="toRegister"
						/>
					</div>
					<div class="col-6 q-gutter-md q-py-sm flex justify-evenly">
						<!-- :icon="$q.screen.lt.sm ? fabGoogle : 'none'" -->
						<GoogleLogin :callback="loginWithGoogle" popup-type="TOKEN" auto-login :error="onGoogleError">
							<q-btn
								:class="$q.screen.gt.xs ? 'notShow' : ''"
								:color="$q.dark.isActive ? 'grey-5' : 'grey-7'"
								:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
								:icon="`img:${google}`"
								no-caps
								:label="$q.screen.gt.xs ? $t('auth.googleLogin') : ''"
								:style="{ width: $q.screen.gt.xs ? 240 + 'px' : 140 + 'px' }"
							/>
						</GoogleLogin>
						<FacebookButton />
					</div>
				</div>
			</q-form>
		</q-card>
	</q-dialog>
	<PasswordResetModal v-if="appStore.passwordReset" />
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { Notify } from "quasar";
	import { useI18n } from "vue-i18n";
	import { useAppStore } from "@stores/app";
	import { useAuthStore } from "@stores/auth";
	import { CallbackTypes, GoogleLogin } from "vue3-google-login";
	import PasswordResetModal from "@components/auth/PasswordResetModal.vue";
	import FacebookButton from "@components/auth/FacebookButton.vue";
	import { matClose } from "@quasar/extras/material-icons";
	import type { LoginCred } from "@interfaces/auth";

	import google from "/google.svg";

	const { t } = useI18n({ useScope: "global" });
	const appStore = useAppStore();
	const authStore = useAuthStore();
	const userCred = ref<LoginCred>({ emailOrUsername: "", password: "" });

	async function login() {
		await authStore.login(userCred.value);
	}

	async function loginWithGoogle(res: CallbackTypes.TokenPopupResponse) {
		await authStore.loginWithGoogle(res.access_token);
	}

	function onGoogleError() {
		Notify.create({ message: t("auth.error.google") });
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
</script>

<style></style>
