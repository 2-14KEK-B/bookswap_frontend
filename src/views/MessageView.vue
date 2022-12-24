<template>
	<q-page>
		<Contacts v-if="isContactsOpened" @close="isContactsOpened = false" />
		<Messages v-else @open-contacts="isContactsOpened = true" />
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import Contacts from "@components/message/Contacts.vue";
	import Messages from "@components/message/Messages.vue";

	const isContactsOpened = ref(true);
</script>

<style scoped lang="scss"></style>
