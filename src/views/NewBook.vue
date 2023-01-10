<template>
	<div class="q-pa-lg">
		<q-form @submit.prevent="bookCreating" @reset="resetFields">
			<q-input
				v-model="input.author"
				label="Author"
				lazy-rules
				:rules="[(val) => (val && val.length > 0) || 'Please type something']"
			/>
			<q-input
				v-model="input.title"
				label="Title"
				lazy-rules
				:rules="[(val) => (val && val.length > 0) || 'Please type something']"
			/>
			<q-tabs v-model="tab">
				<q-tab name="link">Copy the link of the image</q-tab>
				<q-tab name="upload">Upload an image from your device</q-tab>
			</q-tabs>
			<q-tab-panels v-model="tab" class="no-padding">
				<q-tab-panel name="link" class="no-padding">
					<q-input v-model="input.picture" label="Picture" />
				</q-tab-panel>
				<q-tab-panel name="upload" class="no-padding">
					<q-uploader
						ref="uploaderRef"
						square
						hide-upload-btn
						max-file-size="10485760"
						label="Only image"
						class="full-width"
						accept="image/*"
						@failed="failed"
						@added="addFile"
					/>
				</q-tab-panel>
			</q-tab-panels>

			<q-input v-model="input.price" label="Price" type="number" />
			<q-toggle
				v-model="input.for_borrow"
				color="green"
				:label="input.for_borrow ? 'Upload for borrow' : 'Upload for lend'"
			/>
			<div>
				<q-btn label="Submit" type="submit" color="primary" />
				<q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
	import { QBtn, QForm, QInput, QUploader } from "quasar";
	import { useBookStore } from "@stores/book";
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import axios, { AxiosProgressEvent } from "axios";

	type newBorrow = { author: string; title: string; picture?: string; price?: number; for_borrow: boolean };

	const defaultValue: newBorrow = {
		author: "",
		title: "",
		picture: undefined,
		price: undefined,
		for_borrow: true,
	};
	const bookStore = useBookStore();
	const router = useRouter();

	const tab = ref<"link" | "upload">("upload");
	const uploaderRef = ref<QUploader>();
	const fileRef = ref<File>();
	const input = ref<newBorrow>(defaultValue);

	async function bookCreating() {
		if (uploaderRef.value && fileRef.value) {
			const url = await uploadImage();
			if (url) {
				uploaderRef.value?.updateFileStatus(fileRef.value as File, "uploaded", fileRef.value.size);

				await bookStore.createBook({ ...input.value, picture: url });
			}
		}
		await bookStore.createBook(input.value);
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
					uploaderRef.value?.updateFileStatus(
						fileRef.value as File,
						progressEvent.upload ? "uploading" : "uploaded",
						progressEvent.bytes,
					);
				},
			});
			return data.url;
		}
	}

	function failed(info: { files: readonly any[]; xhr: any }) {
		console.log(info);
	}

	function resetFields() {
		input.value = defaultValue;
	}
</script>

<style></style>
