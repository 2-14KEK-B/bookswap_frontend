<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData :columns="columns" title="Books" base-url="book" />
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import TableForDbData from "@components/TableForDbData.vue";
import { Book } from "@interfaces/book";
	import { QTableProps } from "quasar";

	const columns: QTableProps["columns"] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "created_on", name: "created_on", label: "created_on", sortable: true },
		{ field: "updated_on", name: "updated_on", label: "updated_on", sortable: true },
		{ field: "author", name: "author", label: "author", sortable: true },
		{ field: "title", name: "title", label: "title", sortable: true },
		{ field: "picture", name: "picture", label: "picture" },
		{ field: "category", name: "category", label: "category", format: (category: Book["ratings"]) => category?.join(", ") },
		{ field: "price", name: "price", label: "price", sortable: true },
		{ field: "available", name: "available", label: "available", sortable: true },
		{ field: "for_borrow", name: "for_borrow", label: "for_borrow", sortable: true },
		{ field: "ratings", name: "ratings", label: "ratings", format: (rating: Book["ratings"]) => rating?.join(", ") },
		{ field: "__v", name: "__v", label: "__v" },
	];
</script>

<style scoped lang="scss"></style>
