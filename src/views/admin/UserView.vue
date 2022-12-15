<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<q-table
				ref="tableRef"
				v-model:selected="selected"
				grid
				grid-header
				:filter="filter"
				title="title"
				:loading="loading"
				selection="single"
				:rows="data"
				:columns="columns"
				row-key="_id"
				:no-data-label="error"
				@request="getData"
			>
				<template #header="props">
					<q-tr :props="props">
						<q-th v-for="col in props.cols" :key="col.name" :props="props">
							{{ col.label }}
						</q-th>
					</q-tr>
				</template>
				<template #top-right>
					<q-btn v-if="selected.length" class="q-mx-sm" color="red" @click.prevent="deleteData">Delete</q-btn>
					<q-input
						v-model="filter"
						class="q-px-lg q-ml-lg"
						:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'"
						borderless
						dense
						debounce="300"
						placeholder="Search"
					>
						<template #append>
							<q-icon name="search" />
						</template>
					</q-input>
				</template>

				<template #item="props">
					<div
						class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
						:style="props.selected ? 'transform: scale(0.95);' : ''"
					>
						<q-card :class="props.selected ? ($q.dark.isActive ? 'bg-grey-10' : 'bg-gray-2') : ''">
							<q-card-section>
								<div>
									<q-checkbox v-model="props.selected" dense :label="`_id: ${props.row._id}`" />
									<q-btn color="green" @click.prevent="editData">Edit</q-btn>
								</div>
							</q-card-section>
							<q-separator />
							<q-list dense>
								<q-item v-for="col in props.cols.filter((col: any) => col.name !== 'desc')" :key="col.name">
									<q-item-section style="min-width: 100px">
										<q-item-label>{{ col.label }}:</q-item-label>
									</q-item-section>
									<q-item-section>
										<q-item-label caption lines="1">{{ col.value }}</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</q-card>
					</div>
				</template>
			</q-table>
		</div>
	</q-page>
	<EditTableDataVue v-if="editing" :user="selected[0]" :edit="editing" @close="editing = false" />
</template>

<script setup lang="ts">
	import { QTableProps } from "quasar";
	import { User } from "@interfaces/user";
	import { onMounted, ref } from "vue";
	import $axios from "@api/axios";
	import { AxiosError } from "axios";
	import { handle } from "@utils/error";
	import { useUserStore } from "@stores/user";
	import EditTableDataVue from "@components/admin/EditTableUser.vue";

	const userStore = useUserStore();
	const selected = ref<User[]>([]);
	const filter = ref("");
	const loading = ref(false);
	const data = ref([]);
	const error = ref("");
	const tableRef = ref();
	const editing = ref(false);

	async function getData() {
		return $axios
			.get("user", { transformResponse: (r) => r })
			.then((res) => {
				// console.log(res.data);
				data.value = JSON.parse(res.data);
			})
			.catch((e: AxiosError) => {
				error.value = e.message;
				handle(e);
			});
	}

	function editData() {
		editing.value = true;
		console.log(editing.value);
		// return $axios.patch(`${componentProps.baseUrl}/${selected.value[0]._id}`)
		// console.log(`EDIT :: user/${selected.value[0]._id}`);
	}

	async function deleteData() {
		userStore.deleteUser(selected.value[0]._id as string);
		console.log(`DELETE :: user/${selected.value[0]._id}`);
	}

	const columns: QTableProps["columns"] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: "createdAt" },
		{ field: "updatedAt", name: "updatedAt", label: "updatedAt" },
		{ field: "fullname", name: "fullname", label: "fullname" },
		{ field: "username", name: "username", label: "username" },
		{ field: "email", name: "email", label: "email" },
		{ field: "email_is_verified", name: "email_is_verified", label: "email_is_verified" },
		{ field: "locale", name: "locale", label: "locale" },
		{ field: "role", name: "role", label: "role" },
		{
			field: "books",
			name: "books",
			label: "books",
			format: (books: User["books"]) => books.join(", "),
		},
		{
			field: "messages",
			name: "messages",
			label: "messages",
			format: (messages: User["messages"]) => messages.join(", "),
		},
		{
			field: "borrows",
			name: "borrows",
			label: "borrows",
			format: (borrows: User["borrows"]) => borrows.join(", "),
		},
		{
			field: "rated_books",
			name: "rated_books",
			label: "rated_books",
			format: (rate: User["rated_books"]) => rate.join(", "),
		},
		// {
		// 	field: "user_ratings",
		// 	name: "user_ratings",
		// 	label: "user_ratings",
		// 	format: (ratings: User["user_ratings"]) => ratings.join(", "),
		// },
	];

	onMounted(() => {
		tableRef.value.requestServerInteraction();
	});
</script>

<style scoped lang="scss"></style>
