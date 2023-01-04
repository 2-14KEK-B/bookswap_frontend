<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				title="User	"
				:columns="columns"
				:rows="data?.docs"
				:loading="loading"
				:request="getData"
				:rows-number="rowsNumber"
				@delete="deleteData"
				@edit="openEditModal"
				@paginate="getData"
			/>
		</div>
	</q-page>
	<EditTableData
		v-if="editing"
		title="User"
		:edit="editing"
		@close="closeEditModal"
		@edit="sendEdit"
		@reset="resetDataToDefault"
	>
		<q-input v-model="editedData.username" label="Username" />
		<q-input v-model="editedData.fullname" label="Fullname" />
		<q-input v-model="editedData.picture" label="Picture" />
		<q-input v-model="editedData.email" label="Email" />
		<div class="flex"></div>
	</EditTableData>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useUserStore } from "@stores/user";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import EditTableData from "@components/admin/EditTableData.vue";
	import type { User } from "@interfaces/user";
	import type { QTableColumn } from "quasar";
	import type { PaginateResult, PathQuery } from "@interfaces/paginate";

	interface ModifiableData {
		username?: string;
		fullname?: string;
		picture?: string;
		email?: string;
	}
	const emptyData: ModifiableData = { email: "", fullname: "", picture: "", username: "" };

	const userStore = useUserStore();
	const data = ref<PaginateResult<User>>();
	const editDefaultData = ref<User>();
	const editedData = ref<ModifiableData>(emptyData);
	const editing = ref(false);
	const loading = ref(true);
	const rowsNumber = ref<number | undefined>();

	async function getData(query?: PathQuery) {
		const users = await userStore.adminGetUsers(query);
		if (users) {
			data.value = users;
			rowsNumber.value = users.totalDocs;
			loading.value = false;
		}
	}

	async function sendEdit() {
		await userStore.adminEditUser(editDefaultData.value?._id as string, editedData.value);
		closeEditModal();
		await getData();
	}

	function resetDataToDefault() {
		editedData.value = {
			fullname: editDefaultData.value?.fullname,
			email: editDefaultData.value?.email,
			picture: editDefaultData.value?.picture,
			username: editDefaultData.value?.username,
		};
	}

	async function openEditModal(id: string) {
		const user = data.value?.docs.find((user) => user._id == id);
		editDefaultData.value = user;
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
			await userStore.adminDeleteUser(_id as string);
		});
	}

	const columns: QTableColumn<User>[] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: "createdAt" },
		{ field: "updatedAt", name: "updatedAt", label: "updatedAt" },
		{ field: "fullname", name: "fullname", label: "fullname" },
		{ field: "username", name: "username", label: "username" },
		{ field: "email", name: "email", label: "email" },
		{ field: "email_is_verified", name: "email_is_verified", label: "email_is_verified" },
		{ field: "locale", name: "locale", label: "locale" },
		// { field: "role", name: "role", label: "role", format: (val) => (val ? val : "user") },
		{
			field: "books",
			name: "books",
			label: "books",
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "messages",
			name: "messages",
			label: "messages",
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "borrows",
			name: "borrows",
			label: "borrows",
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "rated_books",
			name: "rated_books",
			label: "rated_books",
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "user_rates",
			name: "user_rates",
			label: "user_rates",
			format: (val) => val,
		},
	];
</script>

<style scoped lang="scss"></style>
