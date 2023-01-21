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
		@click.prevent="userStore.setNotificationSeen(notification._id)"
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
	import { useI18n } from "vue-i18n";
	import dayjs, { extend } from "dayjs";
	import { useUserStore } from "@stores/user";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import relativeTime from "dayjs/plugin/relativeTime";
	import { getDisplayName } from "@utils/userHelper";
	import { matDelete } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { Notification } from "@interfaces/notification";

	extend(relativeTime);
	const userStore = useUserStore();
	const { t } = useI18n({ useScope: "global" });

	function createReadableNotification(notification: Notification) {
		let finalString = `${getDisplayName(notification.from as Partial<User>)}`;
		switch (notification.doc_type) {
			case "borrow":
				switch (notification.noti_type) {
					case "create":
						finalString += ` ${t("notification.borrowRequest", { type: t("notification.created") })}`;
						break;
					case "delete":
						finalString += ` ${t("notification.borrowRequest", { type: t("notification.deleted") })}`;
						break;
					case "update":
						finalString += ` ${t("notification.borrowRequest", { type: t("notification.updated") })}`;
						break;
					case "verify":
						finalString += ` ${t("notification.borrowRequest", { type: t("notification.verified") })}`;
						break;
				}
				break;
			case "lend":
				switch (notification.noti_type) {
					case "create":
						finalString += ` ${t("notification.lendRequest", { type: t("notification.created") })}`;
						break;
					case "delete":
						finalString += ` ${t("notification.lendRequest", { type: t("notification.deleted") })}`;
						break;
					case "update":
						finalString += ` ${t("notification.lendRequest", { type: t("notification.updated") })}`;
						break;
					case "verify":
						finalString += ` ${t("notification.lendRequest", { type: t("notification.verified") })}`;
						break;
				}
				break;
			case "user_rate":
				switch (notification.noti_type) {
					case "create":
						finalString += ` ${t("notification.userRate", { type: t("notification.created") })}`;
						break;
					case "delete":
						finalString += ` ${t("notification.userRate", { type: t("notification.deleted") })}`;
						break;
					case "update":
						finalString += ` ${t("notification.userRate", { type: t("notification.updated") })}`;
						break;
				}
				break;
			default:
				break;
		}
		return finalString;
	}
</script>

<style scoped></style>
