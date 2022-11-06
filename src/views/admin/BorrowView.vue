<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData :columns="columns" title="Borrows" base-url="borrow" />
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import TableForDbData from "@components/TableForDbData.vue";
	import { Borrow } from "@interfaces/borrow";
	import { QTableProps } from "quasar";

	const columns: QTableProps["columns"] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "time", name: "time", label: "time" },
		{ field: "from_id", name: "from_id", label: "from_id" },
		{ field: "to_id", name: "to_id", label: "to_id" },
		{ field: "books", name: "books", label: "books", format: (book: Borrow["books"]) => book?.join(", ") },
		{ field: "verified", name: "verified", label: "verified" },
		{
			field: "user_ratings",
			name: "user_ratings",
			label: "user_ratings",
			format: (rating: Borrow["user_ratings"]) => rating?.join(", "),
		},
		{ field: "__v", name: "__v", label: "__v" },
	];
</script>

<style scoped lang="scss"></style>
