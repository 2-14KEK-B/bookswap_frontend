<template>
	<q-page>
		<q-tabs v-model="tab">
			<q-tab name="borrow" :label="$t('me.borrows')"></q-tab>
			<q-tab name="lend" :label="$t('me.lends')"></q-tab>
		</q-tabs>
		<q-tab-panels v-model="tab">
			<q-tab-panel name="borrow" class="no-padding" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
				<q-scroll-area style="height: calc(100vh - 100px)">
					<q-card v-for="borrow in (borrowStore.borrows as Borrow[])" :key="borrow._id" flat class="q-ma-sm" bordered>
						<BorrowItem :borrow="borrow" type="borrow" />
					</q-card>
				</q-scroll-area>
			</q-tab-panel>
			<q-tab-panel name="lend" class="no-padding" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
				<q-scroll-area style="height: calc(100vh - 100px)">
					<q-card v-for="borrow in (borrowStore.lends as Borrow[])" :key="borrow._id" flat class="q-ma-sm" bordered>
						<BorrowItem :borrow="borrow" type="lend" />
					</q-card>
				</q-scroll-area>
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useBorrowStore } from "@stores/borrow";
	import BorrowItem from "@components/borrow/BorrowItem.vue";
	import type { Borrow } from "@interfaces/borrow";

	const borrowStore = useBorrowStore();

	const tab = ref<"borrow" | "lend">("borrow");
</script>

<style scoped></style>
