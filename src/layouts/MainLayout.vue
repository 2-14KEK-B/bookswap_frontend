<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="bg-primary text-white">
			<q-toolbar>
				<q-toolbar-title>
					<q-btn rounded flat :to="{ name: 'home' }">BookSwap</q-btn>
				</q-toolbar-title>

				<div v-if="userStore.loggedInUser">
					<q-btn flat rounded :label="quasar.screen.gt.sm ? 'Notifications' : ''" :icon="mdiBell">
						<!-- <q-badge color="red" label="2" class="absolute-top-left" style="border-radius: 10px" /> -->
					</q-btn>
					<q-btn flat rounded :label="quasar.screen.gt.sm ? 'Messages' : ''" :to="{ name: 'message' }" :icon="mdiMessage">
						<!-- <q-badge color="red" label="2" class="absolute-top-left" style="border-radius: 10px" /> -->
					</q-btn>
					<q-btn-dropdown flat rounded dense class="q-ml-sm" auto-close>
						<template #label>
							<ProfileAvatar
								:src="userStore.loggedInUser.picture"
								:alt="userStore.loggedInUser.fullname || userStore.loggedInUser.username || userStore.loggedInUser.email"
							/>
						</template>
						<q-list separator>
							<q-item v-if="userStore.loggedInUser.role === 'admin'" clickable :to="{ name: 'admin_home' }">
								<q-icon :name="matAdminPanelSettings" size="md" class="q-mr-sm" />

								<q-item-section>
									<q-item-label>Go to admin page</q-item-label>
								</q-item-section>
							</q-item>
							<template v-for="button in buttons" :key="button.name">
								<q-item clickable class="flex-center" @click="button.action">
									<q-icon v-if="button.icon" :name="button.icon" size="sm" class="q-mr-sm" />
									<q-item-section>{{ button.name }}</q-item-section>
								</q-item>
							</template>
						</q-list>
					</q-btn-dropdown>
				</div>
				<div v-else>
					<q-btn flat label="Login" :to="{ name: 'auth' }" />
					<q-btn
						flat
						:icon="buttons[1].icon"
						:label="quasar.screen.gt.sm ? buttons[1].name : ''"
						@click="buttons[1].action"
					/>
				</div>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
	import { useQuasar } from "quasar";
	import { userAuthStore } from "@stores/auth";
	import { useUserStore } from "@stores/user";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import { useRouter } from "vue-router";
	import { computed, ComputedRef, ref } from "vue";
	import { mdiBell, mdiMessage, mdiThemeLightDark } from "@quasar/extras/mdi-v7";
	import { matAdminPanelSettings, matPerson, matLogout } from "@quasar/extras/material-icons";

	const router = useRouter();
	const quasar = useQuasar();
	const authStore = userAuthStore();
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
			action: authStore.logOut,
			icon: matLogout,
		},
	]);
</script>
