<template>
	<q-page :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card
			v-if="userStore.loggedInUser"
			flat
			square
			class="full-width flex-center no-padding"
			style="height: calc(100vh - 50px)"
		>
			<q-card-section
				class="text-center q-pt-sm"
				:class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
				style="height: 180px"
			>
				<p class="text-h4">{{ $t("me.profile") }}</p>
				<ProfileAvatar :size="100" :src="userStore.loggedInUser?.picture" :alt="getDisplayName(userStore.loggedInUser)" />
			</q-card-section>
			<q-tabs v-model="userTab" no-caps :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
				<q-tab name="info" :label="$t('me.info')" />
				<q-tab
					name="rate"
					:label="$t(`me.rates`)"
					:disable="userRateStore.loggedInRates.from.length == 0 && userRateStore.loggedInRates.to.length == 0"
				/>
			</q-tabs>
			<q-tab-panels
				v-model="userTab"
				style="height: calc(100vh - 278px)"
				:class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'"
			>
				<q-tab-panel class="no-padding" name="info" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
					<q-card flat class="full-height" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<q-scroll-area style="height: calc(100vh - 278px)" class="q-pa-lg">
							<div class="column">
								<EditField
									:data="(userStore.loggedInUser.fullname as string)"
									field="fullname"
									:label="$t('user.fullname')"
									:modify-button-label="$t('button.edit')"
									can-modify
									@update="update"
								/>
								<EditField
									:data="(userStore.loggedInUser.username as string)"
									field="username"
									:label="$t('user.username')"
									:can-modify="false"
									:modify-button-label="$t('button.edit')"
									@update="update"
								/>
								<EditField
									:data="(userStore.loggedInUser.email as string)"
									field="email"
									:label="$t('user.email')"
									:can-modify="!!userStore.loggedInUser.email_is_verified"
									:modify-button-label="$t('button.edit')"
									@update="update"
								/>
								<div class="row justify-between items-center" style="min-width: 280px; height: 80px">
									<q-select
										v-model="modifiedLocale"
										class="col-8"
										:label="$t('user.locale')"
										:options="$i18n.availableLocales"
										:readonly="!modifyLocale"
									/>
									<span>
										<span v-if="!modifyLocale" class="col-auto flex-center">
											<q-btn class="small-button q-py-none" :label="$t('button.edit')" no-caps @click="modifyLocale = true" />
										</span>
										<span v-else class="col-auto">
											<span class="row" style="margin-bottom: 5px">
												<q-btn class="small-button q-py-none" :label="$t('button.send')" @click.prevent="updateLocale" />
											</span>
											<span class="row">
												<q-btn class="small-button q-py-none" :label="$t('button.reset')" @click="resetLocale" />
											</span>
										</span>
									</span>
								</div>
								<q-input v-model="registeredAt" :label="$t('user.registeredAt')" readonly />
								<div class="row q-pt-md flex items-center">
									<span class="col-4">{{ $t("user.password") }}:</span>
									<span class="col flex justify-center">
										<q-btn no-caps :label="$t('button.passwordReset')" />
									</span>
								</div>
								<div class="row q-pt-md flex items-center">
									<span class="col-4">{{ $t("me.uploadedBooks") }}:</span>
									<span class="col flex justify-center">
										<q-btn no-caps :label="$t('button.open')" :to="{ name: 'myBooks' }" />
									</span>
								</div>
								<div class="row q-pt-md flex items-center">
									<span class="col-4">{{ $t("me.swaps") }}:</span>
									<span class="col flex justify-center">
										<q-btn no-caps :label="$t('button.open')" :to="{ name: 'myBorrows' }" />
									</span>
								</div>
							</div>
						</q-scroll-area>
					</q-card>
				</q-tab-panel>
				<q-tab-panel class="no-padding" name="rate" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
					<q-tabs v-model="rateTab" no-caps align="justify" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<q-tab name="from" :label="$t('me.ratesFrom')" />
						<q-tab name="to" :label="$t('me.ratesAbout')" />
					</q-tabs>
					<q-tab-panels v-model="rateTab" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'">
						<q-tab-panel name="from">
							<q-card v-for="rate in userRateStore.loggedInRates.from" :key="rate._id" flat bordered class="q-ma-sm">
								<UserRateItem :user-rate="rate" from />
							</q-card>
						</q-tab-panel>
						<q-tab-panel name="to">
							<q-card v-for="rate in userRateStore.loggedInRates.to" :key="rate._id" flat bordered class="q-ma-sm">
								<UserRateItem :user-rate="rate" />
							</q-card>
						</q-tab-panel>
					</q-tab-panels>
				</q-tab-panel>
			</q-tab-panels>
		</q-card>
	</q-page>
	<UserRateModal
		v-if="appStore.editOrCreateUserRate && userRateStore.userRateToEdit"
		:user-rate="userRateStore.userRateToEdit"
		edit
	/>
	<EditBorrow v-if="appStore.editBorrow" :borrow="borrowToEdit" />
