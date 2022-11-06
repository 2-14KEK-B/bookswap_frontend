<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<!-- <q-table v-model:selected="selectedBook" selection="single" :rows="allBook" row-key="_id"></q-table> -->
		<div class="flex row justify-evenly">
			<q-card v-for="book in books" :key="book._id" class="flex q-my-lg" style="max-width: 400px">
				<q-card-section>
					<q-img class="q-ma-sm" width="106px" height="150" :src="book.picture"></q-img>
				</q-card-section>

				<q-card-section>
					<div class="q-ma-lg">
						<q-badge class="q-pa-xs" :color="book.available ? 'green' : 'red'" style="font-size: small">
							{{ book.available ? "Elérhető" : "Nem elérhető" }}
						</q-badge>
						<p>{{ book.author }} - {{ book.title }}</p>
						some other info....
					</div>
				</q-card-section>
			</q-card>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import $axios from "@api/axios";
	import { Book } from "@interfaces/book";

	const books = ref<Book[]>([]);

	onMounted(() => {
		$axios.get("/book/all").then((res) => {
			books.value = res.data;
		});
	});
</script>

<style scoped lang="scss"></style>
