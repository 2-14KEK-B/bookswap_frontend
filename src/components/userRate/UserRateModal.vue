<template>
	<q-dialog v-if="userStore.loggedInUser" v-model="appStore.editOrCreateUserRate" persistent @escape-key="close">
		<q-card style="min-width: 300px">
			<q-toolbar>
				<q-toolbar-title>
					<div class="text-h6">
						<span v-if="userRate" class="text-italic">
							{{ $t("rate.title", { title: getDisplayName(userRate.to as User) }) }}
						</span>
						<span v-if="borrow" class="text-italic">{{ $t("rate.title", { title: getDisplayName(otherUser) }) }}</span>
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
	import { ref, readonly, onMounted } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useUserRateStore } from "@stores/userRate";
	import { getDisplayName } from "@utils/userHelper";
	import { matClose } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { UserRate, ModifyUserRate } from "@interfaces/userRate";
	import type { Borrow } from "@interfaces/borrow";

	const props = defineProps<{ userRate?: UserRate; borrow?: Borrow; edit: boolean }>();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const userRateStore = useUserRateStore();

	const comment = ref("");
	const rate = ref(true);
	const otherUser = ref<User>();
	const defaults = readonly<UserRate | Record<string, never>>(props.userRate || {});

	function getOtherUser(borrow?: Borrow): User | undefined {
		const loggedInId = userStore.loggedInUser?._id;

		if (loggedInId && borrow?.from && borrow?.to) {
			return (borrow.from as User)._id == loggedInId ? (borrow.to as User) : (borrow.from as User);
		}
	}

	async function sendRate() {
		if (props.edit) {
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
			}
		} else {
			await userRateStore.createUserRate(otherUser.value?._id as string, props.borrow?._id as string, {
				rate: rate.value,
				comment: comment.value,
			});
		}

		close();
	}

	function close() {
		appStore.editOrCreateUserRate = false;
	}

	onMounted(() => {
		if (props.edit && props.userRate) {
			if (props.userRate.comment) {
				comment.value = props.userRate.comment;
			}
			rate.value = props.userRate.rate;
		} else {
			otherUser.value = getOtherUser(props.borrow);
		}
	});
</script>

<style scoped></style>
