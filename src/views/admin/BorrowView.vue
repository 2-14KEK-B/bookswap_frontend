<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="'Borrow'"
				:columns="columns"
				:rows="borrows"
				:loading="loading"
				:request="getData"
				@delete="deleteData"
				@edit="openEditModal"
				@filter="filter"
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
	import { QTableProps } from "quasar";
	import $axios from "@api/axios";
	import { AxiosError } from "axios";
	import { useBorrowStore } from "@stores/borrow";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import EditTableData from "@components/admin/EditTableData.vue";
	import { Borrow } from "@interfaces/borrow";

	interface ModifiableData {
		verified?: boolean;
	}

	const borrowStore = useBorrowStore();
	const editDefaultData = ref<Borrow>();
	const editedData = ref<ModifiableData>({ verified: false });
	const borrows = ref<Borrow[]>([]);
	const error = ref("");
	const editing = ref(false);
	const loading = ref(true);

	async function getData() {
		try {
			const { status, data } = await $axios.get("borrow", { transformResponse: (res) => res });
			if (status < 400) {
				borrows.value = JSON.parse(data);
				loading.value = false;
			} else {
				console.log(`failed to get borrows: ${data}`);
			}
		} catch (err) {
			error.value = (err as AxiosError).message;
			console.log(err);
		}
	}

	function resetDataToDefault() {
		editedData.value = {
			verified: editDefaultData.value?.verified,
		};
	}

	function filter(keyword: string) {
		console.log(keyword);
	}

	async function sendEdit() {
		await borrowStore.editById(editedData.value, editDefaultData.value?._id);
		closeEditModal();
		await getData();
	}

	async function openEditModal(id: string) {
		const { data } = await $axios.get(`borrow/${id}`);
		editDefaultData.value = data;
		resetDataToDefault();
		editing.value = true;
	}

	function closeEditModal() {
		editDefaultData.value = undefined;
		editedData.value = { verified: false };
		editing.value = false;
	}

	async function deleteData(ids: string[]) {
		ids.forEach((_id) => {
			borrowStore.deleteById(_id);
		});
	}

	const columns: QTableProps["columns"] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: "createdAt", sortable: true },
		{ field: "updatedAt", name: "updatedAt", label: "updatedAt", sortable: true },
		{ field: "from_id", name: "from_id", label: "from_id" },
		{ field: "to_id", name: "to_id", label: "to_id" },
		{ field: "books", name: "books", label: "books", format: (book: Borrow["books"]) => book?.join(", ") },
		{ field: "verified", name: "verified", label: "verified" },
		// {
		// 	field: "user_ratings",
		// 	name: "user_ratings",
		// 	label: "user_ratings",
		// 	format: (rating: Borrow["user_ratings"]) => rating?.join(", "),
		// },
		{ field: "__v", name: "__v", label: "__v" },
	];
</script>

<style scoped lang="scss"></style>
