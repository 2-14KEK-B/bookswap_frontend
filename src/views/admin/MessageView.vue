<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData :columns="columns" title="Messages" base-url="message/all" />
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import TableForDbData from "@components/TableForDbData.vue";
	import { QTableProps } from "quasar";
	import { Message } from "@interfaces/message";

	const columns: QTableProps["columns"] = [
		{ field: "_id", name: "_id", label: "_id" },
		{
			field: "users",
			name: "users",
			label: "users",
			format: (user: Message["users"]) => user.join(", "),
		},
		{
			field: "message_contents",
			name: "message_contents",
			label: "message_contents",
			format: (contents: Message["message_contents"]) => contents.map((c) => c._id).join(", "),
		},
	];
</script>

<style scoped lang="scss"></style>
