<template>
	<router-view />
</template>

<script setup lang="ts">
	import socket from "@api/socket";
	import { useMessageStore } from "@stores/message";
	import { setInitialMessageInfo } from "@utils/messageHelper";

	const messageStore = useMessageStore();

	socket.on("recieve-msg-cnt", (sentMessageContent) => {
		messageStore.loggedInMessages = messageStore.loggedInMessages.map((message) => {
			if (message.otherUser?._id == sentMessageContent.sender_id) {
				message.seenByLoggedInUser = false;
				message.message_contents.push(sentMessageContent);
				(message.totalCount as number)++;
				return message;
			} else {
				return message;
			}
		});
	});
	socket.on("recieve-new-msg", (sentMessage) => {
		messageStore.loggedInMessages.push(setInitialMessageInfo(sentMessage));
	});

	socket.on("msg-seen", (userWhoSawId, messageId) => {
		messageStore.loggedInMessages.some((message) => {
			if (message._id == messageId) {
				message.message_contents.forEach((content) => {
					if (content.sender_id != userWhoSawId) {
						content.seen = true;
					}
				});
				return true;
			}
			return false;
		});
	});
</script>
