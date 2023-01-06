<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
		<div class="flex justify-center items-center" style="height: calc(100vh - 50px)">
			<!-- @login-with-google="loginWithGoogle" -->
			<Login
				v-if="islogin"
				class="q-pa-lg modal"
				@login="login"
				@to-register="islogin = false"
				@login-with-google="loginWithGoogle"
			/>
			<Register
				v-else
				class="q-pa-lg modal"
				@register="(userCred) => register(userCred).then(() => (islogin = true))"
				@to-login="islogin = true"
			/>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import Register from "@components/auth/RegisterModal.vue";
	import Login from "@components/auth/LoginModal.vue";
	import { userAuthStore } from "@stores/auth";

	const { login, register, loginWithGoogle } = userAuthStore();
	const islogin = ref(true);
</script>

<style scoped lang="scss"></style>
