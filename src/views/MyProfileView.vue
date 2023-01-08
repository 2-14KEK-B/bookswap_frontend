<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card
			v-if="userStore.loggedInUser"
			flat
			square
			class="full-width flex-center no-padding"
			style="height: calc(100vh - 50px)"
		>
			<q-card-section class="text-center q-pt-sm bg-grey-9" style="height: 250px">
				<p class="text-h4">My account</p>
				<q-img
					class="q-pa-lg"
					:src="
						userStore.loggedInUser?.picture
							? userStore.loggedInUser.picture
							: 'https://pic.onlinewebfonts.com/svg/img_329115.png'
					"
					style="height: 150px; max-width: 150px"
				/>
			</q-card-section>
			<q-tabs v-model="userTab" no-caps align="justify" class="bg-grey-10">
				<q-tab name="info" label="My information" />
				<q-tab name="borrow" :label="`My's borrows`" :disable="borrowStore.loggedInBorrows.length == 0" />
				<q-tab
					name="rate"
					:label="`My's rates`"
					:disable="userRateStore.loggedInRates.from.length == 0 && userRateStore.loggedInRates.to.length == 0"
				/>
			</q-tabs>
			<q-tab-panels v-model="userTab" style="height: calc(100vh - 350px)">
				<q-tab-panel name="info" class="no-padding">
					<q-card flat class="full-height q-pa-lg">
						<p class="text-h5">
							Full Name:
							{{ userStore.loggedInUser?.fullname ? userStore.loggedInUser?.fullname : "You did not set your full name" }}
						</p>
						<div class="text-h5">
							User Name:
							{{ userStore.loggedInUser?.username ? userStore.loggedInUser?.username : "You did not set your username" }}
						</div>
						<div class="text-h5">E-Mail: {{ userStore.loggedInUser?.email }}</div>
						<div class="text-h5">Registered: {{ getLocalDate(userStore.loggedInUser?.createdAt) }}</div>
						<div class="text-h5">Overall rates: {{ getRateSum(userStore.loggedInUser?.user_rates) }}</div>
						<q-btn color="secondary" class="q-my-lg" label="Edit my profile" :to="{ name: 'editProfile' }" />
					</q-card>
				</q-tab-panel>
				<q-tab-panel class="no-padding" name="rate">
					<q-tabs v-model="rateTab" no-caps align="justify" class="bg-grey-9">
						<q-tab name="from" label="Rates from me" />
						<q-tab name="to" label="Rates about me" />
					</q-tabs>
					<q-tab-panels v-model="rateTab">
						<q-tab-panel name="from">
							<q-card v-for="rate in userRateStore.loggedInRates.from" :key="rate._id" flat bordered class="q-ma-sm">
								<q-card-section>
									<div class="text-h6">
										To: {{ getDisplayName(rate.to as User) }}
										<q-avatar v-if="(rate.to as User).picture">
											<q-img :src="(rate.to as User).picture" />
										</q-avatar>
										<span class="absolute-top-right">
											<q-icon :name="matEdit" class="q-pr-md" @click.prevent="editUserRate(rate)" />
											<q-icon :name="matDelete" class="q-pr-md" @click.prevent="deleteUserRate(rate)" />
										</span>
									</div>
									<q-separator />
									<p>Rate: {{ rate.rate ? "Upvoted" : "Downvoted" }}</p>
									<p>Comment: {{ rate.comment }}</p>
								</q-card-section>
							</q-card>
						</q-tab-panel>
						<q-tab-panel name="to">
							<q-card v-for="rate in userRateStore.loggedInRates.to" :key="rate._id" flat bordered class="q-ma-sm">
								<q-card-section>
									<div class="text-h6">
										From: {{ getDisplayName(rate.from as User) }}
										<q-avatar v-if="(rate.from as User).picture">
											<q-img :src="(rate.from as User).picture" />
										</q-avatar>
									</div>
									<q-separator />
									<p>Rate: {{ rate.rate ? "Upvoted" : "Downvoted" }}</p>
									<p>Comment: {{ rate.comment }}</p>
								</q-card-section>
							</q-card>
						</q-tab-panel>
					</q-tab-panels>
				</q-tab-panel>
				<q-tab-panel class="no-padding" name="borrow">
					<q-card
						v-for="borrow in (borrowStore.loggedInBorrows as Borrow[])"
						:key="borrow._id"
						flat
						bordered
						class="q-ma-sm"
					>
						<q-card-section>
							<div class="text-h6">
								From: {{ getDisplayName(borrow.from as User) }}
								<q-avatar v-if="(borrow.from as User).picture">
									<q-img :src="(borrow.from as User).picture" />
								</q-avatar>
								<span v-if="!borrow.verified" class="absolute-top-right">
									<!-- <q-icon :name="matEdit" class="q-pr-md" @click.prevent="" /> -->
									<q-icon :name="matDelete" class="q-pr-md" @click.prevent="deleteBorrow(borrow._id)" />
								</span>
							</div>
							<div class="text-h6">
								To: {{ getDisplayName(borrow.to as User) }}
								<q-avatar v-if="(borrow.to as User).picture">
									<q-img :src="(borrow.to as User).picture" />
								</q-avatar>
							</div>
							<div class="text-h6">
								Verified:
								<span class="text-italic">{{ borrow.verified }}</span>
							</div>
							<q-list>
								<q-expansion-item label="Books:">
									<div class="row">
										<q-card v-for="book in (borrow.books as Book[])" :key="book._id" class="col-12">
											<q-card-section>
												<div>Title: {{ book.title }}</div>
												<div>Author: {{ book.author }}</div>
											</q-card-section>
											<q-img v-if="book.picture" :src="book.picture" style="max-height: 100px" />
											<q-skeleton v-else height="100px" />
										</q-card>
									</div>
								</q-expansion-item>
								<q-expansion-item label="Rates:">
									<div v-if="borrow.user_rates && borrow.user_rates.length > 0" class="row">
										<q-card
											v-if="borrow.verified && !checkIfLoggedInHasRate(borrow.user_rates as UserRate[])"
											class="col-6 flex"
											flat
										>
											<q-btn class="full-width self-center" label="Rate the other user" @click="newUserRate(borrow)" />
										</q-card>
										<q-card v-for="rate in (borrow.user_rates as UserRate[])" :key="rate._id" class="col-12" flat bordered>
											<q-card-section>
												<q-list>
													<div>
														From: {{ getDisplayName(rate.from as User) }}
														<q-avatar v-if="(rate.from as User).picture">
															<q-img :src="(rate.from as User).picture" />
														</q-avatar>
													</div>
													<div>
														To: {{ getDisplayName(rate.to as User) }}
														<q-avatar v-if="(rate.to as User).picture">
															<q-img :src="(rate.to as User).picture" />
														</q-avatar>
													</div>
													<div>Rate: {{ rate.rate ? "Upvote" : "Downvote" }}</div>
													<div>
														Comment:
														<span class="text-italic">{{ rate.comment }}</span>
													</div>
												</q-list>
											</q-card-section>
										</q-card>
									</div>
									<div v-else-if="borrow.verified">
										<q-btn class="full-width self-center" label="Rate the other user" @click="newUserRate(borrow)" />
									</div>
								</q-expansion-item>
							</q-list>
						</q-card-section>
					</q-card>
				</q-tab-panel>
			</q-tab-panels>
		</q-card>
	</q-page>
	<EditUserRate v-if="appStore.editUserRate" :user-rate="userRateToEdit" />
	<NewUserRate v-if="borrowFrorUserRateCreating && appStore.createUserRate" :borrow="borrowFrorUserRateCreating" />
