<template>
	<q-card
		flat
		square
		class="q-pa-lg row"
		:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
		style="height: calc(100vh - 50px)"
	>
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
			<q-tabs v-model="tab" align="justify" no-caps>
				<q-tab name="link" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'" :label="$t('upload.link')" />
				<q-tab name="upload" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'" :label="$t('upload.image')" />
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
			<q-input v-model="input.price" :label="$t('book.price')" type="number" suffix="Ft" />
			<q-toggle v-model="input.for_borrow" color="green" :label="$t('book.forBorrow')" />
			<q-card-actions>
				<q-btn :label="$t('button.submit')" type="submit" color="primary" />
				<q-btn :label="$t('button.reset')" type="reset" color="primary" flat class="q-ml-sm" />
			</q-card-actions>
		</q-form>
	</q-card>
</template>

<script setup lang="ts">
	import { QBtn, QForm, QInput, QUploader } from "quasar";
	import { useBookStore } from "@stores/book";
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import axios, { AxiosProgressEvent } from "axios";
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
		picture: "",
		price: 0,
		for_borrow: true,
	});

	async function bookCreating() {
		const newData: Partial<CreateBook> = {
			author: input.value.author,
			title: input.value.title,
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

<style></style>