<template>
	<q-item
		v-for="notification in userStore.sortedNotifications"
		:key="notification._id"
		v-close-popup
		:class="
			notification.seen
				? $q.dark.isActive
					? 'bg-grey-8'
					: 'bg-grey-3'
				: $q.dark.isActive
				? 'bg-blue-grey-8'
				: 'bg-blue-grey-3'
		"
		clickable
		class="q-pr-none"
		@click.prevent="openDocument(notification)"
	>
		<q-item-section avatar>
			<ProfileAvatar :src="(notification.from as User).picture" :alt="getDisplayName(notification.from as User)" />
		</q-item-section>
		<q-item-section>
			<q-item-label>{{ createReadableNotification(notification) }}</q-item-label>
			<q-item-label caption>{{ dayjs().to(notification.createdAt) }}</q-item-label>
		</q-item-section>
		<q-item-section side>
			<q-btn flat @click.prevent="userStore.deleteNotification(notification._id)">
				<q-icon :name="matDelete" />
			</q-btn>
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
	import dayjs, { extend } from "dayjs";
	import { useUserStore } from "@stores/user";
	import { useBorrowStore } from "@stores/borrow";
	import { useUserRateStore } from "@stores/userRate";
	import { useAppStore } from "@stores/app";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import relativeTime from "dayjs/plugin/relativeTime";
	import { getDisplayName } from "@utils/userHelper";
	import { createReadableNotification } from "@utils/notificationHelper";
	import { matDelete } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { Notification } from "@interfaces/notification";

	extend(relativeTime);

	const appStore = useAppStore();
	const userStore = useUserStore();

	async function openDocument(notification: Notification) {
		if (notification.seen != true) {
			await userStore.setNotificationSeen(notification._id);
		}
		if (notification.noti_type != "delete") {
			if (notification.doc_type == "user_rate") {
				const userRateStore = useUserRateStore();
				userRateStore.openedRate = userRateStore.loggedInRates.to.find((r) => r._id == notification.doc_id);
				userStore.openedNotification = notification;
				appStore.isOpenedUserRateNotification = true;
			} else {
				const borrowStore = useBorrowStore();
				borrowStore.openedBorrow = borrowStore.loggedInBorrows.find((b) => b._id == notification.doc_id);
				userStore.openedNotification = notification;
				appStore.isOpenedBorrowNotification = true;
			}
		}
	}
</script>

<style scoped></style>
