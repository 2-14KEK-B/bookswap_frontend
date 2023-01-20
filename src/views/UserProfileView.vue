<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card flat square>
			<q-card-section class="text-center">
				<div class="text-h3">{{ $t("user.profile", { user: getDisplayName(userStore.openedUser) }) }}</div>
				<q-img
					class="q-pa-sm"
					:src="
						userStore.openedUser?.picture ? userStore.openedUser.picture : 'https://pic.onlinewebfonts.com/svg/img_329115.png'
					"
					width="100px"
				/>
			</q-card-section>

			<q-card-section style="min-height: 50vh">
				<q-splitter v-model="splitterWidth" unit="px" :limits="[150, 200]">
					<template #before>
						<q-tabs v-model="tabs" vertical align="left" class="full-width">
							<q-tab :label="$t('user.info')" name="user_info" no-caps style="justify-content: initial; text-align: left" />
							<q-tab
								:label="$t('book.others')"
								name="uploaded_books"
								no-caps
								style="justify-content: initial; text-align: left"
							/>
							<!-- <q-tab :label="$t('Borrowed books')" name="borrowed_books" no-caps style="justify-content: initial; text-align: left" />
							<q-tab :label="$t('Lended books')" name="lended_books" no-caps style="justify-content: initial; text-align: left" /> -->
							<q-tab
								v-if="userStore.loggedInUser"
								:label="$t('message.new', { user: getDisplayName(userStore.openedUser) })"
								name="message"
								no-caps
								style="justify-content: initial; text-align: left"
							/>
						</q-tabs>
					</template>
					<template #after>
						<q-tab-panels v-model="tabs" animated swipeable>
							<q-tab-panel v-if="userStore.openedUser" name="user_info">
								<q-input v-model="userStore.openedUser.fullname" type="text" readonly :label="$t('user.fullname')" />
								<q-input v-model="userStore.openedUser.username" type="text" readonly :label="$t('user.username')" />
								<q-input v-model="userStore.openedUser.email" type="email" readonly :label="$t('user.email')" />
								<q-input v-model="registeredAt" type="text" readonly :label="$t('user.registeredAt')" />
							</q-tab-panel>
							<q-tab-panel name="uploaded_books" class="q-pa-md row items-start q-gutter-md">
								<q-card v-for="book in uploadedBooks" :key="book._id">
									<q-card-section>{{ book.title }}</q-card-section>
									<q-card-section>
										<q-img :src="book.picture" width="50%"></q-img>
									</q-card-section>
								</q-card>
							</q-tab-panel>
							<!-- <q-tab-panel name="borrowed_books" class="q-pa-md row items-start q-gutter-md">
								<q-card v-for="book in borrowedBooks" :key="book._id">
									<q-card-section>{{ book.title }}</q-card-section>
									<q-card-section>
										<q-img :src="book.picture" width="50%"></q-img>
									</q-card-section>
								</q-card>
							</q-tab-panel>
							<q-tab-panel name="lended_books" class="q-pa-md row items-start q-gutter-md">
								<q-card v-for="book in lendedBooks" :key="book._id">
									<q-card-section>{{ book.title }}</q-card-section>
									<q-card-section>
										<q-img :src="book.picture" width="50%"></q-img>
									</q-card-section>
								</q-card>
							</q-tab-panel> -->
							<q-tab-panel v-if="userStore.loggedInUser" name="message" class="q-pa-md row items-start q-gutter-md">
								<q-form class="q-pl-lg full-width" @submit="sendMessage">
									<q-input
										v-model="messageInput"
										type="textarea"
										class="q-mb-lg"
										:placeholder="$t('message.placeholder')"
										autofocus
										autogrow
									/>
									<q-btn type="submit" :label="$t('button.send')" />
								</q-form>
							</q-tab-panel>
						</q-tab-panels>
					</template>
				</q-splitter>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref, computed } from "vue";
	import dayjs, { extend } from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat";
	import { useI18n } from "vue-i18n";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { getDisplayName } from "@utils/userHelper";
	import type { Book } from "@interfaces/book";
	// import type { Borrow } from "@interfaces/borrow";

	extend(localizedFormat);

	const messageStore = useMessageStore();
	const userStore = useUserStore();
	const { locale } = useI18n({ useScope: "global" });

	// const user = ref<User>();

	type TabNames = "user_info" | "uploaded_books" | "borrowed_books" | "lended_books" | "message";
	const tabs = ref<TabNames>("user_info");
	const registeredAt = computed(() =>
		dayjs(userStore.openedUser?.createdAt)
			.locale(locale.value as string)
			.format("LLLL"),
	);

	const uploadedBooks = ref<Book[]>([]);
	// const borrowedBooks = ref<Book[]>([]);
	// const lendedBooks = ref<Book[]>([]);
	const messageInput = ref("");
	const splitterWidth = ref(200);

	async function sendMessage() {
		if (messageInput.value.length == 0) {
			return;
		}
		await messageStore.sendMessageToUserId(messageInput.value, userStore.openedUser?._id as string);
	}

	onMounted(() => {
		uploadedBooks.value = userStore.openedUser?.books as Book[];
		// console.log(userStore.openedUser?.borrows);
		// (userStore.openedUser?.borrows as Borrow[])?.forEach((b: Borrow) => {
		// 	if (b.verified) {
		// 		console.log(b);
		// 		if (b?.from == userStore.openedUser?._id) {
		// 			lendedBooks.value.push(...(b.books as Book[]));
		// 		} else {
		// 			borrowedBooks.value.push(...(b.books as Book[]));
		// 		}
		// 	}
		// });
	});
</script>

<style scoped></style>
