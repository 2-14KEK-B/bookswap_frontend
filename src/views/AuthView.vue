<template>
	<q-page padding>
		<div style="height: 70vh" class="flex justify-center items-center">
			<!-- @login-with-google="loginWithGoogle" -->
			<Login v-if="islogin" class="q-pa-lg modal" @login="login" @to-register="islogin = false" />
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
	import Register from "@components/RegisterModal.vue";
	import Login from "@components/LoginModal.vue";
	import { useUserStore } from "@stores/user";

	const {
		login,
		register,
		// loginWithGoogle
	} = useUserStore();
	const islogin = ref(true);
</script>

<style scoped lang="scss">
	.modal {
		border: 1px solid;
		border-radius: 20px;
	}
</style>
