<template>
	<div style="padding-top: 100px">
		<q-scroll-area :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'" style="height: calc(100vh - 150px)">
			<q-list class="full-height" separator>
				<q-item
					v-for="(message, index) in messageStore.messages"
					:key="index"
					:active-class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-4'"
					clickable
					class="relative-position"
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
					<q-item-section>
						<q-item-label lines="1" class="text-bold">
							{{ message.otherUser?.displayName }}
						</q-item-label>
						<q-item-label caption>
							{{ message.message_contents[message.message_contents.length - 1].content }}
						</q-item-label>
					</q-item-section>
					<q-item-section side>
						<q-item-label caption>
							{{ getTimeString(message.message_contents[message.message_contents.length - 1].createdAt!) }}
						</q-item-label>
						<q-icon name="keyboard_arrow_down" />
					</q-item-section>
				</q-item>
			</q-list>
		</q-scroll-area>
		<q-page-sticky expand position="top">
			<q-toolbar :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-5'">
				<q-toolbar-title>Users</q-toolbar-title>
				<q-btn v-if="messageStore.selectedMessageIndex != null" flat dense :icon="mdiClose" @click="emits('close')" />
			</q-toolbar>
			<q-toolbar :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-5'">
				<q-input
					v-model="search"
					rounded
					:bg-color="$q.dark.isActive ? 'grey-7' : 'white'"
					outlined
					dense
					:dark="$q.dark.isActive"
					class="full-width"
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

	function getTimeString(dateAsString: string): string {
		const date = new Date(dateAsString);
		const today = new Date();

		if (date.toDateString() === today.toDateString()) {
			return date.toLocaleTimeString();
		} else {
			return date.toLocaleString();
		}
	}

	function onSelect(index: number) {
		messageStore.selectedMessageIndex = index;
		emits("close");
	}

	const emits = defineEmits<{ (e: "close"): void }>();
</script>

<style scoped></style>
