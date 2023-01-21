<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card
			v-if="userStore.loggedInUser"
			flat
			square
			class="full-width flex-center no-padding"
			style="height: calc(100vh - 50px)"
		>
			<q-card-section
				class="text-center q-pt-sm"
				:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
				style="height: 180px"
			>
				<p class="text-h4">{{ $t("me.profile") }}</p>
				<ProfileAvatar :size="100" :src="userStore.loggedInUser?.picture" :alt="getDisplayName(userStore.loggedInUser)" />
			</q-card-section>
			<q-tabs v-model="userTab" no-caps align="justify" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
				<q-tab name="info" :label="$t('me.info')" />
				<q-tab name="borrow" :label="$t(`me.borrows`)" :disable="borrowStore.loggedInBorrows.length == 0" />
				<q-tab
					name="rate"
					:label="$t(`me.rates`)"
					:disable="userRateStore.loggedInRates.from.length == 0 && userRateStore.loggedInRates.to.length == 0"
				/>
			</q-tabs>
			<q-tab-panels
				v-model="userTab"
				style="height: calc(100vh - 278px)"
				:class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'"
			>
				<q-tab-panel class="no-padding" name="info" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
					<q-card flat class="full-height q-pa-lg" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<p class="text-h5">
							{{ $t("user.fullname") }}:
							{{ userStore.loggedInUser?.fullname ? userStore.loggedInUser?.fullname : "-" }}
						</p>
						<div class="text-h5">
							{{ $t("user.username") }}:
							{{ userStore.loggedInUser?.username ? userStore.loggedInUser?.username : "-" }}
						</div>
						<div class="text-h5">{{ $t("user.email") }}: {{ userStore.loggedInUser?.email }}</div>
						<div class="text-h5">
							{{ $t("user.registeredAt") }}:
							{{ dayjs(userStore.loggedInUser?.createdAt).locale($i18n.locale).format("LLLL") }}
						</div>
						<div class="text-h5">{{ $t("rate.overallRate") }}: {{ getRateSum(userStore.loggedInUser?.user_rates) }}</div>
						<q-btn color="secondary" class="q-my-lg" :label="$t('me.edit')" :to="{ name: 'editProfile' }" />
					</q-card>
				</q-tab-panel>
				<q-tab-panel class="no-padding" name="rate" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
					<q-tabs v-model="rateTab" no-caps align="justify" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<q-tab name="from" :label="$t('me.ratesFrom')" />
						<q-tab name="to" :label="$t('me.ratesAbout')" />
					</q-tabs>
					<q-tab-panels v-model="rateTab" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<q-tab-panel name="from">
							<q-card v-for="rate in userRateStore.loggedInRates.from" :key="rate._id" flat bordered class="q-ma-sm">
								<q-card-section>
									<div class="text-h6">
										{{ $t("rate.user.to", { user: getDisplayName(rate.to as User) }) }}
										<ProfileAvatar :src="(rate.to as User).picture" :alt="getDisplayName(rate.to as User)" />
										<span class="absolute-top-right">
											<q-icon :name="matEdit" class="q-pr-md" @click.prevent="editUserRate(rate)" />
											<q-icon :name="matDelete" class="q-pr-md" @click.prevent="deleteUserRate(rate)" />
										</span>
									</div>
									<q-separator />
									<p>
										{{ $t("rate.rate") }}:
										<q-icon v-if="rate.rate" :name="matThumbUp" />
										<q-icon v-else :name="matThumbDown" />
									</p>
									<p>{{ $t("rate.comment") }}: {{ rate.comment }}</p>
								</q-card-section>
							</q-card>
						</q-tab-panel>
						<q-tab-panel name="to">
							<q-card v-for="rate in userRateStore.loggedInRates.to" :key="rate._id" flat bordered class="q-ma-sm">
								<q-card-section>
									<div class="text-h6">
										{{ $t("rate.from", { user: getDisplayName(rate.from as User) }) }}
										<ProfileAvatar :src="(rate.from as User).picture" :alt="getDisplayName(rate.from as User)" />
									</div>
									<q-separator />
									<p>
										{{ $t("rate.rate") }}:
										<q-icon v-if="rate.rate" :name="matThumbUp" />
										<q-icon v-else :name="matThumbDown" />
									</p>
									<p>{{ $t("rate.comment") }}: {{ rate.comment }}</p>
								</q-card-section>
							</q-card>
						</q-tab-panel>
					</q-tab-panels>
				</q-tab-panel>
				<q-tab-panel class="q-pa-sm" name="borrow" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
					<q-card v-for="borrow in (borrowStore.loggedInBorrows as Borrow[])" :key="borrow._id" flat class="q-ma-sm">
						<q-card-section>
							<div class="text-h6">
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
							<div class="text-h6">
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
										<q-card
											v-if="borrow.verified && !checkIfLoggedInHasRate(borrow.user_rates as UserRate[])"
											class="col-6 flex"
											flat
										>
											<q-btn class="full-width self-center" :label="$t('rate.user.create')" @click="newUserRate(borrow)" />
										</q-card>
										<q-card v-for="rate in (borrow.user_rates as UserRate[])" :key="rate._id" class="col-12" flat bordered>
											<q-card-section>
												<q-list>
													<div>
														{{ $t("rate.from", { user: getDisplayName(rate.from as User) }) }}
														<ProfileAvatar :src="(rate.from as User).picture" :alt="getDisplayName(rate.from as User)" />
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
					</q-card>
				</q-tab-panel>
			</q-tab-panels>
		</q-card>
	</q-page>
	<EditUserRate v-if="appStore.editUserRate" :user-rate="userRateToEdit" />
	<EditBorrow v-if="appStore.editBorrow" :borrow="borrowToEdit" />
	<NewUserRate v-if="borrowFrorUserRateCreating && appStore.createUserRate" :borrow="borrowFrorUserRateCreating" />
