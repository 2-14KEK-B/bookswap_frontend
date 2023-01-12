<template>
	<router-view />
</template>

<script setup lang="ts">
	import socket from "@api/socket";
	import { useMessageStore } from "@stores/message";
	import { setInitialMessageInfo } from "@utils/messageHelper";
	import type { Message, MessageContent } from "@interfaces/message";

	socket.on("recieve-msg-cnt", (data: MessageContent) => {
		const messageStore = useMessageStore();
		messageStore.loggedInMessages = messageStore.loggedInMessages.map((message) => {
			if (message.otherUser?._id == data.sender_id) {
				message.seen = false;
				message.message_contents.push(data);
				(message.totalCount as number)++;
				return message;
			} else {
				return message;
			}
		});
	});
	socket.on("recieve-new-msg", (data: Message) => {
		const messageStore = useMessageStore();
		messageStore.loggedInMessages.push(setInitialMessageInfo(data));
	});
</script>
