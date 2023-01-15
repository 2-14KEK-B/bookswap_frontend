<template>
	<q-dialog v-model="appStore.createBookRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						{{$t('rate')}}
						<span class="text-italic">{{ book?.title }}</span>
					</div>
				</q-toolbar-title>
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-rating v-model="rate" :label="$t('rate')" />
				<q-input v-model="comment" :label="$t('comment')" />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn v-close-popup flat label="OK" :disable="rate == 0" @click="sendRate" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useBookRateStore } from "@stores/bookRate";
	import { matClose } from "@quasar/extras/material-icons";
	import type { Book } from "@interfaces/book";
	import type { CreateBookRate } from "@interfaces/bookRate";

	const props = defineProps<{ book?: Book }>();
	const appStore = useAppStore();
	const bookRateStore = useBookRateStore();

	const comment = ref("");
	const rate = ref<number>(5);

	async function sendRate() {
		const data: CreateBookRate = { rate: rate.value };
		if (comment.value.length > 0) {
			data["comment"] = comment.value;
		}
		await bookRateStore.createBookRateByBookId(props.book?._id as string, data);
	}

	function close() {
		appStore.createBookRate = false;
	}
</script>

<style scoped></style>
