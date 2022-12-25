<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				title="Message"
				:columns="columns"
				:rows="data"
				:loading="loading"
				:request="getData"
				@delete="deleteData"
				@filter="filter"
			/>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import $axios from "@api/axios";
	import { useMessageStore } from "@stores/message";
	import { handle } from "@utils/error";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import { AxiosError } from "axios";
	import { QTableColumn } from "quasar";
	import { Message, MessageContent } from "@interfaces/message";

	const messageStore = useMessageStore();
	const data = ref<Message[]>([]);
	const error = ref("");
	const loading = ref(true);

	async function getData() {
		return $axios
			.get("message/all", { transformResponse: (r) => r })
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

	async function deleteData(ids: string[]) {
		ids.forEach((_id) => {
			messageStore.deleteMessage(_id as string);
		});
	}

	const columns: QTableColumn<Message>[] = [
		{ field: "_id", name: "_id", label: "_id" },
		{
			field: "users",
			name: "users",
			label: "users",
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "message_contents",
			name: "message_contents",
			label: "message_contents",
			format: (val: MessageContent[]) => `[${val.map((c) => c._id).join(", ")}]`,
		},
	];
</script>

<style scoped lang="scss"></style>
