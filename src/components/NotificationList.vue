<template>
	<q-list v-if="userStore.loggedInUser" bordered :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
		<q-item
			v-for="notification in userStore.loggedInUser.notifications"
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
				<q-avatar color="primary" text-color="white">
					<q-img v-if="(notification.from as User).picture" :src="(notification.from as User).picture" />
					{{
						getDisplayName(notification.from as User)
							.charAt(0)
							.toUpperCase()
					}}
				</q-avatar>
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
	</q-list>
</template>

<script setup lang="ts">
	import { useI18n } from "vue-i18n";
	import dayjs, { extend } from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import { useUserStore } from "@stores/user";
	import { getDisplayName } from "@utils/userHelper";
	import { matDelete } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { Notification } from "@interfaces/notification";

	extend(relativeTime);
	const userStore = useUserStore();
	const { t } = useI18n({ useScope: "global" });

	function createReadableNotification(notification: Notification) {
		let adj = "";
		const type = notification.doc_type;
		switch (notification.noti_type) {
			case "create":
				adj = "created";
				break;
			case "delete":
				adj = "deleted";
				break;
			case "update":
				adj = "updated";
				break;
			case "verify":
				adj = "verified";
				break;
		}
		return t("notification.final", {
			user: getDisplayName(notification.from as Partial<User>),
			adj: t(`notification.${adj}`),
			type: t(`notification.${type}`),
		});
		// return `${getDisplayName(notification.from as Partial<User>)} ${adj} a ${
		// 	notification.doc_type == "user_rate" ? "user rate" : notification.doc_type
		// }`;
	}
</script>

<style scoped></style>
