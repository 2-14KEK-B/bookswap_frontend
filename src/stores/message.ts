import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@interfaces/user";
import { Message, MessageContent, UserMessages } from "@interfaces/message";
import { useUserStore } from "./user";
import $axios from "@api/axios";
import socket from "@api/socket";

export const useMessageStore = defineStore("message", () => {
	const selectedMessage = ref<UserMessages>();
	const messages = ref<Message[]>();

	function getContacts(): UserMessages[] {
		const userStore = useUserStore();
		const contacts: UserMessages[] = [];
		messages.value?.forEach((message) => {
			const otherUser = (message.users as User[]).filter((u) => u._id != userStore.loggedInUser?._id)[0];
			contacts.push({ user: otherUser, contents: message.message_contents, _id: message._id as string });
		});
		return contacts;
	}

	function getDisplayName(user?: User) {
		if (user) {
			return user.fullname || user.username || user.email;
		}
		return (
			selectedMessage.value?.user.fullname || selectedMessage.value?.user.username || selectedMessage.value?.user.email
		);
	}

	function onSelectMessage(selected: UserMessages) {
		selectedMessage.value = selected;
	}

	async function loadMessage(index: number): Promise<boolean | void> {
		const res = await $axios.get(`message/${selectedMessage.value?._id}?skip=${index * 25}`);
		if ((res.data as MessageContent[]).length == 0) {
			return true;
		}
		selectedMessage.value?.contents.unshift(...(res.data as MessageContent[]).reverse());
	}

	async function sendMessage(message: string, to_id?: string) {
		const userStore = useUserStore();

		const userId = to_id || selectedMessage.value?.user._id;

		const res = await $axios.post(`message/${userId}`, { content: message });
		if (res.status < 400) {
			socket.emit("send-msg", {
				from: userStore.loggedInUser?._id as string,
				to: selectedMessage.value?.user._id as string,
				message: message,
			});
			selectedMessage.value?.contents.push(res.data);
		}
	}

	socket.on("msg-recieved", (data) => {
		const {
			from,
			// to,
			message,
		} = data;
		// const userStore = useUserStore();
		const newMessage: MessageContent = { content: message, sender_id: from, createdAt: new Date() };
		console.log(newMessage);
	});

	return {
		selectedMessage,
		messages,
		onSelectMessage,
		getDisplayName,
		sendMessage,
		getContacts,
		loadMessage,
	};
});
