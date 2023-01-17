<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-tabs v-model="tab" no-caps align="justify">
			<q-tab name="uploader" label="Uploader" />
			<q-tab name="book" label="Book" />
			<q-tab name="other-books" :label="$q.screen.lt.sm ? 'Other books' : 'Other books from the uploader'" />
		</q-tabs>
		<q-tab-panels v-model="tab">
			<q-tab-panel name="uploader" class="no-padding" style="height: calc(100vh - 100px)">
				<q-tabs v-model="userTab" no-caps align="justify" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
					<q-tab name="info" label="User information" />
					<q-tab name="rate" :label="`${getDisplayName((bookStore.openedBook?.uploader as User))}'s rates`" />
				</q-tabs>
				<q-tab-panels v-model="userTab">
					<q-tab-panel name="info" class="no-padding" style="height: calc(100vh - 150px)">
						<q-card flat square class="full-height full-width q-pa-lg" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
							<p class="text-h4">
								Full Name:
								{{
									(bookStore.openedBook?.uploader as User)?.fullname
										? (bookStore.openedBook?.uploader as User)?.fullname
										: "Does not set his full name"
								}}
							</p>
							<h5>
								User Name:
								{{
									(bookStore.openedBook?.uploader as User)?.username
										? (bookStore.openedBook?.uploader as User)?.username
										: "Does not set his username"
								}}
							</h5>
							<h5>E-Mail: {{ (bookStore.openedBook?.uploader as User)?.email }}</h5>
							<h5>Registered: {{ getLocalDate((bookStore.openedBook?.uploader as User)?.createdAt) }}</h5>
							<h5>Overall rates: {{ getRateSum((bookStore.openedBook?.uploader as User)?.user_rates) }}</h5>
						</q-card>
					</q-tab-panel>
					<q-tab-panel name="rate" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<q-scroll-area style="height: calc(100vh - 180px)">
							<q-card
								v-for="rate in ((bookStore.openedBook?.uploader as User)?.user_rates?.to as UserRate[])"
								:key="rate._id"
								flat
								bordered
								class="q-mb-sm"
							>
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
						</q-scroll-area>
					</q-tab-panel>
				</q-tab-panels>
			</q-tab-panel>
			<q-tab-panel
				name="book"
				class="no-padding row items-stretch bg-grey-9"
				style="min-height: calc(100vh - 140px); margin-bottom: 40px"
			>
				<div class="row items-stretch full-width">
					<BookInfo v-if="bookStore.openedBook" />
					<q-btn-group spread class="fixed-bottom">
						<q-btn
							class="button"
							color="primary"
							no-caps
							padding="sm none"
							:label="
								bookStore.openedBook?.for_borrow
									? $q.screen.lt.sm
										? 'Borrow it'
										: 'Send borrow request'
									: $q.screen.lt.sm
									? 'Lend it'
									: 'Send lend request'
							"
							@click="sendBorrow"
						/>
						<q-btn
							v-if="bookStore.openedBook?.uploader"
							class="button"
							color="secondary"
							no-caps
							padding="sm none"
							:label="$q.screen.lt.sm ? 'Send message' : 'Send message to the uploader'"
							@click="appStore.messageModal = true"
						/>
					</q-btn-group>
				</div>
			</q-tab-panel>
			<q-tab-panel
				name="other-books"
				class="no-padding"
				style="height: calc(100vh - 100px)"
				:class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'"
			>
				<q-scroll-area v-if="otherBooks" class="full-height full-width q-pa-xs">
					<div class="row">
						<div class="col">
							<div class="row q-col-gutter-md">
								<div v-for="otherBook in otherBooks" :key="otherBook?._id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
									<q-card square flat bordered>
										<q-parallax
											:height="300"
											:src="otherBook?.picture || 'https://img.freepik.com/free-psd/book-cover-mockup_125540-572.jpg'"
										/>
										<q-card-section class="q-px-none">
											<div class="row items-center no-wrap">
												<div class="col">
													<q-item>
														<q-item-section>
															<q-item-label lines="1">{{ otherBook?.title }}</q-item-label>
															<q-item-label lines="1" caption>{{ otherBook?.author }}</q-item-label>
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
												@click.prevent="openBookInNewTab(otherBook?._id as string)"
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
	<NewMessage
		v-if="appStore.messageModal"
		:user-id="((bookStore.openedBook?.uploader as User)?._id as string)"
		:display-name="getDisplayName((bookStore.openedBook?.uploader as User))"
	/>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useAppStore } from "@stores/app";
	import { useBookStore } from "@stores/book";
	import { useBorrowStore } from "@stores/borrow";
	import { getDisplayName, getLocalDate, getRateSum } from "@utils/userHelper";
	import BookInfo from "@components/BookInfo.vue";
	import NewMessage from "@components/message/NewMessage.vue";
	import type { Book } from "@interfaces/book";
	import type { User } from "@interfaces/user";
	import type { UserRate } from "@interfaces/userRate";
	import type { CreateBorrow } from "@interfaces/borrow";

	const appStore = useAppStore();
	const bookStore = useBookStore();
	const borrowStore = useBorrowStore();
	const router = useRouter();
	const tab = ref("book");
	const userTab = ref("info");
	const otherBooks = ref<Book[]>([]);

	async function sendBorrow() {
		const book = bookStore.openedBook;
		if (book) {
			const borrowData: CreateBorrow = {
				books: [book._id as string],
			};
			const uploader = (book.uploader as User)._id as string;
			if (book.for_borrow) {
				borrowData["from"] = uploader;
			} else {
				borrowData["to"] = uploader;
			}
			await borrowStore.createBorrow(borrowData);

			router.push({ name: "home" });
		}
	}

	function getOtherBooksOfTheUser(books?: Book[]) {
		if (books) {
			books.some((b) => {
				if (b._id != bookStore.openedBook?._id) {
					otherBooks.value?.push(b);
					return true;
				}
				return false;
			});
		}
	}

	function openBookInNewTab(bookId: string) {
		const routeData = router.resolve({ name: "book", params: { id: bookId } });
		window.open(routeData.href, "_blank");
	}

	onMounted(() => {
		getOtherBooksOfTheUser((bookStore.openedBook?.uploader as User)?.books as Book[]);
	});
</script>

<style scoped lang="scss"></style>
