<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card flat square>
			<q-card-section class="text-center">
				<div class="text-h3">{{ getDisplayName(userStore.openedUser) }}'s profile</div>
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
							<q-tab label="User information" name="user_info" no-caps style="justify-content: initial; text-align: left" />
							<q-tab label="Upload books" name="uploaded_books" no-caps style="justify-content: initial; text-align: left" />
							<q-tab label="Borrowed books" name="borrowed_books" no-caps style="justify-content: initial; text-align: left" />
							<q-tab label="Lended books" name="lended_books" no-caps style="justify-content: initial; text-align: left" />
							<q-tab
								v-if="userStore.loggedInUser"
								label="Send a message"
								name="message"
								no-caps
								style="justify-content: initial; text-align: left"
							/>
						</q-tabs>
					</template>
					<template #after>
						<q-tab-panels v-model="tabs" animated swipeable>
							<q-tab-panel v-if="userStore.openedUser" name="user_info">
								<q-input v-model="userStore.openedUser.fullname" type="text" readonly label="Full name" />
								<q-input v-model="userStore.openedUser.username" type="text" readonly label="Username" />
								<q-input v-model="userStore.openedUser.email" type="email" readonly label="Username" />

								<q-input
									v-model="new Date(userStore.openedUser.createdAt as string).toString().split('GMT')[0]"
									type="text"
									readonly
									label="Registered at"
								/>
							</q-tab-panel>
							<q-tab-panel name="uploaded_books" class="q-pa-md row items-start q-gutter-md">
								<q-card v-for="book in uploadedBooks" :key="book._id">
									<q-card-section>{{ book.title }}</q-card-section>
									<q-card-section>
										<q-img :src="book.picture" width="50%"></q-img>
									</q-card-section>
								</q-card>
							</q-tab-panel>
							<q-tab-panel name="borrowed_books" class="q-pa-md row items-start q-gutter-md">
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
							</q-tab-panel>
							<q-tab-panel v-if="userStore.loggedInUser" name="message" class="q-pa-md row items-start q-gutter-md">
								<q-form class="q-pl-lg full-width" @submit="sendMessage">
									<q-input
										v-model="messageInput"
										type="textarea"
										class="q-mb-lg"
										placeholder="Type your message"
										autofocus
										autogrow
									/>
									<q-btn type="submit" label="Send" />
								</q-form>
							</q-tab-panel>
						</q-tab-panels>
					</template>
				</q-splitter>
			</q-card-section>

			<!-- <q-card-section></q-card-section>

			<q-separator dark inset />

			<q-card-section class="q-pa-md row items-start q-gutter-md">
				<q-card v-for="book in userBooks" :key="book._id" class="">
					<q-card-section>{{ book.title }}</q-card-section>
					<q-card-section>
						<q-img :src="book.picture" sizes="xs" width="20%"></q-img>
					</q-card-section>
				</q-card>
			</q-card-section>
			<q-card-actions align="center">
				<q-btn label="Send Message" @click="sendMessage" />
			</q-card-actions> -->
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useUserStore } from "@stores/user";
	import { useMessageStore } from "@stores/message";
	import { getDisplayName } from "@utils/userHelper";
	import type { Book } from "@interfaces/book";
	import type { Borrow } from "@interfaces/borrow";

	const messageStore = useMessageStore();
	const userStore = useUserStore();

	// const user = ref<User>();

	type TabNames = "user_info" | "uploaded_books" | "borrowed_books" | "lended_books" | "message";
	const tabs = ref<TabNames>("user_info");

	const uploadedBooks = ref<Book[]>([]);
	const borrowedBooks = ref<Book[]>([]);
	const lendedBooks = ref<Book[]>([]);
	const messageInput = ref("");
	const splitterWidth = ref(150);

	async function sendMessage() {
		if (messageInput.value.length == 0) {
			return;
		}
		await messageStore.sendMessageToUserId(messageInput.value, userStore.openedUser?._id as string);
	}

	onMounted(() => {
		uploadedBooks.value = userStore.openedUser?.books as Book[];
		(userStore.openedUser?.borrows as Borrow[])?.forEach((b: Borrow) => {
			if (b?.from == userStore.openedUser?._id) {
				lendedBooks.value.push(...(b.books as Book[]));
			} else {
				borrowedBooks.value.push(...(b.books as Book[]));
			}
		});
	});
</script>

<style scoped></style>
