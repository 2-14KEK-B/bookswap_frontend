<template>
	<q-dialog v-model="appStore.userRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						Rate
						<span class="text-italic">{{ getDisplayName(user) }}</span>
					</div>
				</q-toolbar-title>
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-toggle v-model="rate" label="Rate" />
				<q-input v-model="comment" label="Comment" />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn v-close-popup flat label="OK" @click="sendRate" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserRateStore } from "@stores/userRate";
	import { getDisplayName } from "@utils/userHelper";
	import { matClose } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";

	const props = defineProps<{ user?: User; borrowId?: string }>();
	const appStore = useAppStore();
	const userRateStore = useUserRateStore();

	const comment = ref("");
	const rate = ref(true);

	async function sendRate() {
		await userRateStore.createUserRate(
			{ rate: rate.value, comment: comment.value },
			props.user?._id as string,
			props.borrowId as string,
		);
		close();
	}

	function close() {
		appStore.userRate = false;
	}
</script>

<style scoped></style>
