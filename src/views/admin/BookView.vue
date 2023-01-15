<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="$t('book')"
				:columns="columns"
				:rows="data?.docs"
				:request="getData"
				:loading="loading"
				:rows-number="rowsNumber"
				@delete="deleteData"
				@edit="openEditModal"
				@paginate="getData"
			>
				{{ error }}
			</TableForDbData>
		</div>
	</q-page>
	<EditTableData
		v-if="editing"
		:title="$t('book')"
		:edit="editing"
		@close="closeEditModal"
		@edit="sendEdit"
		@reset="resetDataToDefault"
	>
		<q-input v-model="editedData.title" :label="$t('title')" />
		<q-input v-model="editedData.author" type="text" :label="$t('author')" />
		<q-input v-model="editedData.picture" type="url" :label="$t('picture')" />
		<q-input v-model="editedData.price" type="number" :label="$t('price')" suffix="Ft" step="100" min="0" />
		<q-toggle v-model="editedData.available" :label="$t('available')" />
		<q-select v-model="editedData.category" multiple :label="$t('category')" disable />
		<q-toggle v-model="editedData.for_borrow" :label="$t('forBorrow')" />
	</EditTableData>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useBookStore } from "@stores/book";
	import EditTableData from "@components/admin/EditTableData.vue";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import type { Book } from "@interfaces/book";
	import type { BookRate } from "@interfaces/bookRate";
	import type { QTableColumn } from "quasar";
	import type { PaginateResult, PathQuery } from "@interfaces/paginate";
	import { useI18n } from "vue-i18n";

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
	const data = ref<PaginateResult<Book>>();
	const editDefaultData = ref<Book>();
	const editedData = ref<ModifiableData>(emptyData);
	const error = ref("");
	const editing = ref(false);
	const loading = ref(true);
	const rowsNumber = ref<number | undefined>();
	const { t } = useI18n({ useScope: "global" });

	async function getData(query?: PathQuery) {
		const books = await bookStore.adminGetBooks(query);
		if (books) {
			data.value = books;
			rowsNumber.value = books.totalDocs;
			loading.value = false;
		}
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
		await bookStore.adminEditBookById(editedData.value, editDefaultData.value?._id as string);
		closeEditModal();
		await getData();
	}

	async function openEditModal(id: string) {
		const book = data.value?.docs.find((book) => book._id == id);
		editDefaultData.value = book;
		resetDataToDefault();
		editing.value = true;
	}

	function closeEditModal() {
		editDefaultData.value = undefined;
		editedData.value = emptyData;
		editing.value = false;
	}

	async function deleteData(ids: string[]) {
		ids.forEach(async (_id) => {
			await bookStore.adminDeleteBookById(_id);
			if (data.value) {
				data.value.docs = data.value.docs.filter((book) => book._id != _id);
			}
		});
	}

	const columns: QTableColumn<Book>[] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: t("createdAt"), sortable: true },
		{ field: "updatedAt", name: "updatedAt", label: t("updatedAt"), sortable: true },
		{ field: "author", name: "author", label: t("author"), sortable: true },
		{ field: "title", name: "title", label: t("title"), sortable: true },
		{ field: "picture", name: "picture", label: t("picture") },
		{
			field: "category",
			name: "category",
			label: t("category"),
			format: (val) => `[${val.join(", ")}]`,
		},
		{ field: "price", name: "price", label: t("price"), sortable: true },
		{ field: "available", name: "available", label: t("available"), sortable: true },
		{ field: "for_borrow", name: "for_borrow", label: t("forBorrow"), sortable: true },
		{
			field: "rates",
			name: "rates",
			label: t("rates"),
			format: (val: BookRate[]) => `[${val.map((r) => r._id).join(", ")}]`,
		},
		{ field: "__v", name: "__v", label: "__v" },
	];
</script>

<style scoped lang="scss"></style>
