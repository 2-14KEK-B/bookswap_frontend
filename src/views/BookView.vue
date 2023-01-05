<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<!-- :style="{ 'background-image': `url(${book?.picture})` }"
			style="height: 90vh; background-repeat: no-repeat; background-color: opacity: 0.1;" -->
		<q-card flat square style="min-height: calc(100vh - 50px)">
			<q-img class="pic" :src="book?.picture" style="max-widht: 100%; max-height: 300px"></q-img>
			<q-card-section class="text-center">
				<div class="text-h4">{{ book?.title }}</div>
				<div class="text-h6">{{ book?.author }}</div>
			</q-card-section>
			<q-card-section v-if="book?.category.length">
				<span>Categories:</span>
				<q-badge v-for="(category, index) in book?.category" :key="index" :label="category" class="q-mx-sm" />
			</q-card-section>
			<q-card-section class="no-padding">
				<q-tabs v-model="tab" no-caps align="justify" class="bg-grey-10">
					<q-tab name="info">Info</q-tab>
					<q-tab name="rate">Rate</q-tab>
				</q-tabs>
				<q-tab-panels v-model="tab">
					<q-tab-panel name="info">
						<div class="text-h6">
							Available:
							<span>{{ book?.available }}</span>
						</div>
						<div class="text-h6">
							Uploaded at:
							<span>{{ book?.createdAt }}</span>
						</div>
						<div class="text-h6">
							Uploaded for borrow:
							<span>{{ book?.for_borrow }}</span>
						</div>
						<div class="text-h6">
							Price:
							<span>{{ book?.price }}</span>
						</div>
						<div class="text-h6">
							Overall rate:
							<q-rating v-model="overAllRate" readonly />
						</div>
					</q-tab-panel>
					<q-tab-panel name="rate">
						<q-card v-for="rate in (book?.rates as BookRate[])" :key="rate._id">
							<q-card-section>
								<h6>
									From: {{ getDisplayName(rate.from as User) }}
									<q-avatar v-if="(rate.from as User).picture">
										<q-img :src="(rate.from as User).picture" />
									</q-avatar>
								</h6>
								<p>
									Rate:
									<q-rating v-model="rate.rate" readonly />
								</p>
								<p>Comment: {{ rate.comment }}</p>
							</q-card-section>
						</q-card>
					</q-tab-panel>
				</q-tab-panels>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRoute } from "vue-router";
	import { getDisplayName } from "@utils/userHelper";
	import type { Book } from "@interfaces/book";
	import type { BookRate } from "@interfaces/bookRate";
	import type { User } from "@interfaces/user";

	const route = useRoute();

	const book = ref<Book>();
	const overAllRate = ref(0);
	const tab = ref<"info" | "rate">("info");

	function getOverallRate(rates?: BookRate[]) {
		if (rates) {
			let all = 0;
			let count = 0;
			rates.forEach((rate) => {
				all += rate.rate;
				count++;
			});
			return all / count;
		}
		return 0;
	}

	onMounted(() => {
		book.value = route.meta.book;
		overAllRate.value = getOverallRate(book.value?.rates as BookRate[]);
	});
</script>

<style scoped></style>
