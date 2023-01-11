<template>
	<!-- $q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3' -->
	<q-item
		v-for="(message, index) in messages"
		:key="index"
		:class="
			message.seen
				? $q.dark.isActive
					? 'bg-grey-8'
					: 'bg-grey-3'
				: $q.dark.isActive
				? 'bg-blue-grey-8'
				: 'bg-blue-grey-3'
		"
		:active-class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
		clickable
		class="relative-position"
		:active="messageStore.selectedMessageIndex == index"
		@click.prevent="onSelect(index)"
	>
		<q-item-section avatar>
			<ProfileAvatar :src="message.otherUser?.picture" :alt="message.otherUser?.displayName" />
		</q-item-section>
		<q-item-section>
			<q-item-label lines="1" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
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
			<q-icon :name="matKeyboardArrowDown" />
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
	import { useMessageStore } from "@stores/message";
	import ProfileAvatar from "../ProfileAvatar.vue";
	import { matKeyboardArrowDown } from "@quasar/extras/material-icons";
	import type { Message } from "@interfaces/message";

	const props = defineProps<{ messages: Message[] }>();
	const messageStore = useMessageStore();

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
		messageStore.setMessageToSeen(props.messages[index]._id);
		emits("close");
	}

	const emits = defineEmits<{ (e: "close"): void }>();
</script>

<style scoped></style>
