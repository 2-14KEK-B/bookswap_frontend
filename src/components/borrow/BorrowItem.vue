<template>
	<q-card-section>
		<div v-if="type == 'borrow'" class="text-h6">
			{{ $t("borrow.from", { user: getDisplayName(borrow.from as User) }) }}
			<ProfileAvatar :src="(borrow.from as User).picture" :alt="getDisplayName(borrow.from as User)" />
			<span v-if="!borrow.verified" class="absolute-top-right">
				<q-icon
					v-if="canLoggedInVerifyBorrow(borrow)"
					:name="matEdit"
					class="q-pr-md"
					@click.prevent="editBorrow(borrow)"
				/>
				<q-icon
					:name="matDelete"
					class="q-pr-md"
					@click.prevent="deleteBorrow(borrow.type, (borrow.from as User)._id as string, borrow._id)"
				/>
			</span>
		</div>
		<div v-else class="text-h6">
			{{ $t("borrow.to", { user: getDisplayName(borrow.to as User) }) }}
			<ProfileAvatar :src="(borrow.to as User).picture" :alt="getDisplayName(borrow.to as User)" />
		</div>
		<div class="text-h6">
			{{ $t("borrow.verified") }}:
			<span class="text-italic">{{ borrow.verified ? $t("yes") : $t("no") }}</span>
		</div>
		<q-list>
			<q-expansion-item :label="$t('borrow.books')">
				<div class="row">
					<q-card v-for="book in (borrow.books as Book[])" :key="book._id" class="col-12">
						<q-card-section>
							<div>{{ $t("book.title") }}: {{ book.title }}</div>
							<div>{{ $t("book.author") }}: {{ book.author }}</div>
						</q-card-section>
						<q-img v-if="book.picture" :src="book.picture" style="max-height: 400px" fit="scale-down" />
						<q-skeleton v-else height="100px" />
					</q-card>
				</div>
			</q-expansion-item>
			<q-expansion-item :label="$t('rate.userRates')">
				<div v-if="borrow.user_rates && borrow.user_rates.length > 0" class="row">
					<q-card v-if="borrow.verified && !checkIfLoggedInHasRate(borrow.user_rates as UserRate[])" class="col-6 flex" flat>
						<q-btn class="full-width self-center" :label="$t('rate.user.create')" @click="newUserRate(borrow)" />
					</q-card>
					<q-card v-for="rate in (borrow.user_rates as UserRate[])" :key="rate._id" class="col-12 q-my-sm" flat bordered>
						<q-card-section>
							<q-list>
								<div>
									{{ $t("rate.from", { user: getDisplayName(rate.from as User) }) }}
									<ProfileAvatar :src="(rate.from as User).picture" :alt="getDisplayName(rate.from as User)" />
									<span v-if="(rate.from as User)._id == userStore.loggedInUser?._id" class="absolute-top-right">
										<q-icon :name="matEdit" class="q-pr-md" @click.prevent="editUserRate(rate)" />
										<q-icon :name="matDelete" class="q-pr-md" @click.prevent="deleteUserRate(rate)" />
									</span>
								</div>
								<div>
									{{ $t("rate.user.to", { user: getDisplayName(rate.to as User) }) }}
									<ProfileAvatar :src="(rate.to as User).picture" :alt="getDisplayName(rate.to as User)" />
								</div>
								<div>
									{{ $t("rate.rate") }}:
									<q-icon v-if="rate.rate" :name="matThumbUp" />
									<q-icon v-else :name="matThumbDown" />
								</div>
								<div>
									{{ $t("rate.comment") }}:
									<span class="text-italic">{{ rate.comment }}</span>
								</div>
							</q-list>
						</q-card-section>
					</q-card>
				</div>
				<div v-else-if="borrow.verified">
					<q-btn class="full-width self-center" :label="$t('rate.user.create')" @click="newUserRate(borrow)" />
				</div>
			</q-expansion-item>
		</q-list>
	</q-card-section>
	<UserRateModal
		v-if="appStore.editOrCreateUserRate"
		:borrow="borrowFrorUserRateCreating"
		:user-rate="userRateStore.userRateToEdit"
		:edit="!borrowFrorUserRateCreating"
	/>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useBorrowStore } from "@stores/borrow";
	import { useUserRateStore } from "@stores/userRate";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import UserRateModal from "@components/userRate/UserRateModal.vue";
	import { matEdit, matDelete, matThumbUp, matThumbDown } from "@quasar/extras/material-icons";
	import { getDisplayName } from "@utils/userHelper";
	import type { Book } from "@interfaces/book";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";
	import type { Borrow } from "@interfaces/borrow";

	defineProps<{ borrow: Borrow; type: "borrow" | "lend" }>();

	const appStore = useAppStore();
	const userStore = useUserStore();
	const borrowStore = useBorrowStore();
	const userRateStore = useUserRateStore();

	const borrowToEdit = ref<Borrow>();
	const borrowFrorUserRateCreating = ref<Borrow>();

	function newUserRate(borrow: Borrow) {
		borrowFrorUserRateCreating.value = borrow;
		appStore.editOrCreateUserRate = true;
	}

	async function editUserRate(rate: UserRate) {
		userRateStore.userRateToEdit = rate;
		appStore.editOrCreateUserRate = true;
	}

	async function deleteUserRate(rate: UserRate) {
		const userId = (rate.to as User)._id,
			rateId = rate._id,
			borrowId = rate.borrow as string;
		if (userId && rateId) {
			await userRateStore.deleteUserRate(userId, rateId, borrowId);
		}
	}

	async function editBorrow(borrow: Borrow) {
		borrowToEdit.value = borrow;
		if (borrowToEdit.value) {
			appStore.editBorrow = true;
		}
	}

	async function deleteBorrow(type: "borrow" | "lend", userId: string, borrowId: string) {
		await borrowStore.deleteBorrow(type, userId, borrowId);
	}

	function canLoggedInVerifyBorrow(borrow: Borrow) {
		let userWhoCanModify: User;
		if (borrow.type == "borrow") {
			userWhoCanModify = borrow.from as User;
		} else {
			userWhoCanModify = borrow.to as User;
		}
		return userWhoCanModify._id == userStore.loggedInUser?._id;
	}

	function checkIfLoggedInHasRate(rates?: UserRate[]) {
		if (rates) {
			const loggedInId = userStore.loggedInUser?._id;
			return rates.some((rate) => (rate.from as User)._id == loggedInId);
		}
	}
</script>

<style scoped></style>
