<template>
	<div style="padding-top: 100px">
		<q-pull-to-refresh @refresh="loadMessages">
			<q-scroll-area :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" style="height: calc(100vh - 150px)">
				<q-list class="full-height" separator>
					<q-item
						v-for="(message, index) in messages"
						:key="index"
						:class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'"
						:active-class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
						clickable
						class="relative-position"
						:active="messageStore.selectedMessageIndex == index"
						@click.prevent="onSelect(index)"
					>
						<q-item-section avatar>
							<ProfileAvatar :src="message.otherUser?.picture" :alt="message.otherUser?.displayName" />
						</q-item-section>
						<q-item-section>
							<q-item-label lines="1" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
								{{ message.otherUser?.displayName }}
							</q-item-label>
							<q-item-label caption>
								{{ message.message_contents[message.message_contents.length - 1].content }}
							</q-item-label>
						</q-item-section>
						<q-item-section side>
							<q-item-label caption>
								{{ getTimeString(message.message_contents[message.message_contents.length - 1].createdAt!) }}
							</q-item-label>
							<q-icon :name="matKeyboardArrowDown" />
						</q-item-section>
					</q-item>
				</q-list>
			</q-scroll-area>
		</q-pull-to-refresh>
		<q-page-sticky expand position="top">
			<q-toolbar class="bg-secondary">
				<q-toolbar-title>Users</q-toolbar-title>
				<q-btn v-if="messageStore.selectedMessageIndex != null" flat dense :icon="mdiClose" @click="emits('close')" />
			</q-toolbar>
			<q-toolbar class="bg-secondary">
				<q-input
					v-model="search"
					rounded
					:bg-color="$q.dark.isActive ? 'grey-9' : 'white'"
					outlined
					dense
					class="full-width"
					placeholder="Search or start a new conversation"
				>
					<!-- @keydown.enter.prevent="sort" -->
					<template #prepend>
						<q-icon :name="matSearch" />
					</template>
				</q-input>
			</q-toolbar>
		</q-page-sticky>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";
	import { useMessageStore } from "@stores/message";
	import ProfileAvatar from "../ProfileAvatar.vue";
	import { mdiClose } from "@quasar/extras/mdi-v7";
	import { matSearch, matKeyboardArrowDown } from "@quasar/extras/material-icons";
	import { User } from "@interfaces/user";

	const messageStore = useMessageStore();

	const messages = ref(messageStore.messages);
	const search = ref("");

	watch(search, (keyword) => {
		const required: Array<keyof User> = ["fullname", "username", "email"];
		messages.value = messageStore.messages.filter((message) => {
			if (
				required.some((field) => {
					if ((message.otherUser as User)[field]) {
						if ((message.otherUser as User)[field]?.toString().search(keyword) != -1) {
							return true;
						}
					}
				})
			) {
				return message;
			}
		});
	});

	function getTimeString(dateAsString: string): string {
		const date = new Date(dateAsString);
		const today = new Date();

		if (date.toDateString() === today.toDateString()) {
			return date.toLocaleTimeString();
		} else {
			return date.toLocaleString();
		}
	}

	function onSelect(index: number) {
		messageStore.selectedMessageIndex = index;
		emits("close");
	}

	async function loadMessages(done: () => void) {
		await messageStore.getLoggedInUserMessages();
		done();
	}

	const emits = defineEmits<{ (e: "close"): void }>();
</script>

<style scoped></style>
