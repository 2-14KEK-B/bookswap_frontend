<template>
	<q-card v-if="bookStore.openedBook" flat square class="col-12" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
		<q-img
			:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
			:src="bookStore.openedBook?.picture"
			style="max-widht: 100%; max-height: 400px"
			fit="contain"
		/>
		<q-card-section :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<div class="text-h5" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
				{{ $t("book.title") }}:
				{{ bookStore.openedBook?.title }}
			</div>
			<div class="text-h6" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
				{{ $t("book.author") }}:
				{{ bookStore.openedBook?.author }}
			</div>
		</q-card-section>
		<q-card-section v-if="bookStore.openedBook?.category.length">
			<span>{{ $t("book.category") }}:</span>
			<q-badge
				v-for="(category, index) in bookStore.openedBook?.category"
				:key="index"
				:label="category"
				class="q-mx-sm"
			/>
		</q-card-section>
		<q-card-section class="no-padding">
			<q-tabs v-model="tab" no-caps align="justify" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
				<q-tab name="info">{{ $t("book.info") }}:</q-tab>
				<q-tab name="rate">{{ $t("book.rates") }}:</q-tab>
			</q-tabs>
			<q-tab-panels v-model="tab" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
				<q-tab-panel name="info">
					<div class="text-h6">
						{{ $t("book.available") }}:
						<span>{{ bookStore.openedBook?.available ? $t("yes") : $t("no") }}</span>
					</div>
					<div class="text-h6">
						{{ $t("book.uploader") }}:
						<span class="q-mr-sm">{{ getDisplayName(bookStore.openedBook.uploader as User) }}</span>
						<ProfileAvatar
							:src="(bookStore.openedBook.uploader as User).picture"
							:alt="getDisplayName(bookStore.openedBook.uploader as User)"
						/>
					</div>
					<div class="text-h6">
						{{ $t("book.createdAt") }}:
						<span>
							{{ dayjs(bookStore.openedBook?.createdAt).locale($i18n.locale).format("LLLL") }}
						</span>
					</div>
					<div class="text-h6">
						{{ $t("book.forBorrow") }}:
						<span>{{ bookStore.openedBook?.for_borrow ? $t("yes") : $t("no") }}</span>
					</div>
					<div class="text-h6">
						{{ $t("book.price") }}:
						<span>{{ bookStore.openedBook?.price }}</span>
					</div>
					<div class="text-h6">
						<!-- :color="$q.dark.isActive ? 'yellow' : 'dark-yellow'" -->
						{{ $t("rate.overallRate") }}:
						<q-rating
							v-model="bookStore.openedBook.overallRate"
							readonly
							color="grey-10"
							:color-selected="$q.dark.isActive ? 'yellow' : 'yellow-8'"
						/>
					</div>
				</q-tab-panel>
				<q-tab-panel name="rate">
					<q-card
						v-if="!bookStore.openedBook.loggedInAlreadyRated"
						flat
						class="flex justify-center items-center q-py-lg"
						:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
					>
						<q-btn
							no-caps
							outline
							color="secondary"
							:label="$t('rate.create')"
							@click="appStore.editOrCreateBookRate = true"
						/>
					</q-card>
					<q-card v-for="rate in (bookStore.openedBook?.rates as BookRate[])" :key="rate._id" flat bordered class="q-mb-sm">
						<q-card-section>
							<div class="text-h6">
								{{ $t("rate.from", { user: getDisplayName(rate.from as User) }) }}
								<ProfileAvatar :src="(rate.from as User).picture" :alt="getDisplayName(rate.from as User)" />
								<span v-if="isRateFromLoggedIn(rate)" class="absolute-top-right">
									<q-icon dense :name="matEdit" class="q-pr-md" @click.prevent="openRateForEdit(rate)" />
									<q-icon dense :name="matDelete" class="q-pr-md" @click.prevent="deleteRate(rate._id)" />
								</span>
							</div>
							<p>
								{{ $t("rate.rate") }}:
								<q-rating
									v-model="rate.rate"
									readonly
									:color="$q.dark.isActive ? 'grey-6' : 'grey-10'"
									:color-selected="$q.dark.isActive ? 'yellow' : 'yellow-8'"
								/>
							</p>
							<p>{{ $t("rate.comment") }}: {{ rate.comment }}</p>
						</q-card-section>
					</q-card>
				</q-tab-panel>
			</q-tab-panels>
		</q-card-section>
	</q-card>
	<BookRateModal
		v-if="appStore.editOrCreateBookRate"
		:book="bookStore.openedBook"
		:book-rate="bookRateForEdit"
		:edit="bookRateForEdit != undefined"
	/>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import dayjs, { extend } from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useBookStore } from "@stores/book";
	import { useBookRateStore } from "@stores/bookRate";
	import { isRateFromLoggedIn } from "@utils/bookHelper";
	import { getDisplayName } from "@utils/userHelper";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import BookRateModal from "@components/bookRate/BookRateModal.vue";
	import { matEdit, matDelete } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { BookRate } from "@interfaces/bookRate";

	extend(localizedFormat);

	const appStore = useAppStore();
	const userStore = useUserStore();
	const bookStore = useBookStore();
	const bookRateStore = useBookRateStore();

	const bookRateForEdit = ref<BookRate>();
	const tab = ref<"info" | "rate">("info");

	function openRateForEdit(rate: BookRate) {
		if ((rate.from as User)._id == userStore.loggedInUser?._id) {
			bookRateForEdit.value = rate;
			appStore.editOrCreateBookRate = true;
		}
	}

	async function deleteRate(rateId: string) {
		await bookRateStore.deleteBookRate(bookStore.openedBook?._id as string, rateId);
	}
</script>

<style scoped></style>
