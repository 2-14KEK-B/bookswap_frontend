<template>
	<q-card style="width: 500px" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'">
		<p class="text-h4">{{ $t("auth.login") }}</p>
		<q-separator />
		<q-form @submit.prevent="emits('login', userCred)">
			<q-input
				v-model="userCred.emailOrUsername"
				type="text"
				:label="$t('auth.emailOrUsername') + ':'"
				autocomplete="on"
			/>
			<q-input v-model="userCred.password" type="password" :label="$t('auth.password') + ':'" autocomplete="on" />
			<div class="q-py-sm flex justify-evenly">
				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					:disabled="isDisabled"
					type="submit"
					:label="$t('auth.login')"
				/>
				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					:label="$q.screen.gt.xs ? $t('auth.goToRegister') : $t('auth.register')"
					@click="emits('to-register')"
				/>
				<GoogleLogin :callback="googleCallback" popup-type="TOKEN" auto-login>
					<q-btn
						:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
						:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
						:icon="fabGoogle"
						:label="$q.screen.gt.xs ? $t('auth.googleLogin') : ''"
					/>
				</GoogleLogin>
			</div>
		</q-form>
	</q-card>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { CallbackTypes, GoogleLogin } from "vue3-google-login";
	import { fabGoogle } from "@quasar/extras/fontawesome-v6";
	import type { LoginCred } from "@interfaces/auth";

	const userCred = ref<LoginCred>({ emailOrUsername: "", password: "" });

	function googleCallback(res: CallbackTypes.TokenPopupResponse) {
		emits("login-with-google", res.access_token);
	}

	const isDisabled = computed(() => {
		if (userCred.value.password.length < 4 || userCred.value.emailOrUsername.length < 4) {
			return true;
		} else return false;
	});

	const emits = defineEmits<{
		(e: "login", userCred: LoginCred): void;
		(e: "to-register"): void;
		(e: "login-with-google", token: string): void;
	}>();
</script>

<style scoped>
	#title {
		text-decoration: underline;
	}
</style>
