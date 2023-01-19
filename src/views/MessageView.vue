<template>
	<q-page>
		<Contacts v-if="isContactsOpened" @close-contacts="openMessages" />
		<Messages v-else @open-contacts="openContacts" />
	</q-page>
</template>

<script setup lang="ts">
	import { onUnmounted, ref } from "vue";
	import Contacts from "@components/message/Contacts.vue";
	import Messages from "@components/message/Messages.vue";
	import { useAppStore } from "@stores/app";
	import { useMessageStore } from "@stores/message";

	const appStore = useAppStore();
	const isContactsOpened = ref(true);

	function openContacts() {
		isContactsOpened.value = true;
		appStore.isMessageOpened = false;
	}
	function openMessages() {
		isContactsOpened.value = false;
		appStore.isMessageOpened = true;
	}

	onUnmounted(() => {
		const messageStore = useMessageStore();
		messageStore.selectedMessage = null;
	});
</script>

<style scoped lang="scss"></style>
