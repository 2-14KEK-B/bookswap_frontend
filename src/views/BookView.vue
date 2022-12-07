<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<!-- :style="{ 'background-image': `url(${book?.picture})` }"
			style="height: 90vh; background-repeat: no-repeat; background-color: opacity: 0.1;" -->
		<q-card>
			<q-card-section class="text-center q-pb-none">
				<h4>{{ book?.title }}</h4>
				<h6>{{ book?.author }}</h6>
			</q-card-section>
			<q-card-section v-if="book?.category.length">
				<span>Categories:</span>
				<q-badge v-for="(category, index) in book?.category" :key="index" :label="category" class="q-mx-sm" />
			</q-card-section>
			<q-card-section>
				<div v-for="(value, key, index) in book" :key="index">
					<div
						v-if="
							!['_id', 'category', 'author', 'title', 'createdAt', 'updatedAt', 'uploader', 'picture', '__v'].includes(key)
						"
					>
						{{ key }} - {{ value }}
					</div>
					<div v-if="['createdAt', 'updatedAt'].includes(key)">
						{{ key }} - {{ new Date(value as string).toString().split(" GMT")[0] }}
					</div>
				</div>
			</q-card-section>
			<div style="max-height: 35vh; overflow: hidden">
				<q-img :src="book?.picture" style="max-widht: 100%; height: auto; opacity: 0.6"></q-img>
			</div>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRoute } from "vue-router";
	import { Book } from "@interfaces/book";

	const route = useRoute();
	const book = ref<Book>();

	onMounted(() => {
		book.value = route.meta as unknown as Book;
	});
</script>

<style scoped></style>
