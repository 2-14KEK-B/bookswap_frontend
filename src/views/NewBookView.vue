<template>
	<q-page
		flat
		square
		class="q-pa-lg"
		:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
		style="height: calc(100vh - 98px); margin-bottom: -50px"
	>
		<q-scroll-area style="height: calc(100vh - 50px); margin: -24px" class="q-pa-md">
			<q-form class="col-12" @submit.prevent="bookCreating" @reset="resetFields">
				<q-input
					v-model="input.author"
					:label="$t('book.author')"
					lazy-rules
					:rules="[(val) => (val && val.length > 0) || 'Please type something']"
				/>
				<q-input
					v-model="input.title"
					:label="$t('book.title')"
					lazy-rules
					:rules="[(val) => (val && val.length > 0) || 'Please type something']"
				/>
				<q-input v-model="input.isbn" :label="$t('book.isbn')" />
				<!-- <div class="q-my-sm">
						<span>{{ $t("book.genres.selected") }}:</span>
						<q-badge v-for="(category, i) in input.category" :key="i" color="secondary" class="q-mx-sm" multi-line>
							{{ $t(`book.genres.${category}`) }}
						</q-badge>
					</div> -->
				<q-select v-model="input.category" :options="genres()" label-slot emit-value map-options multiple clearable>
					<template #label>
						<span>
							{{ $t("book.genres.genre") }}
						</span>
					</template>
					<template #selected>
						<q-badge v-for="(category, i) in input.category" :key="i" color="secondary" class="q-ma-xs" multi-line>
							{{ $t(`book.genres.${category}`) }}
						</q-badge>
					</template>
				</q-select>
				<q-tabs v-model="tab" align="justify" no-caps :active-color="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'">
					<q-tab name="link" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'" :label="$t('upload.link')" />
					<q-tab name="upload" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'" :label="$t('upload.image')" />
				</q-tabs>
				<q-tab-panels v-model="tab" class="no-padding" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
					<q-tab-panel name="link" class="no-padding">
						<q-input v-model="input.picture" :label="$t('book.picture')" />
					</q-tab-panel>
					<q-tab-panel name="upload" class="no-padding">
						<q-uploader
							ref="uploaderRef"
							square
							hide-upload-btn
							max-file-size="10485760"
							:label="$t('upload.onlyImg')"
							class="full-width"
							:class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-5'"
							accept="image/*"
							@failed="failed"
							@added="addFile"
						/>
					</q-tab-panel>
				</q-tab-panels>
				<q-input
					v-model="input.price"
					:label="$t('book.price')"
					mask="#####"
					step="100"
					placeholder="Maximum 99999"
					max="100000"
					class="price"
					suffix="Ft"
				/>
				<q-toggle v-model="input.for_borrow" color="green" :label="$t('book.forBorrow')" />
				<q-card-actions>
					<q-btn :label="$t('button.send')" type="submit" color="primary" />
					<q-btn :label="$t('button.reset')" type="reset" color="primary" flat class="q-ml-sm" />
				</q-card-actions>
			</q-form>
		</q-scroll-area>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import axios, { type AxiosProgressEvent } from "axios";
	import { genres } from "@utils/bookHelper";
	import { useBookStore } from "@stores/book";
	import { QUploader } from "quasar";
	import type { CreateBook } from "@interfaces/book";

	const bookStore = useBookStore();
	const router = useRouter();

	const tab = ref<"link" | "upload">("link");
	const uploaderRef = ref<QUploader>();
	const fileRef = ref<File>();
	const input = ref<CreateBook>({
		author: "",
		title: "",
		isbn: "",
		category: [],
		picture: "",
		price: undefined,
		for_borrow: true,
	});

	async function bookCreating() {
		const newData: Partial<CreateBook> = {
			author: input.value.author,
			title: input.value.title,
			isbn: input.value.isbn,
			category: input.value.category,
			price: input.value.price?.toString(),
			for_borrow: input.value.for_borrow,
		};
		if (uploaderRef.value && fileRef.value) {
			const url = await uploadImage();
			if (url) {
				uploaderRef.value.updateFileStatus(fileRef.value as File, "uploaded", fileRef.value.size);

				await bookStore.createBook({ ...newData, picture: url });
			}
		} else {
			if (input.value.picture && input.value.picture.length > 0) {
				newData.picture = input.value.picture;
			}
			await bookStore.createBook(newData);
		}

		await router.push("/");
	}

	function addFile(files: readonly any[]) {
		fileRef.value = files[0];
	}

	async function uploadImage(): Promise<string | undefined> {
		if (uploaderRef.value && fileRef.value) {
			let formData = new FormData();
			formData.append("file", fileRef.value);
			formData.append("upload_preset", "bookswap");
			formData.append("tags", "browser-upload");
			const { data } = await axios.post<{ url: string }>(import.meta.env.VITE_IMAGE_CLOUD, formData, {
				headers: { "Content-Type": "multipart/form-data" },
				onUploadProgress: (progressEvent: AxiosProgressEvent) => {
					uploaderRef.value?.updateFileStatus(fileRef.value as File, "uploading", progressEvent.loaded);
				},
			});
			return data.url;
		}
	}

	function failed(info: { files: readonly any[]; xhr: any }) {
		console.log(info);
	}

	function resetFields() {
		input.value = {
			author: "",
			title: "",
			isbn: "",
			picture: "",
			price: 0,
			for_borrow: true,
		};
	}
</script>

<style scoped></style>
