<template>
	<q-dialog v-model="appStore.editProfile">
		<q-card :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'" style="min-width: 350px" class="q-pa-md">
			<div class="q-mx-lg">
				<h4>{{ $t("me.edit") }}</h4>
			</div>
			<div class="q-pa-lg">
				<q-form @submit.prevent="editUser" @reset="reset">
					<q-input v-model="userData.username" :label="$t('user.username')" />
					<q-input v-model="userData.fullname" :label="$t('user.fullname')" />
					<q-input v-model="userData.picture" :label="$t('user.picture')" />
					<div class="q-my-lg">
						<q-btn :label="$t('button.send')" type="submit" color="primary" />
						<q-btn :label="$t('button.reset')" type="reset" color="primary" flat class="q-ml-sm" />
					</div>
				</q-form>
			</div>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref, readonly } from "vue";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import type { EditUser } from "@interfaces/user";

	const appStore = useAppStore();
	const userStore = useUserStore();

	const defaultData = readonly<Partial<EditUser>>({
		username: userStore.loggedInUser?.username,
		fullname: userStore.loggedInUser?.fullname,
		picture: userStore.loggedInUser?.picture,
	});
	const userData = ref<EditUser>({
		username: defaultData.username,
		fullname: defaultData.fullname,
		picture: defaultData.picture,
	});

	async function editUser() {
		let dataToSend: EditUser = {};
		if (userData.value.username != defaultData.username) {
			dataToSend.username = userData.value.username;
		}
		if (userData.value.fullname != defaultData.fullname) {
			dataToSend.fullname = userData.value.fullname;
		}
		if (userData.value.picture != defaultData.picture) {
			dataToSend.picture = userData.value.picture;
		}

		if (dataToSend.username || dataToSend.fullname || dataToSend.picture) {
			await userStore.editLoggedIn(dataToSend);
			appStore.editProfile = false;
		}
	}

	function reset() {
		Object.assign(userData.value, defaultData);
	}
</script>

<style scoped></style>
