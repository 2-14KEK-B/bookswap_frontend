<template>
	<div>
		<q-form @submit.prevent="bookCreating">
			<q-input v-model="authorInput" label="Author" />
			<q-input v-model="titleInput" label="Title" />
			<q-input v-model="picInput" label="Picture" />
			<q-input v-model="priceInput" label="Price" />
			<q-toggle v-model="avaible" checked-icon="check" color="green" unchecked-icon="clear" />
			<q-btn type="submit">Create a new book</q-btn>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { QBtn, QForm, QInput } from "quasar";
	import { useBookStore } from "@stores/book";
	import { ref } from "vue";
	import { useRouter } from "vue-router";

	const bookStore = useBookStore();
	const router = useRouter();
	const authorInput = ref("");
	const titleInput = ref("");
	const picInput = ref("");
	const priceInput = ref(0);
	const avaible = ref(true);

	async function bookCreating() {
		await bookStore.createBook({
			author: authorInput.value,
			title: titleInput.value,
			picture: picInput.value,
			price: priceInput.value,
			for_borrow: avaible.value,
		});
		await router.push("/");
	}
</script>

<style></style>
