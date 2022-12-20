<template>
	<div style="padding-top: 100px">
		<q-scroll-area class="bg-grey q-pa-xs" style="height: calc(100vh - 150px)">
			<q-list class="full-height" separator bordered>
				<q-item
					v-for="(message, index) in messageStore.messages"
					:key="index"
					v-ripple
					clickable
					:active="messageStore.selectedMessageIndex == index"
					@click.prevent="onSelect(index)"
				>
					<q-item-section avatar>
						<q-avatar v-if="message.otherUser?.picture" color="primary" text-color="white">
							<q-img :src="message.otherUser?.picture" />
						</q-avatar>
						<q-avatar v-else color="primary" text-color="white">
							{{ message.otherUser?.displayName?.charAt(0).toUpperCase() }}
						</q-avatar>
					</q-item-section>
					<q-item-section no-wrap>
						<q-item-label>
							{{ message.otherUser?.displayName }}
						</q-item-label>
					</q-item-section>
					<q-item-section side>
						<q-icon name="chat_bubble" color="green" />
					</q-item-section>
				</q-item>
			</q-list>
		</q-scroll-area>
		<q-page-sticky expand position="top">
			<q-toolbar class="bg-grey-10">
				<q-toolbar-title>Users</q-toolbar-title>
				<q-btn v-if="messageStore.selectedMessageIndex" flat dense :icon="mdiClose" @click="emits('close')" />
			</q-toolbar>
			<q-toolbar class="bg-grey-10">
				<q-input
					v-model="search"
					rounded
					outlined
					dense
					class="WAL__field full-width"
					placeholder="Search or start a new conversation"
				>
					<template #prepend>
						<q-icon name="search" />
					</template>
				</q-input>
			</q-toolbar>
		</q-page-sticky>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useMessageStore } from "@stores/message";
	import { mdiClose } from "@quasar/extras/mdi-v7";

	const messageStore = useMessageStore();

	const search = ref("");

	function onSelect(index: number) {
		messageStore.selectedMessageIndex = index;
		emits("close");
	}

	const emits = defineEmits<{ (e: "close"): void }>();
</script>

<style scoped></style>
