<template>
	<q-layout view="hHh lpR fFf" style="height: 100vh">
		<q-header elevated class="bg-primary text-white">
			<q-toolbar>
				<q-toolbar-title>
					<q-btn rounded flat :to="{ name: 'home' }">BookSwap</q-btn>
				</q-toolbar-title>

				<div v-if="userStore.getLoggedUser">
					<q-btn flat rounded :label="quasar.screen.gt.sm ? 'Notifications' : ''" :icon="mdiBell" />
					<q-btn flat rounded :label="quasar.screen.gt.sm ? 'Messages' : ''" :to="{ name: 'message' }" :icon="mdiMessage" />
					<q-btn-dropdown flat rounded dense class="q-ml-sm">
						<template #label>
							<q-avatar>
								<q-img
									:src="
										userStore.getLoggedUser.picture
											? userStore.getLoggedUser.picture
											: 'https://pic.onlinewebfonts.com/svg/img_329115.png'
									"
								></q-img>
							</q-avatar>
						</template>
						<q-list>
							<q-item v-if="userStore.getLoggedUser.role === 'admin'" v-close-popup clickable :to="{ name: 'admin_home' }">
								<q-icon :name="matAdminPanelSettings" size="md" class="q-mr-sm" />

								<q-item-section>
									<q-item-label>Go to admin page</q-item-label>
								</q-item-section>
							</q-item>
							<template v-for="button in buttons" :key="button.name">
								<q-item v-close-popup clickable class="flex-center" @click="button.action">
									<q-icon v-if="button.icon" :name="button.icon" size="sm" class="q-mr-sm" />
									<q-item-section>{{ button.name }}</q-item-section>
								</q-item>
							</template>
						</q-list>
					</q-btn-dropdown>
				</div>
				<q-btn v-else label="Login" :to="{ name: 'auth' }" />
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
	import { useQuasar } from "quasar";
	import { useUserStore } from "@stores/user";
	import { useRouter } from "vue-router";
	import { computed, ComputedRef, ref } from "vue";
	import { mdiBell, mdiMessage, mdiThemeLightDark } from "@quasar/extras/mdi-v7";
	import { matAdminPanelSettings, matPerson, matLogout } from "@quasar/extras/material-icons";

	const router = useRouter();
	const quasar = useQuasar();
	const userStore = useUserStore();

	const buttons = ref<{ name: string | ComputedRef<string>; action: () => void; icon?: string }[]>([
		{
			name: "My profile",
			action: () => router.push({ name: "myProfile" }),
			icon: matPerson,
		},
		{
			name: computed(() => `Change to ${quasar.dark.isActive ? "light" : "dark"} mode`),
			action: quasar.dark.toggle,
			icon: mdiThemeLightDark,
		},
		{
			name: "Logout",
			action: userStore.logOut,
			icon: matLogout,
		},
	]);
</script>
