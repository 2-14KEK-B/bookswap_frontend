<template>
	<router-view />
</template>

<script setup lang="ts">
	import socket from "@api/socket";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { setInitialMessageInfo } from "@utils/messageHelper";
	import {
		deleteFromBorrowAndUserRates,
		addToBorrowAndUserRates,
		updateInBorrowAndUserRates,
	} from "@utils/userRateHelper";
	import { useBorrowStore } from "@stores/borrow";
	import { useUserRateStore } from "@stores/userRate";

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

	socket.on("recieve-notification", async (doc_id, docType, notiType, from) => {
		const borrowStore = useBorrowStore();
		const userRateStore = useUserRateStore();
		userStore.loggedInUser?.notifications.push({
			doc_id: doc_id,
			doc_type: docType,
			noti_type: notiType,
			from: from,
			seen: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		if (notiType == "delete") {
			if (docType == "user_rate") {
				deleteFromBorrowAndUserRates(doc_id);
			} else {
				borrowStore.loggedInBorrows = borrowStore.loggedInBorrows.filter((b) => b._id != doc_id);
			}
		} else if (notiType == "create") {
			if (docType == "user_rate") {
				const userRate = await userRateStore.getByUserRateId(doc_id);
				addToBorrowAndUserRates(userRate);
			} else {
				const borrow = await borrowStore.getById(doc_id);
				borrowStore.loggedInBorrows.push(borrow);
			}
		} else if (notiType == "verify") {
			borrowStore.loggedInBorrows.some((b) => {
				if (b._id == doc_id) {
					b.verified = true;
					return true;
				}
				return false;
			});
		} else {
			if (docType == "user_rate") {
				const userRate = await userRateStore.getByUserRateId(doc_id);
				updateInBorrowAndUserRates(userRate);
			} else {
				const borrow = await borrowStore.getById(doc_id);
				borrowStore.loggedInBorrows.some((b) => {
					if (b._id == doc_id) {
						b = borrow;
						return true;
					}
					return false;
				});
			}
		}
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
