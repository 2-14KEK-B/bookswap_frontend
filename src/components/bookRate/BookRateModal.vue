<template>
	<q-dialog v-if="bookStore.openedBook" v-model="appStore.editOrCreateBookRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						<span v-if="edit" class="text-italic">{{ $t("rate.title", { title: bookStore.openedBook?.title }) }}</span>
						<span v-else class="text-italic">{{ $t("rate.title", { title: book?.title }) }}</span>
					</div>
				</q-toolbar-title>
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-rating v-model="rate" :label="$t('rate.rate')" />
				<q-input v-model="comment" :label="$t('rate.comment')" />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn v-close-popup flat :label="$t('button.send')" :disable="rate == 0" @click="sendRate" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref, readonly, onMounted } from "vue";
	import { useAppStore } from "@stores/app";
	import { useBookStore } from "@stores/book";
	import { useBookRateStore } from "@stores/bookRate";
	import { matClose } from "@quasar/extras/material-icons";
	import type { BookRate, CreateBookRate, ModifyBookRate } from "@interfaces/bookRate";
	import type { Book } from "@interfaces/book";

	const props = defineProps<{ bookRate?: BookRate; book?: Book; edit: boolean }>();
	const appStore = useAppStore();
	const bookStore = useBookStore();
	const bookRateStore = useBookRateStore();

	const comment = ref("");
	const rate = ref(5);
	const defaults = readonly<BookRate | Record<string, never>>(props.bookRate || {});

	async function sendRate() {
		if (props.edit) {
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
			}
		} else {
			const data: CreateBookRate = { rate: rate.value };
			if (comment.value.length > 0) {
				data["comment"] = comment.value;
			}
			await bookRateStore.createBookRateByBookId(props.book?._id as string, data);
		}

		close();
	}

	function close() {
		appStore.editOrCreateBookRate = false;
	}

	onMounted(() => {
		if (props.edit && props.bookRate) {
			if (props.bookRate.comment) {
				comment.value = props.bookRate.comment;
			}
			rate.value = props.bookRate.rate;
		}
	});
</script>

<style scoped></style>
