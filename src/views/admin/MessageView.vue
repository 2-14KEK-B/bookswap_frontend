<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<TableForDbData
				:title="t('messages')"
				:columns="columns"
				:rows="data?.docs"
				:loading="loading"
				:rows-number="rowsNumber"
				:request="getData"
				:is-message="true"
				@delete="deleteData"
				@paginate="getData"
			/>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useI18n } from "vue-i18n";
	import { useMessageStore } from "@stores/message";
	import TableForDbData from "@components/admin/TableForDbData.vue";
	import type { QTableColumn } from "quasar";
	import type { Message, MessageContent } from "@interfaces/message";
	import type { PaginateResult, PathQuery } from "@interfaces/paginate";

	const { t } = useI18n({
		messages: {
			en: {
				messages: "Messages",
				createdAt: "Date of creation",
				updatedAt: "Date of last edition",
				users: "Users",
				messageContents: "Message contents",
			},
			hu: {
				messages: "Üzenetek",
				createdAt: "Létrehozás dátuma",
				updatedAt: "Legutóbbi szerkesztés időpontja",
				users: "Felhasználók",
				messageContents: "Üzenet tartalma",
			},
		},
	});
	const messageStore = useMessageStore();
	const data = ref<PaginateResult<Message>>();
	const loading = ref(true);
	const rowsNumber = ref<number>(0);
	// const { t } = useI18n({ useScope: "global" });

	async function getData(query?: PathQuery) {
		const messages = await messageStore.adminGetMessages(query);
		if (messages) {
			data.value = messages;
			rowsNumber.value = messages.totalDocs;
			loading.value = false;
		}
	}

	async function deleteData(ids: string[]) {
		ids.forEach(async (_id) => {
			await messageStore.adminDeleteMessage(_id as string);
		});
	}

	const columns: QTableColumn<Message>[] = [
		{ field: "_id", name: "_id", label: "_id" },
		{ field: "createdAt", name: "createdAt", label: t("createdAt"), sortable: true },
		{ field: "updatedAt", name: "updatedAt", label: t("updatedAt"), sortable: true },
		{
			field: "users",
			name: "users",
			label: t("users"),
			format: (val) => `[${val.join(", ")}]`,
		},
		{
			field: "message_contents",
			name: "message_contents",
			label: t("messageContents"),
			format: (val: MessageContent[]) => `[${val.map((c) => c._id).join(", ")}]`,
		},
	];
</script>

<style scoped lang="scss"></style>
