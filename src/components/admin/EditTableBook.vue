<template>
	<q-dialog v-model="isOpen" class="q-pa-md" persistent @hide="emits('close', isOpen)">
		<q-card class="q-pa-md" style="min-width: 400px">
			<q-card-section>
				<q-toolbar-title class="flex justify-between">
					Book Editing
					<q-btn v-close-popup no-caps icon="mdi-close" color="red" />
				</q-toolbar-title>
			</q-card-section>
			<q-card-section>
				<q-form class="q-gutter-y-md" @submit.prevent="editBook" @reset="reset">
					<q-input v-model="bookData.author" type="text" label="Author" clearable />
					<q-input v-model="bookData.title" type="text" label="Title" clearable />
					<q-input v-model="bookData.picture" type="url" label="Picture" clearable />
					<q-input v-model="bookData.price" type="number" label="Price" suffix="Ft" step="100" min="0" />
					<q-checkbox v-model="bookData.available" label="Available" clearable />
					<q-select v-model="bookData.category" multiple label="Category" disable />
					<q-checkbox v-model="bookData.for_borrow" label="For Borrow" clearable />
					<div class="flex">
						<q-btn type="reset" label="reset" />
						<q-space />
						<q-btn type="submit" color="secondary">Edit</q-btn>
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useBookStore } from "@stores/book";
	// import { useRouter } from "vue-router";
	import { Book } from "@interfaces/book";

	const props = defineProps<{ edit: boolean; book: Book }>();
	const isOpen = ref(props.edit);
	const emits = defineEmits<{ (event: "close", state: boolean): void }>();
	const bookStore = useBookStore();
	// const router = useRouter();

	interface ModifiableData {
		author?: string;
		title?: string;
		picture?: string;
		category?: string[];
		price?: number;
		for_borrow?: boolean;
		available?: boolean;
	}

	const bookData = ref<ModifiableData>({
		author: props.book.author || "",
		title: props.book.title || "",
		picture: props.book.picture || "",
		category: props.book.category || [],
		price: props.book.price || 0,
		for_borrow: props.book.for_borrow || true,
		available: props.book.available || true,
	});
	async function editBook() {
		await bookStore.edit(bookData.value, props.book._id as string);
		emits("close", isOpen.value);
	}

	function reset() {
		bookData.value = {
			author: props.book.author || "",
			title: props.book.title || "",
			picture: props.book.picture || "",
			category: props.book.category || [],
			price: props.book.price || 0,
			for_borrow: props.book.for_borrow || true,
			available: props.book.available || true,
		};
	}
</script>

<style scoped></style>
