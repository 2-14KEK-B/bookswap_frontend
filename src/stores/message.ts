import { defineStore } from "pinia";
import $axios from "@api/axios";
import { handle } from "@utils/error";
import { ref } from "vue";
import { useUserStore } from "./user";
import socket from "@api/socket";
import { setInfoFromOtherUser } from "@utils/message";
import { User } from "@interfaces/user";
import { Message, MessageContent } from "@interfaces/message";

export const useMessageStore = defineStore("message", () => {
	const selectedMessageIndex = ref<number | null>(null);
	const messages = ref<Message[]>([]);

	async function loadMessage(index: number): Promise<boolean | void> {
		if (selectedMessageIndex.value == null) return;
		const m = messages.value[selectedMessageIndex.value];

		if (m?.message_contents.length < 25) return;

		const res = await $axios.get(`message/${m?._id}?skip=${index * 25}`);
		if ((res.data as MessageContent[]).length == 0) {
			return true;
		}
		m?.message_contents.unshift(...(res.data as MessageContent[]).reverse());
	}

	async function getLoggedInUserMessages() {
		const { data, status } = await $axios.get("message/my");
		if (status < 400) {
			messages.value = (data as Message[])?.map((message) => setInfoFromOtherUser(message));
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

		const { status, data } = await $axios.post(`message/${userId}`, { content: message });

		if (status < 400) {
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
				messages.value[selectedMessageIndex.value as number].message_contents.push(data);
			}
		}
	}

	async function deleteMessage(id: string) {
		return $axios
			.delete(`/message/${id}`)
			.then(async (res) => {
				console.log(res.status);
			})
			.catch(handle);
	}

	socket.on("msg-recieved", (data: Message | MessageContent, sender?: User) => {
		if (sender) {
			messages.value?.push(setInfoFromOtherUser(data as Message, sender));
		} else {
			messages.value?.forEach((message) => {
				if (message.otherUser?._id == (data as MessageContent).sender_id) {
					message.message_contents.push(data as MessageContent);
				}
			});
		}
	});

	return {
		selectedMessageIndex,
		messages,
		getLoggedInUserMessages,
		// getDisplayName,
		sendMessage,
		// convertToChat,
		loadMessage,
		deleteMessage,
	};
});
