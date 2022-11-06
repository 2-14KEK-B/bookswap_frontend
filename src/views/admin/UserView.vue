<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData :columns="columns" title="Users" base-url="user" />
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import TableForDbData from "@components/TableForDbData.vue";
	import { QTableProps } from "quasar";
	import { User } from "@interfaces/user";

	const columns: QTableProps["columns"] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "created_on", name: "created_on", label: "created_on" },
		{ field: "updated_on", name: "updated_on", label: "updated_on" },
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
			field: "user_ratings",
			name: "user_ratings",
			label: "user_ratings",
			format: (ratings: User["user_ratings"]) => ratings.join(", "),
		},
	];
</script>

<style scoped lang="scss"></style>