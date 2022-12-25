<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="'Book'"
				:columns="columns"
				:rows="books"
				:request="getData"
				:loading="loading"
				@delete="deleteData"
				@edit="openEditModal"
				@filter="filter"
			>
				{{ error }}
			</TableForDbData>
		</div>
	</q-page>
	<EditTableData
		v-if="editing"
		title="Borrow"
		:edit="editing"
		@close="closeEditModal"
		@edit="sendEdit"
		@reset="resetDataToDefault"
	>
		<q-input v-model="editedData.title" label="Title" />
		<q-input v-model="editedData.author" type="text" label="Author" />
		<q-input v-model="editedData.picture" type="url" label="Picture" />
		<q-input v-model="editedData.price" type="number" label="Price" suffix="Ft" step="100" min="0" />
		<q-toggle v-model="editedData.available" label="Available" />
		<q-select v-model="editedData.category" multiple label="Category" disable />
		<q-toggle v-model="editedData.for_borrow" label="For Borrow" />
	</EditTableData>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import $axios from "@api/axios";
	import { useBookStore } from "@stores/book";
	import EditTableData from "@components/admin/EditTableData.vue";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import { Book, BookRating } from "@interfaces/book";
	import { QTableColumn } from "quasar";
	import { AxiosError } from "axios";

	interface ModifiableData {
		author?: string;
		title?: string;
		picture?: string;
		price?: number;
		category?: string[];
		for_borrow?: boolean;
		available?: boolean;
	}
	const emptyData: ModifiableData = {
		title: "",
		author: "",
		picture: "",
		price: 0,
		category: [],
		for_borrow: true,
		available: true,
	};

	const bookStore = useBookStore();
	const books = ref<Book[]>([]);
	const editDefaultData = ref<Book>();
	const editedData = ref<ModifiableData>(emptyData);
	const error = ref("");
	const editing = ref(false);
	const loading = ref(true);

	async function getData() {
		try {
			const { status, data } = await $axios.get("book", { transformResponse: (res) => res });
			if (status < 400) {
				books.value = JSON.parse(data);
				loading.value = false;
			} else {
				error.value = data;
				console.log(`failed to get books: ${data}`);
			}
		} catch (err) {
			error.value = (err as AxiosError).message;
			console.log(err);
		}
	}

	function filter(keyword: string) {
		console.log(keyword);
	}

	function resetDataToDefault() {
		editedData.value = {
			title: editDefaultData.value?.title,
			author: editDefaultData.value?.author,
			picture: editDefaultData.value?.picture,
			price: editDefaultData.value?.price,
			category: editDefaultData.value?.category,
			for_borrow: editDefaultData.value?.for_borrow,
			available: editDefaultData.value?.available,
		};
	}

	async function sendEdit() {
		await bookStore.edit(editedData.value, editDefaultData.value?._id as string);
		closeEditModal();
		await getData();
	}

	async function openEditModal(id: string) {
		const { data } = await $axios.get(`book/${id}`);
		editDefaultData.value = data;
		resetDataToDefault();
		editing.value = true;
	}

	function closeEditModal() {
		editDefaultData.value = undefined;
		editedData.value = emptyData;
		editing.value = false;
	}

	async function deleteData(ids: string[]) {
		ids.forEach((_id) => {
			bookStore.deleteBook(_id as string);
		});
	}

	const columns: QTableColumn<Book>[] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: "createdAt", sortable: true },
		{ field: "updatedAt", name: "updatedAt", label: "updatedAt", sortable: true },
		{ field: "author", name: "author", label: "author", sortable: true },
		{ field: "title", name: "title", label: "title", sortable: true },
		{ field: "picture", name: "picture", label: "picture" },
		{
			field: "category",
			name: "category",
			label: "category",
			format: (val) => `[${val.join(", ")}]`,
		},
		{ field: "price", name: "price", label: "price", sortable: true },
		{ field: "available", name: "available", label: "available", sortable: true },
		{ field: "for_borrow", name: "for_borrow", label: "for_borrow", sortable: true },
		{
			field: "ratings",
			name: "ratings",
			label: "ratings",
			format: (val: BookRating[]) => `[${val.map((r) => r._id).join(", ")}]`,
		},
		{ field: "__v", name: "__v", label: "__v" },
	];
</script>

<style scoped lang="scss"></style>
