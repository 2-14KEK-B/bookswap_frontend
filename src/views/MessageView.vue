<template>
	<q-page>
		<Contacts v-if="isContactsOpened" @close="isContactsOpened = false" />
		<Messages v-else @open-contacts="isContactsOpened = true" />
	</q-page>
</template>

<script setup lang="ts">
	import { ref, onUnmounted } from "vue";
	import Contacts from "@components/message/Contacts.vue";
	import Messages from "@components/message/Messages.vue";
	import { useMessageStore } from "@stores/message";

	const isContactsOpened = ref(true);

	onUnmounted(() => {
		const messageStore = useMessageStore();

		messageStore.selectedMessageIndex = null;
	});
</script>

<style scoped lang="scss"></style>
