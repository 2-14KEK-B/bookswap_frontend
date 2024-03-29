<template>
	<q-dialog v-model="appStore.register">
		<q-card
			:class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'"
			style="min-width: 350px"
			data-cy="registerModal"
			class="q-pa-md"
		>
			<q-card-section class="row q-pt-none q-px-none">
				<div class="text-h4 q-pr-lg">{{ $t("auth.register") }}</div>
				<q-space />
				<q-btn v-close-popup :icon="matClose" flat round dense />
			</q-card-section>
			<q-separator class="q-mb-xs" />
			<q-form style="min-width: 300px" @submit.prevent="register">
				<q-input
					v-model="userCred.email"
					type="text"
					:label="$t('user.email') + ':'"
					lazy-rules
					reactive-rules
					data-cy="emailRegister"
					:rules="[(val) => isEmail.test(val) || $t('formValidation.required')]"
				/>
				<div class="row justify-between full-width" style="padding-bottom: 20px">
					<q-input v-model="name.firstName" :label="$t('user.firstName') + ':'" class="col" />
					<q-space class="col-1" />
					<q-input v-model="name.secondName" :label="$t('user.secondName') + ':'" class="col" />
				</div>
				<q-input
					v-model="userCred.username"
					type="text"
					:label="$t('user.username') + ':'"
					lazy-rules
					reactive-rules
					data-cy="usernameRegister"
					:rules="[(val) => !!val || $t('formValidation.required')]"
				/>
				<q-input
					v-model="userCred.password"
					type="password"
					:label="$t('user.password') + ':'"
					autocomplete="on"
					lazy-rules
					reactive-rules
					data-cy="passwordRegister"
					:rules="[(val) => !!val || $t('formValidation.required')]"
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
						:style="{ width: $q.screen.gt.xs ? 240 + 'px' : 140 + 'px' }"
						data-cy="registerButton"
						:label="$t('auth.register')"
					/>
					<q-btn
						:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
						:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
						no-caps
						:label="$t('auth.goToLogin')"
						:style="{ width: $q.screen.gt.xs ? 240 + 'px' : 140 + 'px' }"
						data-cy="openLoginButton"
						@click="toLogin"
					/>
				</div>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { computed, reactive } from "vue";
	import { useAppStore } from "@stores/app";
	import { useAuthStore } from "@stores/auth";
	import { isEmail } from "@utils/validationHelper";
	import { matClose } from "@quasar/extras/material-icons";
	import type { RegisterCred } from "@interfaces/auth";
	import type { User } from "@interfaces/user";
	// import axios, { AxiosProgressEvent } from "axios";

	const appStore = useAppStore();
	const authStore = useAuthStore();

	const name = reactive({ firstName: "", secondName: "" });
	const userCred = reactive<RegisterCred>({ email: "", username: "", password: "" });
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

	async function register() {
		const final: Partial<User> = { ...userCred };
		if (userCred.picture) {
			final.picture = userCred.picture;
		}
		if (name.firstName?.length > 0 && name.secondName?.length > 0) {
			final.fullname = `${name.firstName} ${name.secondName}`;
		}

		await authStore.register(final);
		appStore.register = false;
	}

	function toLogin() {
		appStore.register = false;
		appStore.login = true;
	}

	const isDisabled = computed(() => {
		if (userCred["password"].length < 4 || userCred["email"].length < 4) {
			return true;
		} else return false;
	});
</script>

<style scoped></style>
