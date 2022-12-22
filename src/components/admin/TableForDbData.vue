<template>
	<q-table
		ref="tableRef"
		v-model:selected="selected"
		grid
		:grid-header="$q.screen.gt.sm"
		:filter="filter"
		:title="title"
		selection="multiple"
		:rows="rows"
		:columns="columns"
		row-key="_id"
		@request="request"
	>
		<template #header="props">
			<q-tr :props="props">
				<q-th v-for="col in props.cols" :key="col.name" :props="props" auto-width>
					{{ col.label }}
				</q-th>
			</q-tr>
		</template>

		<template #top-right>
			<q-btn v-if="selected.length == 1" class="q-mx-sm" color="secondary" @click.prevent="emits('edit', selected[0]._id)">
				Modify
			</q-btn>
			<q-btn
				v-if="selected.length"
				class="q-mx-sm"
				color="red"
				@click.prevent="
					emits(
						'delete',
						selected.map((s) => s._id),
					)
				"
			>
				Delete
			</q-btn>
			<q-input
				v-model="filter"
				class="q-px-lg q-ml-lg"
				:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'"
				borderless
				dense
				debounce="300"
				placeholder="Search"
				@keydown.enter="emits('filter', filter)"
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

		<!-- <template #no-data>
			<slot></slot>
		</template> -->
	</q-table>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { QTableProps, QTable } from "quasar";
	import { matSearch } from "@quasar/extras/material-icons";

	const tableRef = ref();
	const selected = ref<{ _id: string }[]>([]);
	const filter = ref("");

	defineProps<{
		columns: QTableProps["columns"];
		title: QTableProps["title"];
		rows: QTableProps["rows"];
		request: () => void;
	}>();

	const emits = defineEmits<{
		(e: "edit", id: string): void;
		(e: "delete", ids: string[]): void;
		(e: "filter", keyword: string): void;
	}>();

	onMounted(() => {
		tableRef.value.requestServerInteraction();
	});
</script>

<style scoped></style>
