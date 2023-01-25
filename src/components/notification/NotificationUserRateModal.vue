<template>
	<q-dialog v-model="appStore.isOpenedUserRateNotification">
		<q-card v-if="userStore.openedNotification != null">
			<q-card-section class="row items-center q-pb-none">
				<div class="q-pr-lg">{{ createReadableNotification(userStore.openedNotification) }}</div>
				<q-space />
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-card-section>
			<q-card-section>
				<q-card v-if="isDeleted">
					<q-card-section>
						{{
							$t("notification.notFoundOrDeleted", {
								type: $t("rate.rate"),
								user: getDisplayName(userStore.openedNotification.from as User),
							})
						}}
					</q-card-section>
				</q-card>
				<q-card v-else>
					<UserRateItem v-if="userRateStore.openedRate" :user-rate="userRateStore.openedRate" />
				</q-card>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useUserRateStore } from "@stores/userRate";
	import UserRateItem from "@components/userRate/UserRateItem.vue";
	import { createReadableNotification } from "@utils/notificationHelper";
	import { getDisplayName } from "@utils/userHelper";
	import { matClose } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";

	const appStore = useAppStore();
	const userStore = useUserStore();
	const userRateStore = useUserRateStore();

	const isDeleted = ref(false);

	onMounted(() => {
		if (!userRateStore.openedRate) {
			isDeleted.value = true;
		}
	});

	onUnmounted(() => {
		delete userRateStore.openedRate;
		userStore.openedNotification = null;
	});
</script>

<style scoped></style>
