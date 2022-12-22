<template>
	<div style="width: 500px">
		<p class="text-h4">Login</p>
		<q-separator />
		<q-form @submit.prevent="emits('login', userCred)">
			<q-input v-model="userCred.emailOrUsername" type="text" label="Email or username:" autocomplete="on" />
			<q-input v-model="userCred.password" type="password" label="Password:" autocomplete="on" />
			<div class="q-py-sm flex justify-evenly">
				<q-btn :disabled="isDisabled" type="submit">Login</q-btn>
				<q-btn @click="emits('to-register')">Go to Register</q-btn>
				<GoogleLogin :callback="googleCallback" popup-type="TOKEN" auto-login>
					<q-btn :icon="fabGoogle" label="Login with Google" />
				</GoogleLogin>
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { LoginCred } from "@interfaces/auth";
	import { CallbackTypes, GoogleLogin } from "vue3-google-login";
	import { fabGoogle } from "@quasar/extras/fontawesome-v6";

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
