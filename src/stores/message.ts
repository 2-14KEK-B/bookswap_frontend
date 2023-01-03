import { defineStore } from "pinia";
import $axios from "@api/axios";
import { ref } from "vue";
import { useUserStore } from "./user";
import socket from "@api/socket";
import { setInfoFromOtherUser } from "@utils/message";
import { Message, MessageContent } from "@interfaces/message";
import { Loading } from "quasar";
import { PaginateResult, PathQuery } from "@interfaces/paginate";

export const useMessageStore = defineStore("message", () => {
	const selectedMessageIndex = ref<number | null>(null);
	const messages = ref<Message[]>([]);

	async function loadMessage(index: number): Promise<boolean | void> {
		if (selectedMessageIndex.value == null) return;
		const m = messages.value[selectedMessageIndex.value];
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
			messages.value = (data as Message[])?.map((message) => setInfoFromOtherUser(message));
		} catch (error) {
			return;
		}
	}

	async function sendMessage(message: string, to_id?: string) {
		const { loggedInUser } = useUserStore();
		let userId: string;

		if (to_id) {
			userId = to_id;
		} else {
			if (selectedMessageIndex.value == null) return;

			userId = messages.value[selectedMessageIndex.value].otherUser?._id as string;
		}
		try {
			const { data } = await $axios.post(`/user/${userId}/message`, { content: message });
			const messageContent = {
				from: loggedInUser?._id as string,
				to: userId as string,
				message: message,
			};

			if (to_id) {
				socket.emit(
					"send-msg",
					{
						...messageContent,
					},
					{
						_id: loggedInUser?._id,
						displayName: loggedInUser?.fullname || loggedInUser?.username || loggedInUser?.email,
						picture: loggedInUser?.picture,
					},
				);
				messages.value.push(data);
			} else {
				socket.emit("send-msg", {
					...messageContent,
				});
				(messages.value[selectedMessageIndex.value as number].totalCount as number)++;
				messages.value[selectedMessageIndex.value as number].message_contents.push(data);
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
		messages,
		getLoggedInUserMessages,
		// getDisplayName,
		sendMessage,
		// convertToChat,
		loadMessage,
		deleteMessage,
		adminGetMessages,
		adminDeleteMessage,
		adminDeleteMessageContent,
	};
});
