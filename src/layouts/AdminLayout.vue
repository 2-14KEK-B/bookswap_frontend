<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="bg-accent text-white">
			<q-toolbar>
				<q-btn dense flat round :icon="matMenu" @click="leftDrawerOpen = !leftDrawerOpen" />
				<q-toolbar-title>
					<q-btn flat :to="{ name: 'admin_home' }">BookSwap</q-btn>
				</q-toolbar-title>
				<div v-if="userStore.loggedInUser">
					<q-btn-dropdown flat class="notification" rounded :icon="mdiBell" no-icon-animation dropdown-icon="none">
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
					<q-btn-dropdown dense class="i18n" flat dropdown-icon="none" no-icon-animation auto-close>
						<template #label>
							<q-icon :name="$i18n.locale == 'en' ? 'img:public/en.svg' : 'img:public/hu.svg'" />
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
									<q-icon :name="locale == 'en' ? 'img:public/en.svg' : 'img:public/hu.svg'" />
								</q-item-section>
								<q-item-section>{{ locale }}</q-item-section>
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
	</q-layout>
</template>

<script setup lang="ts">
	import { computed, ComputedRef, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useI18n } from "vue-i18n";
	import { useQuasar } from "quasar";
	import { useUserStore } from "@stores/user";
	import { userAuthStore } from "@stores/auth";
	import { useMessageStore } from "@stores/message";
	import { availableLocales, setLocale, locales } from "../modules/i18n";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import NotificationList from "@components/NotificationList.vue";
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
	const { t } = useI18n({ useScope: "global" });
	const router = useRouter();
	const userStore = useUserStore();
	const authStore = userAuthStore();
	const messageStore = useMessageStore();
	const quasar = useQuasar();
	const leftDrawerOpen = ref(false);

	const menuItems: {
		icon: string;
		text: string;
		name: string;
		routeName: string;
		disabled: boolean;
		separator: boolean;
	}[] = [
		{
			icon: mdiHomeCircleOutline,
			text: tLocale("homePage"),
			name: "Home Page",
			routeName: "home",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiAccountOutline,
			text: tLocale("users"),
			name: "User",
			routeName: "admin_user",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiBookOpenPageVariantOutline,
			text: tLocale("books"),
			name: "Book",
			routeName: "admin_book",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiShareAllOutline,
			text: tLocale("borrows"),
			name: "Borrow",
			routeName: "admin_borrow",
			disabled: false,
			separator: false,
		},
		{
			icon: mdiMessageOutline,
			text: tLocale("message"),
			name: "Message",
			routeName: "admin_message",
			disabled: false,
			separator: false,
		},
	];

	const buttons = ref<{ name: string | ComputedRef<string>; action: () => void; icon?: string }[]>([
		{
			name: t("title.myProfile"),
			action: () => router.push({ name: "myProfile" }),
			icon: matPerson,
		},
		{
			name: computed(() =>
				t("title.darkModeButton", { mode: quasar.dark.isActive ? t("title.darkMode") : t("title.lightMode") }),
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
	}
</script>

<style>
	button.notification i,
	button.i18n i {
		display: none;
	}
</style>
