<template>
	<router-view />
</template>

<script setup lang="ts">
	import socket from "@api/socket";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { setInfoFromOtherUser } from "@utils/message";
	import type { Message, MessageContent } from "@interfaces/message";

	socket.on("recieve-msg-cnt", (data: MessageContent) => {
		const messageStore = useMessageStore();
		// console.log("recieve-msg-cnt: ", data);
		const message = messageStore.loggedInMessages.find((message) => {
			// console.log(message.otherUser?._id, data.sender_id, data.sender_id == message.otherUser?._id);
			if (message.otherUser?._id == data.sender_id) {
				return message;
			}
		});
		message?.message_contents.push(data);
		// console.log("message after pushed content: ", message);
	});
	socket.on("recieve-new-msg", (data: Message) => {
		// console.log("recieve-new-msg: ", data);
		const userStore = useUserStore();
		const messageStore = useMessageStore();
		messageStore.loggedInMessages.push(setInfoFromOtherUser(data as Message, userStore.loggedInUser?._id as string));
		// console.log("messages.value after pushed new message: ", messageStore.messages);
	});
</script>
