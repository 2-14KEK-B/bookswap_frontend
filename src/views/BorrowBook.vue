<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-tabs v-model="tab" no-caps align="justify">
			<q-tab name="uploader" label="Uploader" />
			<q-tab name="book" label="Book" />
			<q-tab name="other-books" :label="$q.platform.is.mobile ? 'Other books' : 'Other books from the uploader'" />
		</q-tabs>
		<q-tab-panels v-model="tab">
			<q-tab-panel name="uploader" class="no-padding" style="height: calc(100vh - 100px)">
				<q-tabs v-model="userTab" no-caps align="justify">
					<q-tab name="info" label="User information" />
					<q-tab name="rate" :label="`${getDisplayName(user)}'s rates`" />
				</q-tabs>
				<q-tab-panels v-model="userTab">
					<q-tab-panel name="info" class="no-padding" style="height: calc(100vh - 150px)">
						<q-card flat class="full-height full-width bg-grey-9 q-pa-lg">
							<p class="text-h4">Full Name: {{ user?.fullname ? user?.fullname : "Does not set his full name" }}</p>
							<h5>User Name: {{ user?.username ? user?.username : "Does not set his username" }}</h5>
							<h5>E-Mail: {{ user?.email }}</h5>
							<h5>Registered: {{ getLocalDate(user?.createdAt) }}</h5>
							<h5>Overall rates: {{ getRateSum(user?.user_rates) }}</h5>
						</q-card>
					</q-tab-panel>
					<q-tab-panel name="rate">
						<q-card v-for="rate in (user?.user_rates?.to as UserRate[])" :key="rate._id">
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
			<q-tab-panel name="book" class="no-padding" style="height: calc(100vh - 100px)">
				<q-card class="full-width full-height bg-grey-9">
					<q-img class="q-pa-lg" :src="book?.picture" style="height: 300px" />
					<q-card-section class="text-center">
						<h4>Title: {{ book?.title }}</h4>
						<h5>Author: {{ book?.author }}</h5>
						<p>Price: {{ book?.price }}HUF</p>
					</q-card-section>
					<q-btn-group spread class="fixed-bottom">
						<q-btn
							class="button"
							color="secondary"
							no-caps
							:label="$q.platform.is.mobile ? 'Check rates' : 'Check rates of this book'"
							@click.prevent="sendBorrow"
						/>
						<q-btn
							class="button"
							color="primary"
							no-caps
							:label="$q.platform.is.mobile ? 'Borrow it' : 'Send borrow request'"
							@click.prevent="sendBorrow"
						/>
						<q-btn
							class="button"
							color="secondary"
							no-caps
							:label="$q.platform.is.mobile ? 'Send message' : 'Send message to the uploader'"
						/>
					</q-btn-group>
				</q-card>
			</q-tab-panel>
			<q-tab-panel name="other-books" class="no-padding" style="height: calc(100vh - 100px)">
				<q-scroll-area class="full-height full-width q-pa-xs">
					<div class="row">
						<div class="col">
							<div class="row q-col-gutter-md">
								<div
									v-for="usersBook in (user?.books as Book[])"
									:key="usersBook._id"
									class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
								>
									<q-card square flat bordered>
										<q-parallax :height="300" :src="usersBook.picture" />
										<q-card-section class="q-px-none">
											<div class="row items-center no-wrap">
												<div class="col">
													<q-item>
														<q-item-section>
															<q-item-label lines="1">{{ usersBook.title }}</q-item-label>
															<q-item-label lines="1" caption>{{ usersBook.author }}</q-item-label>
														</q-item-section>
													</q-item>
												</div>
											</div>
										</q-card-section>
										<q-btn-group spread>
											<q-btn
												flat
												outline
												no-caps
												label="Open in new tab"
												@click.prevent="openBookInNewTab(usersBook._id as string)"
											/>
										</q-btn-group>
									</q-card>
								</div>
							</div>
						</div>
					</div>
				</q-scroll-area>
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { useBorrowStore } from "@stores/borrow";
	import { getDisplayName, getLocalDate, getRateSum } from "@utils/userHelper";
	import type { Book } from "@interfaces/book";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";

	const borrowStore = useBorrowStore();
	const route = useRoute();
	const router = useRouter();
	const book = ref<Book>();
	const user = ref<User>();
	const tab = ref("book");
	const userTab = ref("info");

	async function sendBorrow() {
		if (user.value && book.value) {
			const borrowData = { from: user.value._id as string, books: [book.value._id as string] };
			await borrowStore.createBorrow(borrowData);

			router.push({ name: "home" });
		}
	}

	function openBookInNewTab(bookId: string) {
		const routeData = router.resolve({ name: "book", params: { id: bookId } });
		window.open(routeData.href, "_blank");
	}

	onMounted(() => {
		book.value = route.meta.book;
		user.value = route.meta.user;
	});
</script>

<style scoped lang="scss"></style>
