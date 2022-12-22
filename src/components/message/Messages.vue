<template>
	<div style="padding-top: 50px">
		<q-scroll-area ref="chatRef" style="height: calc(100vh - 150px)">
			<q-infinite-scroll reverse class="q-pa-md" @load="load">
				<template #loading>
					<div class="row justify-center q-my-md">
						<q-spinner color="primary" name="dots" size="40px" />
					</div>
				</template>
				<q-chat-message
					v-for="(content, index) in messageStore.messages[messageStore.selectedMessageIndex as number]?.message_contents"
					:key="index"
					class="q-py-sm"
					:sent="content.sender_id == userStore.loggedInUser?._id"
					:text="[content.content]"
					:name="content.sender_id == userStore.loggedInUser?._id ? 'me' : otherUser?.displayName"
					:stamp="dayjs().to(content.createdAt)"
				/>
			</q-infinite-scroll>
		</q-scroll-area>
		<q-page-sticky expand position="top">
			<q-toolbar class="bg-blue">
				<q-btn flat dense :icon="mdiArrowLeft" label="Back" @click="emits('openContacts')" />
				<q-space />
				<q-btn flat no-caps align="center">
					<q-toolbar-title>
						<q-avatar color="primary" text-color="white">
							<q-img
								v-if="messageStore.messages[messageStore.selectedMessageIndex as number]?.otherUser?.picture"
								:src="messageStore.messages[messageStore.selectedMessageIndex as number]?.otherUser?.picture"
							/>
							{{ otherUser?.displayName?.charAt(0).toUpperCase() }}
						</q-avatar>
						{{ otherUser?.displayName }}
					</q-toolbar-title>
				</q-btn>
			</q-toolbar>
		</q-page-sticky>
		<q-page-sticky expand position="bottom" class="bg-grey-8">
			<q-form class="full-width row q-pa-xs" @submit.prevent="send">
				<q-input
					ref="inputRef"
					v-model="input"
					class="col"
					dense
					type="text"
					rounded
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
	import { ref, watch } from "vue";
	import dayjs, { extend } from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import { mdiArrowLeft, mdiSend } from "@quasar/extras/mdi-v7";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { QInput, QScrollArea } from "quasar";

	extend(relativeTime);
	const userStore = useUserStore();
	const messageStore = useMessageStore();
	const otherUser = messageStore.messages[messageStore.selectedMessageIndex as number].otherUser;

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

	watch(messageStore.messages[messageStore.selectedMessageIndex as number].message_contents, () => {
		moveToBottom();
	});

	async function send() {
		await messageStore.sendMessage(input.value);
		moveToBottom();
		input.value = "";
		inputRef.value?.focus();
	}

	const emits = defineEmits<{ (e: "openContacts"): void }>();
</script>

<style scoped></style>
