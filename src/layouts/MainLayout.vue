<template>
	<q-layout view="hHh lpR fFf">
		<q-header elevated class="bg-primary text-white">
			<q-toolbar>
				<q-toolbar-title>
					<q-btn flat @click="quasar.dark.toggle">
						<q-icon name="mdi-theme-light-dark" />
					</q-btn>
					<q-btn flat :to="{ name: 'home' }">
						<q-avatar class="q-mr-lg">
							<img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
						</q-avatar>
						BookSwap
					</q-btn>
				</q-toolbar-title>
				<q-space />
				<q-btn-dropdown
					v-if="loggedInUser"
					flat
					:label="`${loggedInUser.email} ${loggedInUser.role == 'admin' ? '*' : ''}`"
				>
					<q-list>
						<q-item v-if="loggedInUser.role === 'admin'" v-close-popup clickable :to="{ name: 'admin_home' }">
							<q-item-section>
								<q-item-label>Go to admin page</q-item-label>
							</q-item-section>
						</q-item>

						<q-item v-close-popup clickable>
							<q-item-section>
								<q-item-label>Modify profile</q-item-label>
							</q-item-section>
						</q-item>

						<q-item v-close-popup clickable @click="logOut">
							<q-item-section>
								<q-item-label>Logout</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
				<q-btn v-else label="Login" :to="{ name: 'auth' }" />
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view></router-view>
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useQuasar } from "quasar";
	import { useUserStore } from "@stores/user";

	const quasar = useQuasar();
	const { getLoggedUser, logOut } = useUserStore();
	const loggedInUser = ref(getLoggedUser);
</script>
