<template>
	<q-dialog v-model="appStore.isOpenedBorrowNotification">
		<q-card v-if="userStore.openedNotification != null && borrowStore.openedBorrow">
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
								type: $t("borrow.borrow"),
								user: getDisplayName(userStore.openedNotification.from as User),
							})
						}}
					</q-card-section>
				</q-card>
				<q-card v-else>
					<BorrowItem
						:borrow="borrowStore.openedBorrow"
						:type="userStore.openedNotification.doc_type == 'borrow' ? 'borrow' : 'lend'"
					/>
				</q-card>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useBorrowStore } from "@stores/borrow";
	import { useUserStore } from "@stores/user";
	import BorrowItem from "@components/borrow/BorrowItem.vue";
	import { createReadableNotification } from "@utils/notificationHelper";
	import { getDisplayName } from "@utils/userHelper";
	import { matClose } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";

	const appStore = useAppStore();
	const userStore = useUserStore();
	const borrowStore = useBorrowStore();

	const isDeleted = ref(false);

	onMounted(() => {
		if (!borrowStore.openedBorrow) {
			isDeleted.value = true;
		}
	});

	onUnmounted(() => {
		delete borrowStore.openedBorrow;
		userStore.openedNotification = null;
	});
</script>

<style scoped></style>