</template>

<script setup lang="ts">
	//TODO: saját borrow szerkesztése
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useBorrowStore } from "@stores/borrow";
	import { useUserRateStore } from "@stores/userRate";
	import { getDisplayName, getLocalDate, getRateSum } from "@utils/userHelper";
	import { matEdit, matDelete } from "@quasar/extras/material-icons";
	import NewUserRate from "@components/userRate/NewUserRate.vue";
	import EditUserRate from "@components/userRate/EditUserRate.vue";
	import type { Book } from "@interfaces/book";
	import type { Borrow } from "@interfaces/borrow";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";

	const appStore = useAppStore();
	const userStore = useUserStore();
	const borrowStore = useBorrowStore();
	const userRateStore = useUserRateStore();

	const userTab = ref("info");
	const rateTab = ref("to");
	const userRateToEdit = ref<UserRate>();
	const borrowFrorUserRateCreating = ref<Borrow>();

	function newUserRate(borrow: Borrow) {
		borrowFrorUserRateCreating.value = borrow;
		appStore.createUserRate = true;
	}

	async function editUserRate(rate: UserRate) {
		userRateToEdit.value = rate;
		if (userRateToEdit.value) {
			appStore.editUserRate = true;
		}
	}

	async function deleteUserRate(rate: UserRate) {
		const userId = (rate.to as User)._id,
			rateId = rate._id,
			borrowId = rate.borrow as string;
		if (userId && rateId) {
			await userRateStore.deleteUserRate(userId, rateId, borrowId);
		}
	}

	async function deleteBorrow(borrowId: string) {
		await borrowStore.deleteBorrow(borrowId);
	}

	function checkIfLoggedInHasRate(rates?: UserRate[]) {
		if (rates) {
			const loggedInId = userStore.loggedInUser?._id;
			return rates.some((rate) => (rate.from as User)._id == loggedInId);
		}
	}
</script>

<style scoped></style>
