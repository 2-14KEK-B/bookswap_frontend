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
			<q-input
				v-model="input.price"
				label="Price"
				lazy-rules
				type="number"
				:rules="[(val: number) => (!isNaN(val)) || 'Please add valid price']"
			/>
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

	const defaultValue = { author: "", title: "", picture: "", price: 0, for_borrow: true };
	const bookStore = useBookStore();
	const router = useRouter();

	const input = ref(defaultValue);

	async function bookCreating() {
		await bookStore.createBook(input.value);
		await router.push("/");
	}

	function resetFields() {
		input.value = defaultValue;
	}
</script>

<style></style>
