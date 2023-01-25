<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'" style="height: calc(100vh - 50px)">
		<div class="row justify-around">
			<q-input
				v-model.trim="keyWord"
				outlined
				dense
				:placeholder="$t('book.searchBy')"
				:class="[$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-3', $q.screen.gt.xs ? 'col-10' : 'col-8']"
				@keydown.enter.prevent="getBooks"
			>
				<template #append>
					<q-icon v-if="keyWord === ''" :name="matSearch" />
					<q-icon v-else :name="matClear" class="cursor-pointer" @click="keyWord = ''" />
				</template>
			</q-input>
			<q-btn-dropdown
				:label="$q.screen.gt.sm ? 'filter' : ''"
				class="filter col-auto"
				content-class="q-pa-sm"
				:icon="matFilter"
				dropdown-icon="none"
			>
				<div class="q-my-sm">
					<span>{{ $t("book.genres.selected") }}:</span>
					<q-badge v-for="(category, i) in selectedGenres" :key="i" color="secondary" class="q-mx-sm" multi-line>
						{{ $t(`book.genres.${category}`) }}
					</q-badge>
				</div>
				<q-select
					v-model="selectedGenres"
					:label="$t('book.genres.genre')"
					:options="genres()"
					emit-value
					map-options
					multiple
					clearable
					@update:model-value="getBooks"
				/>
			</q-btn-dropdown>
		</div>
		<q-btn-group flat class="full-width flex justify-evenly q-my-md">
			<q-btn no-caps :label="$t('book.offers')" color="secondary" @click.prevent="selectBooks('borrow')" />
			<q-btn
				no-caps
				:label="$q.screen.width > 350 ? $t('book.uploadNew') : $t('book.upload')"
				:to="{ name: 'newBook' }"
				color="primary"
			/>
			<q-btn no-caps :label="$t('book.wishes')" color="secondary" @click.prevent="selectBooks('lend')" />
		</q-btn-group>
		<q-scroll-area style="height: calc(100vh - 185px)">
			<div class="row">
				<div class="col">
					<div class="row q-col-gutter-md">
						<div
							v-for="book in books"
							:key="book._id"
							class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
							:class="$q.platform.is.mobile ? 'col-xs-12' : ''"
							style="max-width: 100vw"
						>
							<q-card :class="$q.dark.isActive ? 'no-shadow' : ''" :bordered="$q.dark.isActive" :square="$q.dark.isActive">
								<q-img :src="book.picture" fit="contain" height="400px" />
								<q-card-section class="q-px-none q-py-sm" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
									<div class="row items-center no-wrap">
										<div class="col">
											<q-item class="column q-pa-none q-mx-xs">
												<q-item-section>
													<q-item-label lines="1">{{ $t("book.title") }}: {{ book.title }}</q-item-label>
													<q-item-label lines="1" caption>{{ $t("book.author") }}: {{ book.author }}</q-item-label>
												</q-item-section>
												<q-item-label>
													{{ $t("book.genres.genre") }}:
													<q-badge v-for="(category, i) in book.category" :key="i" class="q-mx-xs">
														{{ $t(`book.genres.${category}`) }}
													</q-badge>
												</q-item-label>
												<q-rating :model-value="getOverallRate(book.rates)" readonly />
											</q-item>
										</div>
										<div v-if="book.uploader != userStore.loggedInUser?._id" class="col-auto">
											<q-btn color="grey-7" round dense flat :icon="matMoreVert">
												<q-menu cover auto-close>
													<q-list>
														<q-item clickable>
															<q-item-section
																@click.prevent="router.push({ name: 'userProfile', params: { id: book.uploader as string } })"
															>
																{{ $t("book.uploader") }}
															</q-item-section>
														</q-item>
													</q-list>
												</q-menu>
											</q-btn>
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
									<q-btn
										v-if="
											userStore.loggedInUser &&
											book.uploader != userStore.loggedInUser._id &&
											!isBookAlreadyInLoggedInBorrows(book._id, (userStore.loggedInUser.borrows as Borrow[]))
										"
										flat
										no-caps
										:disable="!book.available"
										:label="selected == 'borrow' ? $t('book.borrowIt') : $t('book.lendIt')"
										padding="sm none"
										@click.prevent="router.push({ name: 'borrowBook', params: { id: book._id } })"
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
	import { onMounted, ref } from "vue";
	import { useRouter } from "vue-router";
	import { useUserStore } from "@stores/user";
	import { useBookStore } from "@stores/book";
	import { isBookAlreadyInLoggedInBorrows, getOverallRate, genres } from "@utils/bookHelper";
	import { matMoreVert, matSearch, matClear, matFilter } from "@quasar/extras/material-icons";
	import type { Book } from "@interfaces/book";
	import type { Borrow } from "@interfaces/borrow";
	import type { PaginateResult } from "@interfaces/paginate";

	const router = useRouter();
	const userStore = useUserStore();
	const bookStore = useBookStore();

	const books = ref<Book[]>();
	const keyWord = ref<string | null>(null);
	const selectedGenres = ref<string[] | null>(null);
	const selected = ref<"borrow" | "lend">("borrow");

	async function getBooks() {
		if (keyWord.value?.length == 0) keyWord.value = null;
		if (selectedGenres.value?.length == 0) selectedGenres.value = null;
		let data: PaginateResult<Book> | undefined = undefined;
		const genresQuery = selectedGenres.value?.join(",");

		if (keyWord.value != null) {
			if (selectedGenres.value != null) {
				data = await bookStore.getBooks(`${selected.value}?keyword=${keyWord.value.toString()}&genre=${genresQuery}`);
			} else {
				data = await bookStore.getBooks(`${selected.value}?keyword=${keyWord.value.toString()}`);
			}
		} else {
			if (selectedGenres.value) {
				data = await bookStore.getBooks(`${selected.value}?genre=${genresQuery}`);
			} else {
				data = await bookStore.getBooks(selected.value);
			}
		}
		books.value = data?.docs;
	}

	async function selectBooks(type: "borrow" | "lend") {
		selected.value = type;
		selectedGenres.value = [];
		keyWord.value = "";
		await getBooks();
	}

	onMounted(async () => {
		await getBooks();
	});
</script>

<style>
	button.filter i {
		display: none;
	}
</style>
