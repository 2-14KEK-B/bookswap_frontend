<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<div>
			<q-input
				v-model.trim="keyWord"
				outlined
				dense
				style="max-width: 100%"
				placeholder="Search by title or author"
				@keydown.enter.prevent="searchByKeyword"
			>
				<template #append>
					<q-icon v-if="keyWord === ''" :name="matSearch" />
					<q-icon v-else :name="matClear" class="cursor-pointer" @click="keyWord = ''" />
				</template>
			</q-input>
		</div>
		<q-btn-group flat class="full-width flex justify-evenly q-my-md">
			<q-btn label="Offers" color="secondary" class="q-px-lg" @click.prevent="selectBooks('borrow')" />
			<q-btn label="Upload a new" :to="{ name: 'newBook' }" color="primary" class="q-px-lg" />
			<q-btn label="Wishes" color="secondary" class="q-px-lg" @click.prevent="selectBooks('lend')" />
		</q-btn-group>
		<div class="row">
			<div class="col">
				<div class="row q-col-gutter-md">
					<div v-for="book in books" :key="book._id" class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
						<q-card square>
							<q-img :src="book.picture" fit="cover" height="250px" />
							<q-card-section class="q-px-none">
								<div class="row items-center no-wrap">
									<div class="col">
										<q-item>
											<q-item-section>
												<q-item-label lines="1">{{ book.title }}</q-item-label>
												<q-item-label lines="1" caption>{{ book.author }}</q-item-label>
											</q-item-section>
										</q-item>
									</div>
									<div v-if="book.uploader != userStore.loggedInUser?._id" class="col-auto">
										<q-btn color="grey-7" round dense flat :icon="matMoreVert">
											<q-menu cover auto-close>
												<q-list>
													<q-item clickable>
														<q-item-section @click.prevent="router.push({ name: 'userProfile', params: { id: book.uploader } })">
															Uploader
														</q-item-section>
													</q-item>
												</q-list>
											</q-menu>
										</q-btn>
									</div>
								</div>
							</q-card-section>
							<q-btn-group spread>
								<q-btn
									flat
									outline
									no-caps
									label="Open"
									@click.prevent="router.push({ name: 'book', params: { id: book._id } })"
								/>
								<q-btn
									v-if="userStore.loggedInUser"
									flat
									outline
									no-caps
									:disable="!book.available"
									label="Borrow it"
									@click.prevent="router.push({ name: 'borrowBook', params: { id: book._id } })"
								/>
							</q-btn-group>
						</q-card>
					</div>
				</div>
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useUserStore } from "@stores/user";
	import { matMoreVert, matSearch, matClear } from "@quasar/extras/material-icons";
	import { useBookStore } from "@stores/book";
	import type { Book } from "@interfaces/book";

	const router = useRouter();
	const userStore = useUserStore();
	const bookStore = useBookStore();

	const books = ref<Book[]>();
	const keyWord = ref("");
	const selected = ref<"borrow" | "lend">("borrow");

	async function searchByKeyword() {
		const data = await bookStore.getBooks(`${selected.value}?keyword=${keyWord.value}`);
		books.value = data?.docs;
	}

	async function getBooks() {
		const data = await bookStore.getBooks(selected.value);
		books.value = data?.docs;
	}

	async function selectBooks(type: "borrow" | "lend") {
		selected.value = type;
		await getBooks();
	}

	onMounted(async () => {
		await getBooks();
	});
</script>

<style scoped></style>
