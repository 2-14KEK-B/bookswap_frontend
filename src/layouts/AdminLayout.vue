<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="bg-accent text-white">
			<q-toolbar>
				<q-btn dense flat round :icon="matMenu" @click="leftDrawerOpen = !leftDrawerOpen" />
				<q-toolbar-title>
					<q-btn flat :to="{ name: 'admin_home' }">BookSwap</q-btn>
				</q-toolbar-title>
				<div v-if="userStore.loggedInUser">
					<q-btn-dropdown flat class="notShow" rounded :icon="mdiBell" no-icon-animation dropdown-icon="none">
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
					<q-btn-dropdown flat rounded dense auto-close class="q-ml-sm">
						<template #label>
							<ProfileAvatar title :src="userStore.loggedInUser.picture" :alt="getDisplayName(userStore.loggedInUser)" />
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
					<q-btn-dropdown dense class="notShow" flat dropdown-icon="none" no-icon-animation auto-close>
						<template #label>
							<q-icon :name="locale == 'en' ? `img:${EN}` : `img:${HU}`" />
						</template>
						<q-list>
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

		<NotificationBorrowModal v-if="appStore.isOpenedBorrowNotification" />
		<NotificationUserRateModal v-if="appStore.isOpenedUserRateNotification" />
	</q-layout>
</template>

<script setup lang="ts">
	import { computed, type ComputedRef, onMounted, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useI18n } from "vue-i18n";
	import { useQuasar } from "quasar";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useAuthStore } from "@stores/auth";
	import { useMessageStore } from "@stores/message";
	import { type availableLocales, setLocale, locales } from "../modules/i18n";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import NotificationList from "@components/notification/NotificationList.vue";
	import NotificationBorrowModal from "@components/notification/NotificationBorrowModal.vue";
	import NotificationUserRateModal from "@components/notification/NotificationUserRateModal.vue";
	import { getDisplayName } from "@utils/userHelper";
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
	import { matMenu, matPerson, matLogout, matBook, matLibraryBooks } from "@quasar/extras/material-icons";

	import EN from "/en.svg";
	import HU from "/hu.svg";

	const { t: tLocale } = useI18n({
		messages: {
			en: {
				homePage: "Home page",
				borrows: "Borrows",
				users: "Users",
				books: "Books",
				messages: "Messages",
			},
			hu: {
				homePage: "Kezdőlap",
				borrows: "Kölcsönzések",
				users: "Felhasználók",
				books: "Könyvek",
				messages: "Üzenetek",
			},
		},
	});
	const { t, locale } = useI18n({ useScope: "global" });
	const router = useRouter();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const authStore = useAuthStore();
	const messageStore = useMessageStore();
	const quasar = useQuasar();
	const leftDrawerOpen = ref(false);

	const menuItems = ref<
		{
			icon: string;
			text: string | ComputedRef<string>;
			routeName: string;
			disabled: boolean;
			separator: boolean;
		}[]
	>([
		{
			icon: mdiHomeCircleOutline,
			text: computed(() => tLocale("homePage")),
			routeName: "home",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiAccountOutline,
			text: computed(() => tLocale("users")),
			routeName: "admin_user",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiBookOpenPageVariantOutline,
			text: computed(() => tLocale("books")),
			routeName: "admin_book",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiShareAllOutline,
			text: computed(() => tLocale("borrows")),
			routeName: "admin_borrow",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiMessageOutline,
			text: computed(() => tLocale("messages")),
			routeName: "admin_message",
			disabled: false,
			separator: false,
		},
	]);

	const buttons = ref<{ name: string | ComputedRef<string>; action: () => void; icon?: string }[]>([
		{
			name: t("me.profile"),
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
		{
			name: computed(() =>
				t("title.darkModeButton", { mode: quasar.dark.isActive ? t("title.lightMode") : t("title.darkMode") }),
			),
			action: quasar.dark.toggle,
			icon: mdiThemeLightDark,
		},
		{
			name: t("auth.logout"),
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

<style></style>
