<template>
	<div class="q-pa-lg">
		<q-form @submit.prevent="bookCreating" @reset="resetFields">
			<q-input
				v-model="input.author"
				label="Author"
				lazy-rules
				:rules="[(val) => (val && val.length > 0) || 'Please type something']"
			/>
			<q-input
				v-model="input.title"
				label="Title"
				lazy-rules
				:rules="[(val) => (val && val.length > 0) || 'Please type something']"
			/>
			<q-input v-model="input.picture" label="Picture" />
			<q-input v-model="input.price" label="Price" type="number" />
			<q-toggle
				v-model="input.for_borrow"
				color="green"
				:label="input.for_borrow ? 'Upload for borrow' : 'Upload for lend'"
			/>
			<div>
				<q-btn label="Submit" type="submit" color="primary" />
				<q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { QBtn, QForm, QInput } from "quasar";
	import { useBookStore } from "@stores/book";
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import type { CreateBook } from "@interfaces/book";

	const bookStore = useBookStore();
	const router = useRouter();

	const input = ref<CreateBook>({
		author: "",
		title: "",
		picture: "",
		price: 0,
		for_borrow: true,
	});

	async function bookCreating() {
		const newData: Partial<CreateBook> = {
			author: input.value.author,
			title: input.value.title,
			price: input.value.price?.toString(),
			for_borrow: input.value.for_borrow,
		};
		if (input.value.picture && input.value.picture.length > 0) {
			newData.picture = input.value.picture;
		}
		await bookStore.createBook(newData);
		await router.push("/");
	}

	function resetFields() {
		input.value = {
			author: "",
			title: "",
			picture: "",
			price: 0,
			for_borrow: true,
		};
	}
</script>

<style></style>
