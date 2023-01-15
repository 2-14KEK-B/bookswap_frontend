<template>
	<q-card v-if="bookStore.openedBook" flat square class="col-12" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
		<q-img
			:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
			:src="bookStore.openedBook?.picture"
			style="max-widht: 100%; max-height: 300px"
		/>
		<q-card-section :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
			<div class="text-h5" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
				{{ $t("title") }}:
				{{ bookStore.openedBook?.title }}
			</div>
			<div class="text-h6" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
				{{ $t("author") }}:
				{{ bookStore.openedBook?.author }}
			</div>
		</q-card-section>
		<q-card-section v-if="bookStore.openedBook?.category.length">
			<span>{{ $t("category") }}:</span>
			<q-badge
				v-for="(category, index) in bookStore.openedBook?.category"
				:key="index"
				:label="category"
				class="q-mx-sm"
			/>
		</q-card-section>
		<q-card-section class="no-padding">
			<q-tabs v-model="tab" no-caps align="justify" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
				<q-tab name="info">{{ $t("info") }}:</q-tab>
				<q-tab name="rate">{{ $t("rate") }}:</q-tab>
			</q-tabs>
			<q-tab-panels v-model="tab" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
				<q-tab-panel name="info">
					<div class="text-h6">
						{{ $t("available") }}:
						<span>{{ bookStore.openedBook?.available }}</span>
					</div>
					<div class="text-h6">
						{{ $t("uploadedAt") }}:
						<span>{{ new Date(bookStore.openedBook?.createdAt as string).toLocaleString() }}</span>
					</div>
					<div class="text-h6">
						{{$t('Uploaded for borrow:')}}
						<span>{{ bookStore.openedBook?.for_borrow }}</span>
					</div>
					<div class="text-h6">
						{{ $t("price") }}:
						<span>{{ bookStore.openedBook?.price }}</span>
					</div>
					<div class="text-h6">
						{{ $t("overallRate") }}:
						<q-rating v-model="bookStore.openedBook.overallRate" readonly />
					</div>
				</q-tab-panel>
				<q-tab-panel name="rate">
					<q-card
						v-if="!bookStore.openedBook.loggedInAlreadyRated"
						flat
						class="flex justify-center items-center q-py-lg"
						:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
					>
						<q-btn no-caps outline color="secondary" :label="$t('Create a new rate')" @click="appStore.createBookRate = true" />
					</q-card>
					<q-card v-for="rate in (bookStore.openedBook?.rates as BookRate[])" :key="rate._id" flat bordered class="q-mb-sm">
						<q-card-section>
							<div class="text-h6">
								{{$t('from')}}: {{ getDisplayName(rate.from as User) }}
								<q-avatar v-if="(rate.from as User).picture">
									<q-img :src="(rate.from as User).picture" />
								</q-avatar>
								<span v-if="isRateFromLoggedIn(rate)" class="absolute-top-right">
									<q-icon dense :name="matEdit" class="q-pr-md" @click.prevent="openRateForEdit(rate)" />
									<q-icon dense :name="matDelete" class="q-pr-md" @click.prevent="deleteRate(rate._id)" />
								</span>
							</div>
							<p>
								{{$t('rate')}}:
								<q-rating v-model="rate.rate" readonly />
							</p>
							<p>{{$t('comment')}}: {{ rate.comment }}</p>
						</q-card-section>
					</q-card>
				</q-tab-panel>
			</q-tab-panels>
		</q-card-section>
	</q-card>
	<NewBookRate v-if="appStore.createBookRate" :book="bookStore.openedBook" />
	<EditBookRate v-if="appStore.editBookRate" :book="bookStore.openedBook" :book-rate="bookRateForEdit" />
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useBookStore } from "@stores/book";
	import { useBookRateStore } from "@stores/bookRate";
	import { isRateFromLoggedIn } from "@utils/bookHelper";
	import { getDisplayName } from "@utils/userHelper";
	import NewBookRate from "@components/bookRate/NewBookRate.vue";
	import EditBookRate from "@components/bookRate/EditBookRate.vue";
	import { matEdit, matDelete } from "@quasar/extras/material-icons";
	import type { User } from "@interfaces/user";
	import type { BookRate } from "@interfaces/bookRate";

	const appStore = useAppStore();
	const userStore = useUserStore();
	const bookStore = useBookStore();
	const bookRateStore = useBookRateStore();

	const bookRateForEdit = ref<BookRate>();
	const tab = ref<"info" | "rate">("info");

	function openRateForEdit(rate: BookRate) {
		if ((rate.from as User)._id == userStore.loggedInUser?._id) {
			bookRateForEdit.value = rate;
			appStore.editBookRate = true;
		}
	}

	async function deleteRate(rateId: string) {
		await bookRateStore.deleteBookRate(bookStore.openedBook?._id as string, rateId);
	}
</script>

<style scoped></style>
