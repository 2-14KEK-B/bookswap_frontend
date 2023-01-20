<template>
	<q-table
		ref="tableRef"
		v-model:pagination="pagination"
		v-model:selected="selectedArray"
		grid
		:grid-header="$q.screen.gt.sm"
		:title="title"
		selection="multiple"
		:rows="rows"
		:columns="columns"
		row-key="_id"
		@request="onRequest"
	>
		<template #header="props">
			<q-tr :props="props">
				<q-th v-for="col in props.cols" :key="col.name" :props="props" auto-width>
					{{ col.label }}
				</q-th>
			</q-tr>
		</template>

		<template #top-right>
			<q-btn
				v-if="selectedArray.length == 1 && !isMessage"
				class="q-mx-sm"
				color="secondary"
				:label="t('button.edit')"
				@click.prevent="onEdit"
			/>
			<q-btn
				v-if="selectedArray.length"
				class="q-mx-sm"
				color="red"
				:label="t('button.delete')"
				@click.prevent="onDelete"
			/>
			<q-input v-model="filter" dense debounce="300" :placeholder="t('search')" type="text" @keydown.enter="onRequest">
				<template #append>
					<q-btn flat round :icon="matSearch" @click.prevent="onRequest" />
				</template>
			</q-input>
			<q-btn color="grey-7" round dense flat :icon="matMoreVert">
				<q-menu auto-close :offset="[50, 10]">
					<q-list>
						<q-item clickable>
							<q-item-section no-wrap @click="exportTable(columns, rows, title)">{{ t("export") }}</q-item-section>
						</q-item>
					</q-list>
				</q-menu>
			</q-btn>
		</template>

		<template #item="props">
			<div
				class="q-pa-xs col-xs-12 col-sm-12 col-md-6 col-lg-6 grid-style-transition"
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
							<q-item-section>
								<q-item-label overline>{{ col.label }}:</q-item-label>
							</q-item-section>
							<q-item-section>
								<q-item-label caption>{{ col.value }}</q-item-label>
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
	import { useI18n } from "vue-i18n";
	import { QTableProps, QTable } from "quasar";
	import { matSearch, matMoreVert } from "@quasar/extras/material-icons";
	import exportTable from "@utils/exportTable";
	import type { PathQuery } from "@interfaces/paginate";

	const { t } = useI18n({
		messages: {
			en: {
				button: {
					delete: "Delete",
					edit: "Modify",
				},
				editing: "Editing a {title}",
				export: "Export table to CSV",
				search: "Search",
			},
			hu: {
				button: {
					delete: "Törlés",
					edit: "Módosítás",
				},
				editing: "Egy {title} módosítása",
				export: "Tábla kiexportálása CSV-be",
				search: "Keresés",
			},
		},
	});

	interface Table {
		columns: QTableProps["columns"];
		title: QTableProps["title"];
		rows: QTableProps["rows"];
		rowsNumber: number;
		isMessage?: boolean;
	}

	const componentProps = withDefaults(defineProps<Table>(), { isMessage: false });

	const tableRef = ref();
	const selectedArray = ref<{ _id: string }[]>([]);
	const filter = ref("");
	const pagination = ref<QTableProps["pagination"]>({
		sortBy: "createdAt",
		descending: true,
		page: 1,
		rowsPerPage: 10,
		rowsNumber: componentProps.rowsNumber,
	});

	const emits = defineEmits<{
		(e: "edit", id: string): void;
		(e: "delete", ids: string[]): void;
		(e: "paginate", quary: PathQuery): void;
	}>();

	function onEdit() {
		emits("edit", selectedArray.value[0]._id);
		selectedArray.value = [];
	}
	function onDelete() {
		emits(
			"delete",
			selectedArray.value.map((selected) => selected._id),
		);
		selectedArray.value = [];
	}

	function onRequest() {
		const page = pagination.value?.page as number;
		const limit = pagination.value?.rowsPerPage as number;
		const sort = pagination.value?.descending ? "desc" : "asc";

		const query: PathQuery = {
			skip: limit * (page - 1),
			limit: limit,
			sort: sort,
			sortBy: pagination.value?.sortBy,
			keyword: filter.value,
		};

		emits("paginate", query);
	}

	onMounted(() => {
		tableRef.value.requestServerInteraction();
	});
</script>

<style scoped></style>
