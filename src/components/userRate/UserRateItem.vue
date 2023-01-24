<template>
	<q-card-section>
		<div v-if="from" class="text-h6">
			{{ $t("rate.user.to", { user: getDisplayName(userRate.to as User) }) }}
			<ProfileAvatar :src="(userRate.to as User).picture" :alt="getDisplayName(userRate.to as User)" />
			<span class="absolute-top-right">
				<q-icon :name="matEdit" class="q-pr-md" @click.prevent="editUserRate" />
				<q-icon :name="matDelete" class="q-pr-md" @click.prevent="deleteUserRate" />
			</span>
		</div>
		<div v-else class="text-h6">
			{{ $t("rate.from", { user: getDisplayName(userRate.from as User) }) }}
			<ProfileAvatar :src="(userRate.from as User).picture" :alt="getDisplayName(userRate.from as User)" />
		</div>
		<q-separator />
		<p>
			{{ $t("rate.rate") }}:
			<q-icon v-if="userRate.rate" :name="matThumbUp" />
			<q-icon v-else :name="matThumbDown" />
		</p>
		<p>{{ $t("rate.comment") }}: {{ userRate.comment }}</p>
	</q-card-section>
</template>

<script setup lang="ts">
	import { useAppStore } from "@stores/app";
	import { useUserRateStore } from "@stores/userRate";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import { getDisplayName } from "@utils/userHelper";
	import { matThumbUp, matThumbDown, matEdit, matDelete } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";

	const props = defineProps<{ userRate: UserRate; from?: boolean }>();

	const appStore = useAppStore();
	const userRateStore = useUserRateStore();

	async function editUserRate() {
		userRateStore.userRateToEdit = props.userRate;
		appStore.editOrCreateUserRate = true;
	}

	async function deleteUserRate() {
		const userId = (props.userRate.to as User)._id,
			rateId = props.userRate._id,
			borrowId = props.userRate.borrow as string;
		if (userId && rateId) {
			await userRateStore.deleteUserRate(userId, rateId, borrowId);
		}
	}
</script>

<style scoped></style>
