<template>
	<q-card :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'" style="min-width: 350px; width: calc(100vw - 10%)">
		<p class="text-h4">Register</p>
		<q-form style="min-width: 300px" @submit.prevent="emits('register', userCred)">
			<q-input
				v-model="userCred.username"
				type="text"
				label="Username:"
				:rules="[(val) => !!val || 'Field is required']"
			/>
			<q-input v-model="userCred.email" type="text" label="Email:" :rules="[(val) => !!val || 'Field is required']" />
			<q-input
				v-model="userCred.password"
				type="password"
				label="Password:"
				autocomplete="on"
				:rules="[(val) => !!val || 'Field is required']"
			/>
			<!-- <div>
				<span class="text-subtitle1">Picture:</span>
				<q-tabs v-model="tab" align="justify" no-caps>
					<q-tab name="link" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'" label="Copy the link of the image" />
					<q-tab
						name="upload"
						:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-5'"
						label="Upload an image from your device"
					/>
				</q-tabs>
				<q-tab-panels v-model="tab" class="no-padding" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
					<q-tab-panel name="link" class="no-padding">
						<q-input v-model="userCred.picture" label="Picture" />
					</q-tab-panel>
					<q-tab-panel name="upload" class="no-padding">
						<q-uploader
							ref="uploaderRef"
							square
							hide-upload-btn
							max-file-size="10485760"
							label="Only image"
							class="full-width"
							:class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-5'"
							accept="image/*"
							@failed="failed"
							@added="addFile"
						/>
					</q-tab-panel>
				</q-tab-panels>
			</div> -->
			<div class="q-gutter-md q-py-sm flex justify-evenly">
				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					:disabled="isDisabled"
					no-caps
					type="submit"
					label="Register"
				/>
				<q-btn
					:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
					:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
					no-caps
					label="Go to Login"
					@click="emits('to-login')"
				/>
			</div>
		</q-form>
		<!-- <p class="text-caption">Field marked with * is required</p> -->
	</q-card>
</template>

<script setup lang="ts">
	import {
		computed,
		reactive,
		// ref
	} from "vue";
	import type { RegisterCred } from "@interfaces/auth";
	// import axios, { AxiosProgressEvent } from "axios";

	const emits = defineEmits<{ (e: "register", userCred: RegisterCred): void; (e: "to-login"): void }>();
	const userCred = reactive<RegisterCred>({ email: "", username: "", password: "", picture: "" });
	// const tab = ref();
	// const uploaderRef = ref();
	// const fileRef = ref();

	// function addFile(files: readonly any[]) {
	// 	fileRef.value = files[0];
	// }

	// async function uploadImage(): Promise<string | undefined> {
	// 	if (uploaderRef.value && fileRef.value) {
	// 		let formData = new FormData();
	// 		formData.append("file", fileRef.value);
	// 		formData.append("upload_preset", "bookswap");
	// 		formData.append("tags", "browser-upload");
	// 		const { data } = await axios.post<{ url: string }>(import.meta.env.VITE_IMAGE_CLOUD, formData, {
	// 			headers: { "Content-Type": "multipart/form-data" },
	// 			onUploadProgress: (progressEvent: AxiosProgressEvent) => {
	// 				uploaderRef.value?.updateFileStatus(fileRef.value as File, "uploading", progressEvent.loaded);
	// 			},
	// 		});
	// 		return data.url;
	// 	}
	// }

	// function failed(info: { files: readonly any[]; xhr: any }) {
	// 	console.log(info);
	// }

	const isDisabled = computed(() => {
		if (userCred["password"].length < 4 || userCred["email"].length < 4) {
			return true;
		} else return false;
	});
</script>

<style scoped></style>
