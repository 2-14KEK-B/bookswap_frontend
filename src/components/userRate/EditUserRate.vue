<template>
	<q-dialog v-if="userStore.loggedInUser" v-model="appStore.editUserRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						Rate
						<span class="text-italic">{{ getDisplayName(userRate?.to as User) }}</span>
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
	import { ref, readonly } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useUserRateStore } from "@stores/userRate";
	import { matClose } from "@quasar/extras/material-icons";
	import { getDisplayName } from "@utils/userHelper";
	import type { User } from "@interfaces/user";
	import type { UserRate, ModifyUserRate } from "@interfaces/userRate";

	const props = defineProps<{ userRate?: UserRate }>();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const userRateStore = useUserRateStore();

	const comment = ref(props.userRate?.comment);
	const rate = ref(props.userRate?.rate);
	const defaults = readonly<UserRate | Record<string, never>>(props.userRate || {});

	async function sendRate() {
		const data: ModifyUserRate = {};
		if (rate.value != defaults.rate) {
			data["rate"] = rate.value;
		}
		if (comment.value && comment.value != defaults.comment) {
			if (comment.value?.length > 0) {
				data["comment"] = comment.value;
			}
		}
		if (data.comment || data.rate != undefined) {
			await userRateStore.editUserRate(
				(props.userRate?.to as User)._id as string,
				defaults._id as string,
				props.userRate?.borrow as string,
				data,
			);
			close();
		}
	}

	function close() {
		appStore.editUserRate = false;
	}
</script>

<style scoped></style>
