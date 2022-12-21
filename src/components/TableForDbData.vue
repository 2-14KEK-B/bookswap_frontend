<template>
	<q-table
		ref="tableRef"
		v-model:selected="selected"
		grid
		grid-header
		:filter="filter"
		:title="componentProps.title"
		:loading="loading"
		selection="single"
		:rows="data"
		:columns="componentProps.columns"
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
					<q-icon :name="matSearch" />
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
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { AxiosError } from "axios";
	import { QTableProps, QTable } from "quasar";
	import $axios from "@api/axios";
	import { handle } from "@utils/error";
	import { useBookStore } from "@stores/book";
	import { useUserStore } from "@stores/user";
	import { useBorrowStore } from "@stores/borrow";
	import { useMessageStore } from "@stores/message";
	import { matSearch } from "@quasar/extras/material-icons";

	const bookStore = useBookStore();
	const userStore = useUserStore();
	const borrowStore = useBorrowStore();
	const messageStore = useMessageStore();
	const tableRef = ref();
	const selected = ref<{ _id: string }[]>([]);
	const loading = ref(false);
	const data = ref();
	const error = ref("");
	const filter = ref("");

	const componentProps = defineProps<{
		columns: QTableProps["columns"];
		title: QTableProps["title"];
		baseUrl: string;
	}>();

	async function getData() {
		return $axios
			.get(`/${componentProps.baseUrl}`, { transformResponse: (r) => r })
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
		// return $axios.patch(`${componentProps.baseUrl}/${selected.value[0]._id}`)
		console.log(`EDIT :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
	}

	async function deleteData() {
		if (componentProps.baseUrl == "book") {
			bookStore.deleteBook(selected.value[0]._id);
			console.log(`DELETE :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
		}
		if (componentProps.baseUrl == "user") {
			userStore.deleteUser(selected.value[0]._id);
			console.log(`DELETE :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
		}
		if (componentProps.baseUrl == "borrow") {
			borrowStore.deleteBorrow(selected.value[0]._id);
			console.log(`DELETE :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
		}
		if (componentProps.baseUrl == "message/all") {
			messageStore.deleteMessage(selected.value[0]._id);
			console.log(`DELETE :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
		}
		console.log(`DELETE :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
		// return $axios.delete(`${componentProps.baseUrl}/${selected.value[0]._id}`)
		// console.log(`DELETE :: ${componentProps.baseUrl}/${selected.value[0]._id}`);
	}

	onMounted(() => {
		tableRef.value.requestServerInteraction();
	});
</script>

<style scoped></style>
