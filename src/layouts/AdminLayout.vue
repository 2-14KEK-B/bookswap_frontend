<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="bg-accent text-white">
			<q-toolbar>
				<q-btn dense flat round :icon="matMenu" @click="leftDrawerOpen = !leftDrawerOpen" />
				<q-toolbar-title>
					<q-btn flat :to="{ name: 'admin_home' }">BookSwap</q-btn>
				</q-toolbar-title>
				<div v-if="userStore.loggedInUser">
					<q-btn flat rounded :label="quasar.screen.gt.sm ? $t('notificatons') : ''" :icon="mdiBell" />
					<q-btn
						flat
						rounded
						:label="quasar.screen.gt.sm ? $t('message') : ''"
						:to="{ name: 'message' }"
						:icon="mdiMessage"
					/>
					<q-btn-dropdown flat rounded dense auto-close class="q-ml-sm">
						<template #label>
							<ProfileAvatar
								:src="userStore.loggedInUser.picture"
								:alt="userStore.loggedInUser.fullname || userStore.loggedInUser.username || userStore.loggedInUser.email"
							/>
						</template>
						<q-list separator>
							<template v-for="button in buttons" :key="button.name">
								<q-item v-close-popup clickable class="flex-center" @click="button.action">
									<q-icon v-if="button.icon" :name="button.icon" size="sm" class="q-mr-sm" />
									<q-item-section>{{ button.name }}</q-item-section>
								</q-item>
							</template>
						</q-list>
					</q-btn-dropdown>
				</div>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-2'"
			side="left"
			:width="200"
			show-if-above
			bordered
		>
			<q-scroll-area class="fit">
				<q-list>
					<template v-for="(menuItem, index) in menuItems" :key="index">
						<q-item
							clickable
							:disable="menuItem.disabled"
							:to="{ name: menuItem.routeName }"
							:active-class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-4'"
						>
							<q-item-section avatar>
								<q-icon :name="menuItem.icon" />
							</q-item-section>
							<q-item-section>
								{{ menuItem.text }}
							</q-item-section>
						</q-item>
						<q-separator v-if="menuItem.separator" :key="'sep' + index" />
					</template>
				</q-list>
			</q-scroll-area>
		</q-drawer>

		<q-page-container>
			<router-view></router-view>
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
	import { computed, ComputedRef, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useQuasar } from "quasar";
	import { useUserStore } from "@stores/user";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import {
		mdiThemeLightDark,
		mdiHomeCircleOutline,
		mdiAccountOutline,
		mdiBookOpenPageVariantOutline,
		mdiShareAllOutline,
		mdiMessageOutline,
		mdiBell,
		mdiMessage,
	} from "@quasar/extras/mdi-v7";
	import { matMenu } from "@quasar/extras/material-icons";
	import { matPerson, matLogout } from "@quasar/extras/material-icons";
	import { userAuthStore } from "@stores/auth";
	import type MenuDrawer from "@interfaces/drawer";
	import { useI18n } from "vue-i18n";

	const { t } = useI18n({ useScope: "global" });
	const router = useRouter();
	const userStore = useUserStore();
	const authStore = userAuthStore();
	const quasar = useQuasar();
	const leftDrawerOpen = ref(false);

	const menuItems: MenuDrawer[] = [
		{
			icon: mdiHomeCircleOutline,
			text: t("homePage"),
			name: "Home Page",
			routeName: "home",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiAccountOutline,
			text: t("users"),
			name: "User",
			routeName: "admin_user",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiBookOpenPageVariantOutline,
			text: t("books"),
			name: "Book",
			routeName: "admin_book",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiShareAllOutline,
			text: t("borrows"),
			name: "Borrow",
			routeName: "admin_borrow",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiMessageOutline,
			text: t("message"),
			name: "Message",
			routeName: "admin_message",
			disabled: false,
			separator: false,
		},
	];

	const buttons = ref<{ name: string | ComputedRef<string>; action: () => void; icon?: string }[]>([
		{
			name: t("myProfile"),
			action: () => router.push({ name: "myProfile" }),
			icon: matPerson,
		},
		{
			name: computed(() => `Change to ${quasar.dark.isActive ? "light" : "dark"} mode`),
			action: quasar.dark.toggle,
			icon: mdiThemeLightDark,
		},
		{
			name: t("logout"),
			action: authStore.logOut,
			icon: matLogout,
		},
	]);
</script>
