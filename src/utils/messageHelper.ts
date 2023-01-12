import { useUserStore } from "@stores/user";
import type { Message } from "@interfaces/message";
import type { User } from "@interfaces/user";

function setInitialMessageInfo(message: Message) {
	const userStore = useUserStore();
	const loggedInUserId = userStore.loggedInUser?._id;
	const otherUser = (message.users as User[]).find((user): User | undefined => {
		if (user._id != loggedInUserId) {
			user.displayName = user.fullname || user.username || user.email;
			return user;
		}
	});
	return { ...message, otherUser: otherUser, seen: isMessageSeen(message) };
}

function countNotSeenMessages(messages?: Message[]) {
	let count = 0;
	if (messages) {
		messages.forEach((message) => {
			if (!message.seen) {
				count++;
				return false;
			}
			return true;
		});
	}
	return count;
}

function isMessageSeen(message: Message) {
	let seen = true;
	const userStore = useUserStore();
	const loggedInUserId = userStore.loggedInUser?._id;
	if (loggedInUserId) {
		message.message_contents.some((content) => {
			if (content.sender_id != loggedInUserId && content.seen == false) {
				seen = false;
				return true;
			}
			return false;
		});
	}
	return seen;
}

function getIndexById(messages: Message[], messageId: string) {
	const index = messages.findIndex((m) => m._id == messageId);
	return index;
}

function sortMessagesByContentUpdatedAt(messages: Message[]) {
	return messages.sort((a, b) => {
		const aLastMessageDate = Date.parse(a.message_contents[a.message_contents.length - 1].createdAt as string);
		const bLastMessageDate = Date.parse(b.message_contents[b.message_contents.length - 1].createdAt as string);
		return bLastMessageDate - aLastMessageDate;
	});
}

export { setInitialMessageInfo, countNotSeenMessages, isMessageSeen, getIndexById, sortMessagesByContentUpdatedAt };
