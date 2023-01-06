<template>
	<q-page
		:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
		style="min-height: calc(100vh - 50px)"
		class="row items-stretch"
	>
		<BookInfo v-if="bookStore.openedBook" />
	</q-page>
</template>

<script setup lang="ts">
	import BookInfo from "@components/BookInfo.vue";
	import { useBookStore } from "@stores/book";

	const bookStore = useBookStore();
</script>

<style scoped></style>
