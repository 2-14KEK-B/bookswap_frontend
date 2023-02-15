<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-tabs v-model="tab" no-caps>
			<q-tab name="borrow" :label="$t('book.forBorrow')" />
			<q-tab name="lend" :label="$t('book.forLend')" />
			<q-tab name="not_available" :label="$t('book.notAvailable')" />
		</q-tabs>
		<q-scroll-area style="height: calc(100vh - 98px)" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
			<div class="row q-pa-sm">
				<div class="col">
					<div class="row q-col-gutter-md">
						<div v-for="book in selectedBooks" :key="book._id" class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
							<q-card :class="$q.dark.isActive ? 'no-shadow' : ''" :bordered="$q.dark.isActive" :square="$q.dark.isActive">
								<q-img :src="book.picture" fit="cover" height="250px" />
								<q-card-section class="q-px-none" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
									<div class="row items-center no-wrap">
										<div class="col">
											<q-item>
												<q-item-section>
													<q-item-label lines="1">{{ $t("book.title") }}: {{ book.title }}</q-item-label>
													<q-item-label lines="1" caption>{{ $t("book.author") }}: {{ book.author }}</q-item-label>
												</q-item-section>
											</q-item>
										</div>
									</div>
								</q-card-section>
								<q-separator />
								<q-btn-group spread :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
									<q-btn
										flat
										no-caps
										:label="$t('button.open')"
										padding="sm none"
										@click.prevent="router.push({ name: 'book', params: { id: book._id } })"
									/>
								</q-btn-group>
							</q-card>
						</div>
					</div>
				</div>
			</div>
		</q-scroll-area>
	</q-page>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useBookStore } from "@stores/book";

	const router = useRouter();
	const bookStore = useBookStore();

	const tab = ref<"borrow" | "lend" | "not_available">("borrow");
	const selectedBooks = computed(() => {
		const books = bookStore.loggedInBooks;
		switch (tab.value) {
			case "borrow":
				return books.filter((b) => b.for_borrow && b.available);
			case "lend":
				return books.filter((b) => !b.for_borrow);
			case "not_available":
				return books.filter((b) => !b.available);
			default:
				return books.filter((b) => b.for_borrow && b.available);
		}
	});
</script>

<style scoped></style>
