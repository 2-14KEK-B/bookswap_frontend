<template>
	<q-item
		v-for="message in messages"
		:key="message._id"
		:class="
			message.seenByLoggedInUser
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
		:active="messageStore.selectedMessage?._id == message._id"
		@click.prevent="onSelect(message._id)"
	>
		<q-item-section avatar>
			<ProfileAvatar :src="message.otherUser?.picture" :alt="message.otherUser?.displayName" />
		</q-item-section>
		<q-item-section>
			<q-item-label lines="1" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
				{{ message.otherUser?.displayName }}
			</q-item-label>
			<q-item-label caption>
				<q-icon
					v-if="message.message_contents[message.message_contents.length - 1].sender_id != userStore.loggedInUser?._id"
					:name="mdiArrowTopLeft"
				/>
				{{ message.message_contents[message.message_contents.length - 1].content }}
				<q-icon
					v-if="
						message.message_contents[message.message_contents.length - 1].sender_id == userStore.loggedInUser?._id &&
						message.message_contents[message.message_contents.length - 1].seen
					"
					:name="mdiCheckBold"
				/>
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
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import ProfileAvatar from "../ProfileAvatar.vue";
	import { getIndexById } from "@utils/messageHelper";
	import { matKeyboardArrowDown } from "@quasar/extras/material-icons";
	import { mdiCheckBold, mdiArrowTopLeft } from "@quasar/extras/mdi-v7";
	import type { Message } from "@interfaces/message";

	const props = defineProps<{ messages: Message[] }>();
	const userStore = useUserStore();
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

	function onSelect(messageId?: string) {
		if (messageId) {
			const index = getIndexById(messageStore.loggedInMessages, messageId);
			messageStore.selectedMessage = { _id: messageId, index: index };
			messageStore.setMessageToSeen(props.messages[index]._id);
			emits("close");
		}
	}

	const emits = defineEmits<{ (e: "close"): void }>();
</script>

<style scoped></style>
