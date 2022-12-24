<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				title="User	"
				:columns="columns"
				:rows="data"
				:loading="loading"
				:request="getData"
				@delete="deleteData"
				@edit="openEditModal"
				@filter="filter"
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
	import { QTableColumn } from "quasar";
	import { User } from "@interfaces/user";
	import { ref } from "vue";
	import $axios from "@api/axios";
	import { AxiosError } from "axios";
	import { handle } from "@utils/error";
	import { useUserStore } from "@stores/user";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import EditTableData from "@components/admin/EditTableData.vue";

	interface ModifiableData {
		username?: string;
		fullname?: string;
		picture?: string;
		email?: string;
	}
	const emptyData: ModifiableData = { email: "", fullname: "", picture: "", username: "" };

	const userStore = useUserStore();
	const data = ref<User[]>([]);
	const editDefaultData = ref<User>();
	const editedData = ref<ModifiableData>(emptyData);
	const error = ref("");
	const editing = ref(false);
	const loading = ref(true);

	async function getData() {
		return $axios
			.get("user", { transformResponse: (r) => r })
			.then((res) => {
				data.value = JSON.parse(res.data);
				loading.value = false;
			})
			.catch((e: AxiosError) => {
				error.value = e.message;
				handle(e);
			});
	}

	function filter(keyword: string) {
		console.log(keyword);
	}

	async function sendEdit() {
		await userStore.edit(editedData.value, editDefaultData.value?._id);
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
		const { data } = await $axios.get(`user/${id}`);
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
			userStore.deleteUser(_id as string);
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
			field: "user_ratings",
			name: "user_ratings",
			label: "user_ratings",
			format: (val) => val,
		},
	];
</script>

<style scoped lang="scss"></style>
