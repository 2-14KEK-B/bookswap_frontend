<template>
	<div style="padding-top: 100px">
		<q-pull-to-refresh @refresh="loadMessages">
			<q-scroll-area :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" style="height: calc(100vh - 150px)">
				<q-list v-if="filteredMessages" class="full-height" separator>
					<ContactItem :messages="filteredMessages" @close="emits('closeContacts')" />
				</q-list>
				<q-list v-else class="full-height" separator>
					<ContactItem :messages="messageStore.loggedInMessages" @close="emits('closeContacts')" />
				</q-list>
			</q-scroll-area>
		</q-pull-to-refresh>
		<q-page-sticky expand position="top">
			<q-toolbar class="bg-secondary">
				<q-toolbar-title>Users</q-toolbar-title>
				<q-btn
					v-if="messageStore.selectedMessageIndex != null"
					flat
					dense
					:icon="mdiClose"
					@click="emits('closeContacts')"
				/>
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
	import { onMounted, ref, watch } from "vue";
	import { useMessageStore } from "@stores/message";
	import ContactItem from "./ContactItem.vue";
	import { mdiClose } from "@quasar/extras/mdi-v7";
	import { matSearch } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { Message } from "@interfaces/message";

	const messageStore = useMessageStore();

	const filteredMessages = ref<Message[]>();
	const search = ref("");

	watch(search, (keyword) => {
		if (keyword.length == 0) filteredMessages.value = undefined;
		const required: Array<keyof User> = ["fullname", "username", "email"];
		filteredMessages.value = messageStore.loggedInMessages.filter((message) => {
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

	async function loadMessages(done: () => void) {
		await messageStore.getLoggedInUserMessages();
		done();
	}

	const emits = defineEmits<{ (e: "closeContacts"): void }>();

	onMounted(async () => {
		await messageStore.getLoggedInUserMessages();
	});
</script>

<style scoped></style>
