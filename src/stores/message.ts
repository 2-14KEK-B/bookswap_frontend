import { defineStore } from "pinia";
import $axios from "@api/axios";
import { ref, computed } from "vue";
import socket from "@api/socket";
import { Loading } from "quasar";
import { useUserStore } from "@stores/user";
import { setInitialMessageInfo, countNotSeenMessages } from "@utils/messageHelper";
import type { Message, MessageContent } from "@interfaces/message";
import type { PaginateResult, PathQuery } from "@interfaces/paginate";

export const useMessageStore = defineStore("message", () => {
	const selectedMessageIndex = ref<number | null>(null);
	const loggedInMessages = ref<Message[]>([]);
	const notSeenMessages = computed(() => countNotSeenMessages(loggedInMessages.value));

	async function loadMessage(index: number): Promise<boolean | void> {
		if (selectedMessageIndex.value == null) return;
		const m = loggedInMessages.value[selectedMessageIndex.value];
		const total = m.totalCount as number;

		if (total < 25) return;
		if (total == m.message_contents.length) return;

		try {
			Loading.show();
			const { data } = await $axios.get<unknown, { data: { message_contents: MessageContent[]; totalCount: number } }>(
				`/user/${m.otherUser?._id}/message?skip=${index * 25}`,
			);
			if (data.message_contents.length == 0) {
				return true;
			}
			m?.message_contents.unshift(...data.message_contents);
		} catch (error) {
			return;
		}
	}

	async function getLoggedInUserMessages() {
		try {
			Loading.show();
			const { data } = await $axios.get("/user/me/message");
			loggedInMessages.value = (data as Message[])?.map((message) => setInitialMessageInfo(message));
		} catch (error) {
			return;
		}
	}

	async function sendMessageToSelectedMessage(message: string) {
		if (selectedMessageIndex.value != null) {
			try {
				const selectedMessage = loggedInMessages.value[selectedMessageIndex.value];
				const userId = selectedMessage.otherUser?._id as string;
				const { data } = await $axios.post<{ message: MessageContent }>(`/user/${userId}/message`, {
					content: message,
				});
				(selectedMessage.totalCount as number)++;
				selectedMessage.message_contents.push(data.message);
				socket.emit("send-msg-cnt", {
					to: userId as string,
					message: data.message as MessageContent,
				});
			} catch (error) {
				return;
			}
		}
	}

	async function sendMessageToUserId(message: string, to_id: string) {
		try {
			const { data } = await $axios.post<{ message: Message | MessageContent; isNew: boolean }>(`/user/${to_id}/message`, {
				content: message,
			});
			if (data.isNew) {
				loggedInMessages.value.push({ ...(data.message as Message), seen: true });
				socket.emit("send-new-msg", {
					to: to_id,
					message: data.message as Message,
				});
			} else {
				const messageWithOtherUser = loggedInMessages.value.find((m) => {
					return m.otherUser?._id == to_id;
				});
				messageWithOtherUser?.message_contents.push(data.message as MessageContent);
				socket.emit("send-msg-cnt", {
					to: to_id,
					message: data.message as MessageContent,
				});
			}
		} catch (error) {
			return;
		}
	}

	async function setMessageToSeen(messageId?: string) {
		if (!messageId) return;
		try {
			const { status } = await $axios.patch(`/message/${messageId}/seen`);
			if (status == 204) {
				const message = loggedInMessages.value.find((message) => message._id == messageId);
				if (message) {
					const userStore = useUserStore();
					message.seen = true;
					message.message_contents.some((content) => {
						if (content.sender_id != userStore.loggedInUser?._id) {
							content.seen = true;
							return true;
						}
						return false;
					});
				}
			}
		} catch (error) {
			return;
		}
	}

	async function deleteMessage(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/message/${id}`);
		} catch (error) {
			return;
		}
	}

	async function adminGetMessages(query: PathQuery = { skip: 0, limit: 10 }) {
		try {
			let path = `/admin/message?skip=${query.skip}&limit=${query.limit}`;
			if (query.sortBy) {
				path += `&sortBy=${query.sortBy}`;
			}
			if (query.keyword) {
				path += `&keyword=${query.keyword}`;
			}

			Loading.show();
			const { data } = await $axios.get(path);
			return data as PaginateResult<Message>;
		} catch (error) {
			return;
		}
	}

	async function adminDeleteMessage(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/message/${id}`);
		} catch (error) {
			return;
		}
	}

	async function adminDeleteMessageContent(messageId: string, contentId: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/message/${messageId}/content/${contentId}`);
		} catch (error) {
			return;
		}
	}

	return {
		selectedMessageIndex,
		loggedInMessages,
		notSeenMessages,
		getLoggedInUserMessages,
		// getDisplayName,
		sendMessageToSelectedMessage,
		sendMessageToUserId,
		// convertToChat,
		loadMessage,
		setMessageToSeen,
		deleteMessage,
		adminGetMessages,
		adminDeleteMessage,
		adminDeleteMessageContent,
	};
});
