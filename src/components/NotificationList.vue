<template>
	<q-list v-if="userStore.loggedInUser" bordered :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
		<q-scroll-area v-if="userStore.loggedInUser.notifications.length > 6" style="height: 300px">
			<NotificationItems />
		</q-scroll-area>
		<div v-else>
			<NotificationItems />
		</div>
		<div v-if="userStore.loggedInUser.notifications.length == 0">
			<q-item v-close-popup>
				<q-item-section>
					<q-item-label>{{ $t("notification.none") }}</q-item-label>
				</q-item-section>
			</q-item>
		</div>
	</q-list>
</template>

<script setup lang="ts">
	import { useUserStore } from "@stores/user";
	import NotificationItems from "@components/NotificationItems.vue";

	const userStore = useUserStore();
</script>

<style scoped></style>
