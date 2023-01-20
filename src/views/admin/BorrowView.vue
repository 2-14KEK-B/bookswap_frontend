<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="t('borrows')"
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
		:title="t('borrow')"
		:edit="editing"
		@close="closeEditModal"
		@edit="sendEdit"
		@reset="resetDataToDefault"
	>
		<q-toggle v-model="editedData.verified" :label="t('verified')" />
	</EditTableData>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useI18n } from "vue-i18n";
	import { useBorrowStore } from "@stores/borrow";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import EditTableData from "@components/admin/EditTableData.vue";
	import type { QTableColumn } from "quasar";
	import type { Borrow } from "@interfaces/borrow";
	import type { Book } from "@interfaces/book";
	import type { PaginateResult, PathQuery } from "@interfaces/paginate";

	const { t } = useI18n({
		messages: {
			en: {
				borrow: "Borrow",
				borrows: "Borrows",
				verified: "Verified",
				createdAt: "Date of creation",
				updatedAt: "Date of last edition",
				books: "Books",
				from: "Borrow from",
				to: "Lend to",
				userRates: "User rates",
			},
			hu: {
				borrow: "Kölcsönzés",
				borrows: "Kölcsönzések",
				verified: "Visszaigazolt",
				createdAt: "Létrehozás dátuma",
				updatedAt: "Legutóbbi szerkesztés időpontja",
				books: "Könyvek",
				from: "Tőle kölcsönözve",
				to: "Neki kölcsönadva",
				userRates: "Felhasználói értékelések",
			},
		},
	});

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
	const rowsNumber = ref<number>();
	// const { t } = useI18n({ useScope: "global" });

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
		await borrowStore.editBorrow(editedData.value, editDefaultData.value?._id as string);
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
		{ field: "createdAt", name: "createdAt", label: t("createdAt"), sortable: true },
		{ field: "updatedAt", name: "updatedAt", label: t("updatedAt"), sortable: true },
		{ field: "from", name: "from", label: t("from") },
		{ field: "to", name: "to", label: t("to") },
		{ field: "type", name: "type", label: "type" },
		{ field: "books", name: "books", label: t("books"), format: (book: Book[]) => book?.join(", ") },
		{ field: "verified", name: "verified", label: t("verified") },
		{
			field: "user_rates",
			name: "user_rates",
			label: t("userRates"),
			format: (val) => `[${val.join(", ")}]`,
		},
	];
</script>

<style scoped lang="scss"></style>
