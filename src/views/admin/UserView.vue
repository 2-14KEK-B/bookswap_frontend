<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="$t('user')"
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
		:title="$t('user')"
		:edit="editing"
		@close="closeEditModal"
		@edit="sendEdit"
		@reset="resetDataToDefault"
	>
		<q-input v-model="editedData.username" :label="$t('username')" />
		<q-input v-model="editedData.fullname" :label="$t('fullname')" />
		<q-input v-model="editedData.picture" :label="$t('picture')" />
		<q-input v-model="editedData.email" :label="$t('email')" />
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
	import { useI18n } from "vue-i18n";

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
	const { t } = useI18n({ useScope: "global" });

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
		{ field: "createdAt", name: "createdAt", label: t("createdAt") },
		{ field: "updatedAt", name: "updatedAt", label: t("updatedAt") },
		{ field: "fullname", name: "fullname", label: t("fullname") },
		{ field: "username", name: "username", label: t("username") },
		{ field: "email", name: "email", label: t("email") },
		{ field: "email_is_verified", name: "email_is_verified", label: t("emailVerified") },
		{ field: "locale", name: "locale", label: t("locale") },
		// { field: "role", name: "role", label: "role", format: (val) => (val ? val : "user") },
		{
			field: "books",
			name: "books",
			label: t("books"),
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "messages",
			name: "messages",
			label: t("messages"),
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "borrows",
			name: "borrows",
			label: t("borrows"),
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "rated_books",
			name: "rated_books",
			label: t("ratedBooks"),
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "user_rates",
			name: "user_rates",
			label: t("userRates"),
			format: (val) => val,
		},
	];
</script>

<style scoped lang="scss"></style>
