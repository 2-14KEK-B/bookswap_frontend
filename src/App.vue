<template>
	<router-view />
</template>

<script setup lang="ts">
	import socket from "@api/socket";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { setInitialMessageInfo } from "@utils/messageHelper";

	const userStore = useUserStore();
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

	socket.on("recieve-notification", (doc_id, docType, notiType, from) => {
		userStore.loggedInUser?.notifications.push({
			doc_id: doc_id,
			doc_type: docType,
			noti_type: notiType,
			from: from,
			seen: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
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
