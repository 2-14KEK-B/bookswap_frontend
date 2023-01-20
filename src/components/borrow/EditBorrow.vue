<template>
	<q-dialog v-if="appStore.editBorrow" v-model="appStore.editBorrow" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">{{ $t("borrow.edit") }}</div>
				</q-toolbar-title>
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-toggle v-model="verified" :label="$t('borrow.verified')" />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn v-if="verified" v-close-popup flat :label="$t('button.send')" @click="sendUpdate" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useBorrowStore } from "@stores/borrow";
	import { matClose } from "@quasar/extras/material-icons";
	import type { Borrow } from "@interfaces/borrow";

	const props = defineProps<{ borrow?: Borrow }>();

	const appStore = useAppStore();
	const borrowStore = useBorrowStore();

	const verified = ref(props.borrow?.verified);

	async function sendUpdate() {
		if (props.borrow) {
			await borrowStore.verifyBorrow(props.borrow?._id);
			close();
		}
	}

	function close() {
		appStore.editBorrow = false;
	}
</script>

<style scoped></style>
