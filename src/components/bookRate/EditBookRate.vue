<template>
	<q-dialog v-if="bookStore.openedBook && bookRate" v-model="appStore.editBookRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						Rate
						<span class="text-italic">{{ bookStore.openedBook?.title }}</span>
					</div>
				</q-toolbar-title>
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-rating v-model="rate" label="Rate" />
				<q-input v-model="comment" label="Comment" />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn v-close-popup flat label="OK" @click="sendRate" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref, readonly } from "vue";
	import { useAppStore } from "@stores/app";
	import { useBookStore } from "@stores/book";
	import { useBookRateStore } from "@stores/bookRate";
	import { matClose } from "@quasar/extras/material-icons";
	import type { BookRate, ModifyBookRate } from "@interfaces/bookRate";

	const props = defineProps<{ bookRate?: BookRate }>();
	const appStore = useAppStore();
	const bookStore = useBookStore();
	const bookRateStore = useBookRateStore();

	const comment = ref(props.bookRate?.comment);
	const rate = ref(props.bookRate?.rate || 5);
	const defaults = readonly<BookRate | Record<string, never>>(props.bookRate || {});

	async function sendRate() {
		const data: ModifyBookRate = {};
		if (rate.value != defaults.rate) {
			data["rate"] = rate.value;
		}
		if (comment.value && comment.value != defaults.comment) {
			if (comment.value?.length > 0) {
				data["comment"] = comment.value;
			}
		}
		if (data.comment || data.rate) {
			await bookRateStore.editBookRate(bookStore.openedBook?._id as string, defaults._id, data);
			close();
		}
	}

	function close() {
		appStore.editBookRate = false;
	}
</script>

<style scoped></style>
