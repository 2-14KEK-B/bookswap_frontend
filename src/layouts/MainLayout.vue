<template>
	<q-layout view="hHh lpR fFf">
		<q-header elevated class="bg-primary text-white">
			<q-toolbar>
				<q-btn v-if="userStore.getLoggedUser" flat round dense icon="menu">
					<q-menu transition-show="jump-down" transition-hide="jump-up">
						<q-list style="min-width: 100px">
							<q-item clickable :to="{ name: 'newBook' }">
								<q-item-section>Upload a new book</q-item-section>
							</q-item>
							<q-separator />
							<q-item clickable disable>
								<q-item-section>Forum</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>
				<q-toolbar-title>
					<q-btn flat :to="{ name: 'home' }">
						<!-- <q-avatar class="q-mr-lg">
							<img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
						</q-avatar> -->
						BookSwap
					</q-btn>
				</q-toolbar-title>
				<q-space />

				<q-btn-dropdown v-if="userStore.getLoggedUser" split flat :to="{ name: 'myProfile' }">
					<template #label>
						<div class="flex row items-center">
							<q-avatar>
								<q-img
									:src="
										userStore.getLoggedUser.picture
											? userStore.getLoggedUser.picture
											: 'https://pic.onlinewebfonts.com/svg/img_329115.png'
									"
								></q-img>
							</q-avatar>
							<div class="q-ml-md">
								<div v-if="userStore.getLoggedUser.username">
									{{ `${userStore.getLoggedUser.username} ${userStore.getLoggedUser.role == "admin" ? "*" : ""}` }}
								</div>
								<div v-else>
									{{ `${userStore.getLoggedUser.email} ${userStore.getLoggedUser.role == "admin" ? "*" : ""}` }}
								</div>
							</div>
						</div>
					</template>
					<q-list>
						<q-item v-if="userStore.getLoggedUser.role === 'admin'" v-close-popup clickable :to="{ name: 'admin_home' }">
							<q-item-section>
								<q-item-label>Go to admin page</q-item-label>
							</q-item-section>
						</q-item>

						<q-item v-close-popup clickable :to="{ name: 'editProfile' }">
							<q-item-section>
								<q-item-label>Modify profile</q-item-label>
							</q-item-section>
						</q-item>

						<q-item v-close-popup clickable @click="userStore.logOut">
							<q-item-section>
								<q-item-label>Logout</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
				<q-btn v-else label="Login" :to="{ name: 'auth' }" />
				<q-btn flat @click="quasar.dark.toggle">
					<q-icon name="mdi-theme-light-dark" />
				</q-btn>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view></router-view>
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
	import { useQuasar } from "quasar";
	import { useUserStore } from "@stores/user";

	const quasar = useQuasar();
	const userStore = useUserStore();
</script>
