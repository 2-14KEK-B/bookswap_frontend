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
				selection="multiple"
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
					<q-btn v-if="selected.length == 1" class="q-mx-sm" color="secondary" label="Edit" @click.prevent="editData" />
					<q-btn v-if="selected.length" class="q-mx-sm" color="red" label="Delete" @click.prevent="deleteData" />
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
	<EditTableBook v-if="editing" :book="selected[0]" :edit="editing" @close="editing = false" />
</template>

<script setup lang="ts">
	import EditTableBook from "@components/admin/EditTableBook.vue";
	import { Book } from "@interfaces/book";
	import { QTableProps } from "quasar";
	import { onMounted, ref } from "vue";
	import $axios from "@api/axios";
	import { AxiosError } from "axios";
	import { handle } from "@utils/error";
	import { useBookStore } from "@stores/book";

	const bookStore = useBookStore();
	const selected = ref<Book[]>([]);
	const filter = ref("");
	const loading = ref(false);
	const data = ref([]);
	const error = ref("");
	const tableRef = ref();
	const editing = ref(false);

	async function getData() {
		return $axios
			.get("book", { transformResponse: (r) => r })
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
		selected.value.forEach(({ _id }) => {
			bookStore.deleteBook(_id as string);
			console.log(`DELETE :: book/${_id}`);
		});
	}

	const columns: QTableProps["columns"] = [
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
			format: (category: Book["ratings"]) => category?.join(", "),
		},
		{ field: "price", name: "price", label: "price", sortable: true },
		{ field: "available", name: "available", label: "available", sortable: true },
		{ field: "for_borrow", name: "for_borrow", label: "for_borrow", sortable: true },
		{ field: "ratings", name: "ratings", label: "ratings", format: (rating: Book["ratings"]) => rating?.join(", ") },
		{ field: "__v", name: "__v", label: "__v" },
	];

	onMounted(() => {
		tableRef.value.requestServerInteraction();
	});
</script>

<style scoped lang="scss"></style>
