<template>
	<q-dialog v-model="isOpen" persistent @hide="emits('close', isOpen)">
		<q-card>
			<q-form @submit.prevent="editBook" @reset="reset">
				<q-input v-model="bookData.author" label="Author" clearable />
				<q-input v-model="bookData.title" label="Title" clearable />
				<q-input v-model="bookData.picture" label="Picture" clearable />
				<q-input v-model="bookData.price" label="Price" clearable />
				<q-checkbox v-model="bookData.available" label="Availabe?" clearable />
				<q-checkbox v-model="bookData.category" label="Category" clearable />
				<q-checkbox v-model="bookData.for_borrow" label="For Borrow" clearable />
				<q-btn type="submit">Edit</q-btn>
				<q-btn v-close-popup no-caps label="Close dialog" color="primary" />
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
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
	let defaultValue: ModifiableData;

	const bookData = ref<ModifiableData>({
		author: props.book.author || "",
		title: props.book.title || "",
		picture: props.book.picture || "",
		category: props.book.category,
		price: props.book.price,
		for_borrow: props.book.for_borrow ,
		available: props.book.available ,
	});
	async function editBook() {
		// let dataToSend: ModifiableData = {};
		// Object.keys(userData.value).forEach((x: string | keyof ModifiableData) => {
		// 	if (userData.value[x as keyof ModifiableData] != defaultValue[x as keyof ModifiableData]) {
		// 		dataToSend[x as keyof ModifiableData] = userData.value[x as keyof ModifiableData];
		// 	}
		// 	console.log(userData.value[x as keyof ModifiableData], defaultValue[x as keyof ModifiableData]);
		// });
		await bookStore.edit(bookData.value, props.book._id as string);
		emits("close", isOpen.value);
		// if (Object.keys(userData.value).length > 0) {
		// 	await router.push("/me");
		// }
	}

	function reset() {
		bookData.value = defaultValue;
	}

	onMounted(() => {
		defaultValue = {
			author: props.book.author || "",
			title: props.book.title || "",
			picture: props.book.picture || "",
			category: props.book.category || "",
			price: props.book.price,
			for_borrow: props.book.for_borrow,
			available: props.book.available,
		};
	});
</script>

<style scoped></style>
