<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="bg-primary text-white" data-cy="header">
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
							<ProfileAvatar
								title
								:src="userStore.loggedInUser.picture"
								data-cy="profilePicture"
								:alt="getDisplayName(userStore.loggedInUser)"
							/>
						</template>
						<q-list separator data-cy="profileMenu">
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
					<q-btn flat :label="$t('auth.login')" data-cy="openLoginButton" @click="appStore.login = true" />
					<q-btn flat :icon="darkModeButton.icon" data-cy="darkModeButton" @click="darkModeButton.action" />
				</div>
				<q-btn-dropdown dense class="i18n" flat dropdown-icon="none" data-cy="langSelect" no-icon-animation auto-close>
					<template #label>
						<q-icon :name="locale == 'en' ? `img:${EN}` : `img:${HU}`" />
					</template>
					<q-list data-cy="langList">
						<q-item
							v-for="(availableLocale, i) in locales"
							:key="i"
							clickable
							:disable="locale == availableLocale"
							@click.once="onSetLocale(availableLocale)"
						>
							<q-item-section>
								<q-icon :name="availableLocale == 'en' ? `img:${EN}` : `img:${HU}`" />
							</q-item-section>
							<q-item-section>{{ availableLocale }}</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>

		<LoginModal v-if="appStore.login" />
		<RegisterModal v-if="appStore.register" />
		<NotificationBorrowModal v-if="appStore.isOpenedBorrowNotification" />
		<NotificationUserRateModal v-if="appStore.isOpenedUserRateNotification" />
	</q-layout>
</template>

<script setup lang="ts">
	import { computed, ComputedRef, onMounted, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useQuasar } from "quasar";
	import { useI18n } from "vue-i18n";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useAuthStore } from "@stores/auth";
	import { useMessageStore } from "@stores/message";
	import { locales, setLocale, availableLocales } from "../modules/i18n";
	import LoginModal from "@components/auth/LoginModal.vue";
	import RegisterModal from "@components/auth/RegisterModal.vue";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import NotificationList from "@components/notification/NotificationList.vue";
	import NotificationBorrowModal from "@components/notification/NotificationBorrowModal.vue";
	import NotificationUserRateModal from "@components/notification/NotificationUserRateModal.vue";
	import { getDisplayName } from "@utils/userHelper";
	import { mdiBell, mdiMessage, mdiThemeLightDark } from "@quasar/extras/mdi-v7";
	import { matAdminPanelSettings, matPerson, matLogout, matBook, matLibraryBooks } from "@quasar/extras/material-icons";

	import EN from "/en.svg";
	import HU from "/hu.svg";

	const router = useRouter();
	const quasar = useQuasar();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const authStore = useAuthStore();
	const messageStore = useMessageStore();
	const { t, locale } = useI18n({ useScope: "global" });

	interface Button {
		name: string | ComputedRef<string>;
		action: () => void;
		icon?: string;
	}

	const darkModeButton: Button = {
		name: computed(() =>
			t("title.darkModeButton", { mode: quasar.dark.isActive ? t("title.lightMode") : t("title.darkMode") }),
		),
		action: quasar.dark.toggle,
		icon: mdiThemeLightDark,
	};

	const buttons = ref<Button[]>([
		{
			name: computed(() => t("me.profile")),
			action: () => router.push({ name: "myProfile" }),
			icon: matPerson,
		},
		{
			name: computed(() => t("me.books")),
			action: () => router.push({ name: "myBooks" }),
			icon: matBook,
		},
		{
			name: computed(() => t("me.swaps")),
			action: () => router.push({ name: "myBorrows" }),
			icon: matLibraryBooks,
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
		const locales = {
			hu: () => import("quasar/lang/hu"),
			en: () => import("quasar/lang/en-GB"),
		};
		await locales[locale]().then((lang) => quasar.lang.set(lang.default));
	}

	onMounted(async () => {
		const locales = {
			hu: () => import("quasar/lang/hu"),
			en: () => import("quasar/lang/en-GB"),
		};
		await locales[locale.value as availableLocales]().then((lang) => quasar.lang.set(lang.default));
	});
</script>

<style>
	button.notification i,
	button.i18n i {
		display: none;
	}
</style>
