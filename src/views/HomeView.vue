<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<!-- <q-table v-model:selected="selectedBook" selection="single" :rows="allBook" row-key="_id"></q-table> -->
		<div v-if="userStore.loggedInUser" style="max-width: 100vw">
			<q-input v-model.trim="keyWord" outlined dense style="max-width: 100%" @keydown.enter.prevent="searchByKeyword">
				<template #append>
					<q-icon v-if="keyWord === ''" name="search" />
					<q-icon v-else name="clear" class="cursor-pointer" @click="keyWord = ''" />
				</template>
			</q-input>
		</div>
		<div class="flex row justify-evenly">
			<q-card v-for="book in books" :key="book._id" class="flex column q-my-lg" style="max-width: 400px">
				<q-card-section>
					<div class="row items-center no-wrap">
						<div class="col">
							<q-item>
								<q-item-section>
									<q-item-label>{{ book.title }}</q-item-label>
									<q-item-label caption>{{ book.author }}</q-item-label>
									<q-item-label caption>
										<q-badge class="q-pa-xs" :color="book.available ? 'green' : 'red'" style="font-size: small">
											{{ book.available ? "Available" : "Not available" }}
										</q-badge>
									</q-item-label>
								</q-item-section>
							</q-item>
						</div>
						<div class="col-auto">
							<q-btn color="grey-7" round flat icon="more_vert">
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

				<q-img :src="book.picture" />

				<q-card-actions align="around">
					<q-btn flat @click.prevent="router.push({ name: 'book', params: { id: book._id } })">Open book</q-btn>
					<q-btn flat :disable="!book.available">Borrow it</q-btn>
				</q-card-actions>
			</q-card>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import $axios from "@api/axios";
	import { useRouter } from "vue-router";
	import { Book } from "@interfaces/book";
	import { useUserStore } from "@stores/user";

	const router = useRouter();
	const userStore = useUserStore();
	const books = ref<Book[]>([]);
	const keyWord = ref("");

	function searchByKeyword() {
		$axios.get(`/book?keyword=${keyWord.value}`).then((res) => {
			books.value = res.data;
		});
	}

	onMounted(() => {
		$axios.get("/book").then((res) => {
			books.value = res.data;
		});
	});
</script>

<style scoped lang="scss"></style>
