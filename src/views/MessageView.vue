<template>
	<q-page>
		<Contacts v-if="isContactsOpened" @close="isContactsOpened = false" />
		<Messages v-else @open-contacts="isContactsOpened = true" />
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import Contacts from "@components/message/Contacts.vue";
	import Messages from "@components/message/Messages.vue";
	import { useMessageStore } from "@stores/message";

	const messageStore = useMessageStore();
	const isContactsOpened = ref(true);

	onMounted(async () => {
		await messageStore.getLoggedInUserMessages();
	});
</script>

<style scoped lang="scss"></style>