</template>

<script setup lang="ts">
	//TODO: saját borrow szerkesztése
	import { computed, onMounted, readonly, ref } from "vue";
	import { Notify } from "quasar";
	import socket from "@api/socket";
	import { useI18n } from "vue-i18n";
	import dayjs, { extend } from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat";
	import { useAppStore } from "@stores/app";
	import { useUserStore } from "@stores/user";
	import { useUserRateStore } from "@stores/userRate";
	import { getDisplayName } from "@utils/userHelper";
	import EditField from "@components/loggedIn/EditField.vue";
	import UserRateItem from "@components/userRate/UserRateItem.vue";
	import UserRateModal from "@components/userRate/UserRateModal.vue";
	import EditBorrow from "@components/borrow/EditBorrow.vue";
	import ProfileAvatar from "@components/ProfileAvatar.vue";
	import type { Borrow } from "@interfaces/borrow";
	import type { EditUser } from "@interfaces/user";

	extend(localizedFormat);

	const appStore = useAppStore();
	const userStore = useUserStore();
	const userRateStore = useUserRateStore();
	const { locale } = useI18n({ useScope: "global" });

	const userTab = ref("info");
	const rateTab = ref("to");
	const borrowToEdit = ref<Borrow>();

	const modifyLocale = ref(false);
	const defaultLocale = readonly(ref(userStore.loggedInUser?.locale));
	const modifiedLocale = ref();

	const registeredAt = computed(() =>
		dayjs(userStore.loggedInUser?.createdAt)
			.locale(locale.value as string)
			.format("LLLL"),
	);

	async function update(newData: string, field: keyof EditUser) {
		const data: EditUser = {};
		switch (field) {
			case "fullname":
				data.fullname = newData;
				break;
			case "username":
				data.username = newData;
				break;
			case "locale":
				data.locale = newData;
				break;
			case "picture":
				data.picture = newData;
				break;
			case "password":
				data.password = newData;
				break;
		}
		await userStore.editLoggedIn(data);
	}

	async function updateLocale() {
		if (modifiedLocale.value && modifiedLocale.value != defaultLocale.value) {
			await update(modifiedLocale.value, "locale");
		}
	}

	function resetLocale() {
		modifiedLocale.value = defaultLocale.value;
		modifyLocale.value = false;
	}

	socket.on("borrow-updated", async () => {
		Notify.create({
			message: "Borrows are changed",
			position: "bottom",
			multiLine: false,
			timeout: 10000,
			actions: [
				{
					label: "Reload data",
					handler: async () => {
						await userStore.getLoggedIn();
					},
				},
			],
		});
	});
	socket.on("user-rate-updated", async () => {
		Notify.create({
			message: "User rates are changed",
			position: "bottom",
			multiLine: false,
			timeout: 10000,
			actions: [
				{
					label: "Reload data",
					handler: async () => {
						await userStore.getLoggedIn();
					},
				},
			],
		});
	});

	onMounted(() => {
		modifiedLocale.value = userStore.loggedInUser?.locale;
	});
</script>

<style scoped>
	.modify-button {
		height: 30px;
		width: 150px;
	}
	.send-button {
		height: 30px;
		width: 80px;
	}
	.cancel-button {
		height: 30px;
		width: 80px;
	}
	.small-button {
		width: 100px;
	}
</style>
