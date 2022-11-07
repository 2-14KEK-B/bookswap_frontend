<template>
	<q-layout view="hHh lpR fFf">
		<q-header elevated class="bg-accent text-white">
			<q-toolbar>
				<q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
				<q-btn flat @click="quasar.dark.toggle">
					<q-icon name="mdi-theme-light-dark" />
				</q-btn>
				<q-toolbar-title>
					<q-btn flat :to="{ name: 'admin_home' }">
						<!-- <q-avatar class="q-mr-lg">
							<img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
						</q-avatar> -->
						BookSwap
					</q-btn>
				</q-toolbar-title>
				<q-space />
				<q-btn-dropdown
					v-if="getLoggedUser"
					split
					:label="`${getLoggedUser.email} ${getLoggedUser.role == 'admin' ? '*' : ''}`"
					flat
					:to="{ name: 'myProfile' }"
				>
					<q-list>
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

		<q-drawer
			v-model="leftDrawerOpen"
			:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'"
			side="left"
			:width="200"
			show-if-above
			bordered
		>
			<q-scroll-area class="fit">
				<q-list>
					<template v-for="(menuItem, index) in menuItems" :key="index">
						<q-item clickable :disable="menuItem.disabled" :to="{ name: menuItem.routeName }">
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
	import { ref } from "vue";
	import { useQuasar } from "quasar";
	import { useUserStore } from "@stores/user";
	import MenuDrawer from "@interfaces/drawer";

	const quasar = useQuasar();
	const { getLoggedUser, logOut } = useUserStore();
	const leftDrawerOpen = ref(false);

	const menuItems: MenuDrawer[] = [
		{
			icon: "mdi-home-circle-outline",
			text: "Home Page",
			name: "Home Page",
			routeName: "home",
			disabled: false,
			separator: false,
		},
		{
			icon: "mdi-account-circle-outline",
			text: "User",
			name: "User",
			routeName: "admin_user",
			disabled: false,
			separator: false,
		},
		{
			icon: "mdi-book-open-page-variant-outline",
			text: "Book",
			name: "Book",
			routeName: "admin_book",
			disabled: false,
			separator: false,
		},
		{
			icon: "mdi-share-all-outline",
			text: "Borrow",
			name: "Borrow",
			routeName: "admin_borrow",
			disabled: false,
			separator: false,
		},
		{
			icon: "mdi-message-outline",
			text: "Message",
			name: "Message",
			routeName: "admin_message",
			disabled: false,
			separator: false,
		},
	];
</script>