</template>

<script setup lang="ts">
	//TODO: saját borrow szerkesztése
	import { ref } from "vue";
	import { Notify } from "quasar";
	import socket from "@api/socket";
	import dayjs, { extend } from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useBorrowStore } from "@stores/borrow";
	import { useUserRateStore } from "@stores/userRate";
	import { getDisplayName, getRateSum } from "@utils/userHelper";
	import { matEdit, matDelete } from "@quasar/extras/material-icons";
	import { matThumbDown, matThumbUp } from "@quasar/extras/material-icons";
	import NewUserRate from "@components/userRate/NewUserRate.vue";
	import EditUserRate from "@components/userRate/EditUserRate.vue";
	import EditBorrow from "@components/borrow/EditBorrow.vue";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import type { Book } from "@interfaces/book";
	import type { Borrow } from "@interfaces/borrow";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";

	extend(localizedFormat);

	const appStore = useAppStore();
	const userStore = useUserStore();
	const borrowStore = useBorrowStore();
	const userRateStore = useUserRateStore();

	const userTab = ref("info");
	const rateTab = ref("to");
	const userRateToEdit = ref<UserRate>();
	const borrowToEdit = ref<Borrow>();
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

	async function editBorrow(borrow: Borrow) {
		borrowToEdit.value = borrow;
		if (borrowToEdit.value) {
			appStore.editBorrow = true;
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

	socket.on("borrow-updated", async () => {
		Notify.create({
			message: "Borrows are changed",
			position: "bottom",
			multiLine: false,
			timeout: 10000,
			actions: [
				{
					label: "Reload data",
					handler: async () => {
						await userStore.getLoggedIn();
					},
				},
			],
		});
	});
	socket.on("user-rate-updated", async () => {
		Notify.create({
			message: "User rates are changed",
			position: "bottom",
			multiLine: false,
			timeout: 10000,
			actions: [
				{
					label: "Reload data",
					handler: async () => {
						await userStore.getLoggedIn();
					},
				},
			],
		});
	});
</script>

<style scoped></style>