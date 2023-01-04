<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card style="height: calc(100vh - 115px)">
			<q-card-section class="text-center">
				<h2>{{ book?.title }}</h2>
				<h4>{{ book?.author }}</h4>
				<p>Uploader: {{ user?.username }}</p>
				<q-img class="q-pa-lg" :src="book?.picture" style="height: calc(100vh - 600px)"></q-img>
				<p>Price: {{ book?.price }}HUF</p>
			</q-card-section>
			<q-footer style="text-align: center; display: flex">
				<q-btn class="button" style="width: 50%" @click="sendBorrow">Send borrow request</q-btn>
				<q-btn class="button" style="width: 50%">Send message for uploader</q-btn>
			</q-footer>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRoute } from "vue-router";
	import { useBorrowStore } from "@stores/borrow";
	import type { Book } from "@interfaces/book";
	import type { User } from "@interfaces/user";

	const borrowStore = useBorrowStore();
	const route = useRoute();
	const book = ref<Book>();
	const user = ref<User>();

	async function sendBorrow() {
		const borrowData = { from: user.value?._id as string, books: [book.value?._id as string] };
		await borrowStore.createBorrow(borrowData);
	}

	onMounted(() => {
		console.log(route.meta);
		book.value = route.meta.book;
		user.value = route.meta.user;
	});
</script>

<style scoped lang="scss">
	button {
		background-color: #0d6f8d; /* Green */
		border: none;
		color: white;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0c637e;
	}
</style>
