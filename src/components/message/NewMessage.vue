<template>
	<q-dialog v-model="appStore.messageModal" persistent @keyup.esc="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						Send message to
						<span class="text-italic">{{ displayName }}</span>
					</div>
				</q-toolbar-title>
				<q-btn :icon="matClose" flat round dense @click="close" />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-input v-model="input"></q-input>
			</q-card-section>

			<q-card-actions align="right">
				<q-btn flat label="OK" :disable="!inputValidate()" @click="sendMessage" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useMessageStore } from "@stores/message";
	import { matClose } from "@quasar/extras/material-icons";

	const props = defineProps<{ userId: string; displayName?: string }>();
	const appStore = useAppStore();
	const messageStore = useMessageStore();

	const input = ref("");

	function inputValidate() {
		return input.value.length > 0;
	}

	async function sendMessage() {
		if (inputValidate()) {
			await messageStore.sendMessageToUserId(input.value, props.userId);
			close();
		}
	}

	function close() {
		appStore.messageModal = false;
	}
</script>

<style scoped></style>
