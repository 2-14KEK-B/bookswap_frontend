<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="'Borrow'"
				:columns="columns"
				:rows="data?.docs"
				:loading="loading"
				:request="getData"
				:rows-number="rowsNumber"
				@delete="deleteData"
				@edit="openEditModal"
				@paginate="getData"
			/>
			{{ error }}
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
		<q-toggle v-model="editedData.verified" label="Available" />
	</EditTableData>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { QTableColumn } from "quasar";
	import { useBorrowStore } from "@stores/borrow";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import EditTableData from "@components/admin/EditTableData.vue";
	import { Borrow } from "@interfaces/borrow";
	import { Book } from "@interfaces/book";
	import { PaginateResult, PathQuery } from "@interfaces/paginate";

	interface ModifiableData {
		verified?: boolean;
	}

	const borrowStore = useBorrowStore();
	const editDefaultData = ref<Borrow>();
	const editedData = ref<ModifiableData>({ verified: false });
	const data = ref<PaginateResult<Borrow>>();
	const error = ref("");
	const editing = ref(false);
	const loading = ref(true);
	const rowsNumber = ref<number | undefined>();

	async function getData(query?: PathQuery) {
		const borrows = await borrowStore.adminGetBorrows(query);
		if (borrows) {
			data.value = borrows;
			rowsNumber.value = borrows.totalDocs;
			loading.value = false;
		}
	}

	function resetDataToDefault() {
		editedData.value = {
			verified: editDefaultData.value?.verified,
		};
	}

	async function sendEdit() {
		await borrowStore.editBorrow(editedData.value, editDefaultData.value?._id);
		closeEditModal();
		await getData();
	}

	async function openEditModal(id: string) {
		const borrow = data.value?.docs.find((borrow) => borrow._id == id);
		editDefaultData.value = borrow;
		resetDataToDefault();
		editing.value = true;
	}

	function closeEditModal() {
		editDefaultData.value = undefined;
		editedData.value = { verified: false };
		editing.value = false;
	}

	async function deleteData(ids: string[]) {
		ids.forEach(async (_id) => {
			await borrowStore.adminDeleteBorrow(_id);
		});
	}

	const columns: QTableColumn<Borrow>[] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: "createdAt", sortable: true },
		{ field: "updatedAt", name: "updatedAt", label: "updatedAt", sortable: true },
		{ field: "from", name: "from", label: "from" },
		{ field: "to", name: "to", label: "to" },
		{ field: "books", name: "books", label: "books", format: (book: Book[]) => book?.join(", ") },
		{ field: "verified", name: "verified", label: "verified" },
		{
			field: "user_rates",
			name: "user_rates",
			label: "user_rates",
			format: (val) => `[${val.join(", ")}]`,
		},
		{ field: "__v", name: "__v", label: "__v" },
	];
</script>

<style scoped lang="scss"></style>
