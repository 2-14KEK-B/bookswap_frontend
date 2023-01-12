<template>
	<div v-if="appStore.isMessageOpened" style="padding-top: 50px">
		<q-scroll-area
			ref="chatRef"
			style="height: calc(100vh - 150px)"
			:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'"
		>
			<q-infinite-scroll reverse class="q-pa-md" @load="load">
				<template #loading>
					<div
						v-if="messageStore.loggedInMessages[messageStore.selectedMessage?.index as number]?.message_contents.length % 25 == 0"
						class="row justify-center q-my-md"
					>
						<q-spinner color="primary" name="dots" size="40px" />
					</div>
				</template>
				<q-chat-message
					v-for="(content, index) in messageStore.loggedInMessages[messageStore.selectedMessage?.index as number]?.message_contents"
					:key="index"
					class="q-py-sm"
					:sent="content.sender_id == userStore.loggedInUser?._id"
					:text="[content.content]"
					:name="content.sender_id == userStore.loggedInUser?._id ? 'me' : otherUser?.displayName"
					:stamp="dayjs().to(content.createdAt)"
				>
					<template #avatar>
						<q-avatar
							v-if="messageStore.selectedMessage && content.sender_id != userStore.loggedInUser?._id"
							color="primary"
							text-color="white"
							class="q-message-avatar q-message-avatar--received"
						>
							<q-img
								v-if="messageStore.loggedInMessages[messageStore.selectedMessage.index as number]?.otherUser?.picture"
								:src="messageStore.loggedInMessages[messageStore.selectedMessage.index as number]?.otherUser?.picture"
							/>
							{{ otherUser?.displayName?.charAt(0).toUpperCase() }}
						</q-avatar>
					</template>
				</q-chat-message>
			</q-infinite-scroll>
		</q-scroll-area>
		<q-page-sticky expand position="top">
			<q-toolbar class="bg-secondary">
				<q-btn flat dense :icon="mdiArrowLeft" label="Back" @click="emits('openContacts')" />
				<q-space />
				<q-btn flat no-caps align="center">
					<q-toolbar-title>
						<q-avatar v-if="messageStore.selectedMessage" color="primary" text-color="white">
							<q-img
								v-if="messageStore.loggedInMessages[messageStore.selectedMessage.index as number]?.otherUser?.picture"
								:src="messageStore.loggedInMessages[messageStore.selectedMessage.index as number]?.otherUser?.picture"
							/>
							{{ otherUser?.displayName?.charAt(0).toUpperCase() }}
						</q-avatar>
						{{ otherUser?.displayName }}
					</q-toolbar-title>
				</q-btn>
			</q-toolbar>
		</q-page-sticky>
		<q-page-sticky expand position="bottom" class="bg-secondary">
			<q-form class="full-width row q-pa-sm" @submit.prevent="send">
				<q-input
					ref="inputRef"
					v-model="input"
					class="col"
					dense
					type="text"
					rounded
					:bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'"
					outlined
					autofocus
					placeholder="Type your message.."
				/>
				<q-btn class="col-auto" flat color="white" rounded :icon="mdiSend" type="submit" />
			</q-form>
		</q-page-sticky>
	</div>
</template>

<script setup lang="ts">
	import { ref, onUnmounted } from "vue";
	import socket from "@api/socket";
	import dayjs, { extend } from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { QInput, QScrollArea } from "quasar";
	import { mdiArrowLeft, mdiSend } from "@quasar/extras/mdi-v7";

	extend(relativeTime);
	const appStore = useAppStore();
	const userStore = useUserStore();
	const messageStore = useMessageStore();
	const otherUser = messageStore.loggedInMessages[messageStore.selectedMessage?.index as number].otherUser;

	const input = ref("");
	const inputRef = ref<QInput>();
	const chatRef = ref<QScrollArea>();

	async function load(index: number, done: (stop?: boolean) => void) {
		const stop = await messageStore.loadMessage(index);
		done(!!stop);
	}

	function moveToBottom() {
		const scrollAreaBottom = chatRef.value?.getScroll().verticalSize as number;
		setTimeout(() => {
			chatRef.value?.setScrollPosition("vertical", scrollAreaBottom);
		}, 20);
	}

	async function send() {
		await messageStore.sendMessageToSelectedMessage(input.value);
		moveToBottom();
		input.value = "";
		inputRef.value?.focus();
	}

	socket.on("msg-sent", () => {
		if (appStore.isMessageOpened) {
			messageStore.setMessageToSeen(messageStore.selectedMessage?._id);
			moveToBottom();
		}
	});

	const emits = defineEmits<{ (e: "openContacts"): void }>();

	onUnmounted(() => {
		appStore.isMessageOpened = false;
	});
</script>

<style scoped></style>
