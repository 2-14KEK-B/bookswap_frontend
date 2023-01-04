<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card class="full-width flex-center no-padding" style="height: calc(100vh - 50px)">
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
				<q-tab name="borrow" :label="`My's borrows`" />
				<q-tab name="rate" :label="`My's rates`" />
			</q-tabs>
			<q-tab-panels v-model="userTab" style="height: calc(100vh - 350px)">
				<q-tab-panel name="info" class="no-padding">
					<q-card flat class="full-height q-pa-lg">
						<p class="text-h4">
							Full Name:
							{{ userStore.loggedInUser?.fullname ? userStore.loggedInUser?.fullname : "You did not set your full name" }}
						</p>
						<h5>
							User Name:
							{{ userStore.loggedInUser?.username ? userStore.loggedInUser?.username : "You did not set your username" }}
						</h5>
						<h5>E-Mail: {{ userStore.loggedInUser?.email }}</h5>
						<h5>Registered: {{ getLocalDate(userStore.loggedInUser?.createdAt) }}</h5>
						<h5>Overall rates: {{ getRateSum(userStore.loggedInUser?.user_rates) }}</h5>
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
							<q-card v-for="rate in (userStore.loggedInUser?.user_rates?.from as UserRate[])" :key="rate._id">
								<q-card-section>
									<h6>
										From: {{ getDisplayName(rate.to as User) }}
										<q-avatar v-if="(rate.to as User).picture">
											<q-img :src="(rate.to as User).picture" />
										</q-avatar>
									</h6>
									<p>Rate: {{ rate.rate ? "Upvoted" : "Downvoted" }}</p>
									<p>Comment: {{ rate.comment }}</p>
								</q-card-section>
							</q-card>
						</q-tab-panel>
						<q-tab-panel name="to">
							<q-card v-for="rate in (userStore.loggedInUser?.user_rates?.to as UserRate[])" :key="rate._id">
								<q-card-section>
									<h6>
										From: {{ getDisplayName(rate.from as User) }}
										<q-avatar v-if="(rate.from as User).picture">
											<q-img :src="(rate.from as User).picture" />
										</q-avatar>
									</h6>
									<p>Rate: {{ rate.rate ? "Upvoted" : "Downvoted" }}</p>
									<p>Comment: {{ rate.comment }}</p>
								</q-card-section>
							</q-card>
						</q-tab-panel>
					</q-tab-panels>
				</q-tab-panel>
				<q-tab-panel class="no-padding" name="borrow">
					<q-card v-for="borrow in (userStore.loggedInUser?.borrows as Borrow[])" :key="borrow._id" flat bordered>
						<q-card-section>
							<div>
								From: {{ getDisplayName(borrow.from as User) }}
								<q-avatar v-if="(borrow.from as User).picture">
									<q-img :src="(borrow.from as User).picture" />
								</q-avatar>
							</div>
							<div>
								To: {{ getDisplayName(borrow.to as User) }}
								<q-avatar v-if="(borrow.to as User).picture">
									<q-img :src="(borrow.to as User).picture" />
								</q-avatar>
							</div>
							<q-list>
								<q-expansion-item label="Books:">
									<div class="row">
										<q-card v-for="book in (borrow.books as Book[])" :key="book._id" class="col-6">
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
									<div class="row">
										<q-card v-for="rate in (borrow.user_rates as UserRate[])" :key="rate._id" class="col-6">
											<q-card-section>
												<q-list>
													<div>
														From: {{ getDisplayName(borrow.from as User) }}
														<q-avatar v-if="(borrow.from as User).picture">
															<q-img :src="(borrow.from as User).picture" />
														</q-avatar>
													</div>
													<div>
														To: {{ getDisplayName(borrow.to as User) }}
														<q-avatar v-if="(borrow.to as User).picture">
															<q-img :src="(borrow.to as User).picture" />
														</q-avatar>
													</div>
													<div>Rate: {{ rate.from ? "Upvote" : "Downvote" }}</div>
													<div>Comment: {{ rate.comment }}</div>
												</q-list>
											</q-card-section>
										</q-card>
									</div>
								</q-expansion-item>
							</q-list>
						</q-card-section>
					</q-card>
				</q-tab-panel>
			</q-tab-panels>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useUserStore } from "@stores/user";
	import { getDisplayName, getLocalDate, getRateSum } from "@utils/userHelper";
	import type { Book } from "@interfaces/book";
	import type { Borrow } from "@interfaces/borrow";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";

	const userTab = ref("info");
	const rateTab = ref("to");

	const userStore = useUserStore();
</script>

<style scoped></style>
