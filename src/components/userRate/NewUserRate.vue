<template>
	<q-dialog v-model="appStore.createUserRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						<span class="text-italic">{{ $t("rate.title", { title: getDisplayName(otherUser) }) }}</span>
					</div>
				</q-toolbar-title>
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-toolbar>
			<q-card-section class="q-pt-none">
				<q-toggle v-model="rate" :label="$t('rate.rate')" />
				<q-input v-model="comment" :label="$t('rate.comment')" />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn v-close-popup flat :label="$t('button.send')" @click="sendRate" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useUserRateStore } from "@stores/userRate";
	import { getDisplayName } from "@utils/userHelper";
	import { matClose } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { Borrow } from "@interfaces/borrow";

	const props = defineProps<{ borrow?: Borrow }>();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const userRateStore = useUserRateStore();

	const otherUser = getOtherUser(props.borrow);

	const comment = ref("");
	const rate = ref(true);

	async function sendRate() {
		await userRateStore.createUserRate(otherUser?._id as string, props.borrow?._id as string, {
			rate: rate.value,
			comment: comment.value,
		});
		close();
	}

	function getOtherUser(borrow?: Borrow): User | undefined {
		const loggedInId = userStore.loggedInUser?._id;

		if (loggedInId && borrow?.from && borrow?.to) {
			return (borrow.from as User)._id == loggedInId ? (borrow.to as User) : (borrow.from as User);
		}
	}

	function close() {
		appStore.createUserRate = false;
	}
</script>

<style scoped></style>
