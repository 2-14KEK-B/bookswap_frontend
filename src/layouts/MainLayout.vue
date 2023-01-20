<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="bg-primary text-white">
			<q-toolbar>
				<q-toolbar-title>
					<q-btn rounded flat :to="{ name: 'home' }">BookSwap</q-btn>
				</q-toolbar-title>

				<div v-if="userStore.loggedInUser">
					<q-btn-dropdown
						flat
						rounded
						class="notification"
						:icon="mdiBell"
						no-icon-animation
						dropdown-icon="none"
						menu-anchor="bottom middle"
						menu-self="top middle"
						:menu-offset="[0, 10]"
						content-style="width: 400px"
					>
						<template #label>
							{{ quasar.screen.gt.sm ? $t("title.notificatons") : "" }}
							<q-badge
								v-if="userStore.notificationSum > 0"
								color="red"
								:label="userStore.notificationSum"
								class="absolute-top-left"
								style="border-radius: 10px"
							/>
						</template>

						<NotificationList />
					</q-btn-dropdown>
					<q-btn
						flat
						rounded
						:label="quasar.screen.gt.sm ? $t('title.messages') : ''"
						:to="{ name: 'message' }"
						:icon="mdiMessage"
					>
						<q-badge
							v-if="messageStore.notSeenMessages > 0"
							color="red"
							:label="messageStore.notSeenMessages"
							class="absolute-top-left"
							style="border-radius: 10px"
						/>
					</q-btn>
					<q-btn-dropdown flat rounded dense class="q-ml-sm" auto-close>
						<template #label>
							<ProfileAvatar title :src="userStore.loggedInUser.picture" :alt="getDisplayName(userStore.loggedInUser)" />
						</template>
						<q-list separator>
							<q-item v-if="userStore.loggedInUser.role === 'admin'" clickable :to="{ name: 'admin_user' }">
								<q-icon :name="matAdminPanelSettings" size="md" class="q-mr-sm" />

								<q-item-section>
									<q-item-label>{{ $t("title.adminPage") }}</q-item-label>
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
					<q-btn flat :label="$t('auth.login')" :to="{ name: 'auth' }" />
					<q-btn flat :icon="darkModeButton.icon" @click="darkModeButton.action" />
				</div>
				<q-btn-dropdown dense class="i18n" flat dropdown-icon="none" no-icon-animation auto-close>
					<template #label>
						<q-icon :name="$i18n.locale == 'en' ? 'img:/en.svg' : 'img:/hu.svg'" />
					</template>
					<q-list>
						<q-item
							v-for="(locale, i) in locales"
							:key="i"
							clickable
							:disable="$i18n.locale == locale"
							@click.once="onSetLocale(locale)"
						>
							<q-item-section>
								<q-icon :name="locale == 'en' ? 'img:/en.svg' : 'img:/hu.svg'" />
							</q-item-section>
							<q-item-section>{{ locale }}</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
	import { computed, ComputedRef, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useQuasar } from "quasar";
	import { useI18n } from "vue-i18n";
	import { useUserStore } from "@stores/user";
	import { userAuthStore } from "@stores/auth";
	import { useMessageStore } from "@stores/message";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import { locales, setLocale, availableLocales } from "../modules/i18n";
	import NotificationList from "@components/NotificationList.vue";
	import { getDisplayName } from "@utils/userHelper";
	import { mdiBell, mdiMessage, mdiThemeLightDark } from "@quasar/extras/mdi-v7";
	import { matAdminPanelSettings, matPerson, matLogout, matBook } from "@quasar/extras/material-icons";

	const router = useRouter();
	const quasar = useQuasar();
	const authStore = userAuthStore();
	const userStore = useUserStore();
	const messageStore = useMessageStore();
	const { t } = useI18n({ useScope: "global" });

	interface Button {
		name: string | ComputedRef<string>;
		action: () => void;
		icon?: string;
	}

	const darkModeButton: Button = {
		name: computed(() => `Change to ${quasar.dark.isActive ? "light" : "dark"} mode`),
		action: quasar.dark.toggle,
		icon: mdiThemeLightDark,
	};

	const buttons = ref<Button[]>([
		{
			name: computed(() => t("title.myProfile")),
			action: () => router.push({ name: "myProfile" }),
			icon: matPerson,
		},
		{
			name: "My books",
			action: () => router.push({ name: "myBooks" }),
			icon: matBook,
		},
		darkModeButton,
		{
			name: computed(() => t("auth.logout")),
			action: authStore.logOut,
			icon: matLogout,
		},
	]);

	async function onSetLocale(locale: availableLocales) {
		await setLocale(locale);
	}
</script>

<style>
	button.notification i,
	button.i18n i {
		display: none;
	}
</style>
