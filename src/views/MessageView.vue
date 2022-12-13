<template>
	<q-page class="row bg-grey-9">
		<div v-if="openContacts" :class="openContacts ? 'col' : ''" style="height: calc(100vh - 100px)">
			<q-list style="height: 100%">
				<q-toolbar class="bg-secondary text-white shadow-2">
					<q-toolbar-title>Contacts</q-toolbar-title>
				</q-toolbar>
				<q-scroll-area class="fit">
					<q-item v-for="user in users" :key="user._id" clickable class="bg-grey-10">
						<q-item-section avatar>
							<q-avatar color="primary" text-color="white"></q-avatar>
						</q-item-section>
						<q-item-section no-wrap>
							<q-item-label>{{ user.name }}</q-item-label>
							<q-item-label caption lines="1">{{}}</q-item-label>
						</q-item-section>
					</q-item>
				</q-scroll-area>
			</q-list>
		</div>
		<div class="col" :class="openContacts ? 'col-sm-8' : ''" style="height: calc(100vh - 168px)">
			<q-toolbar class="bg-primary text-white shadow-2">
				<q-btn
					flat
					dense
					:icon="openContacts ? mdiArrowLeft : mdiArrowRight"
					@click.prevent="openContacts = !openContacts"
				/>
				<q-toolbar-title>Messages</q-toolbar-title>
			</q-toolbar>
			<q-scroll-area class="fit">
				<q-infinite-scroll reverse class="bg-grey-10 q-px-sm" @load="onLoad">
					<template #loading>
						<div class="row justify-center q-my-md">
							<q-spinner color="primary" name="dots" size="40px" />
						</div>
					</template>
					<template #default>
						<div v-for="(_, index) in items" :key="index" class="caption q-py-sm">
							<q-badge class="shadow-1">
								{{ items.length - index }}
							</q-badge>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate
							voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam
							exercitationem aut, natus minima, porro labore.
						</div>
					</template>
				</q-infinite-scroll>
			</q-scroll-area>
			<div class="row justify-evenly q-mt-sm">
				<q-input
					v-model="input"
					class="col-9"
					type="text"
					placeholder="Start a new message"
					rounded
					outlined
				/>
				<q-btn class="col" color="primary" label="Send" rounded />
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { mdiArrowRight, mdiArrowLeft } from "@quasar/extras/mdi-v7";

	const users = [{ _id: "0", name: "Test" }];
	const input = ref("");
	const openContacts = ref(true);
	// const openUsers = ref(true);

	const items = ref([
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
	]);

	function onLoad(_index: number, done: (stop?: boolean) => void) {
		setTimeout(() => {
			items.value.splice(0, 0, {}, {}, {}, {}, {}, {}, {});
			done();
		}, 2000);
	}

	for (let i = 1; i < 40; i++) {
		users.push({ _id: `${i}`, name: `Test${i}` });
	}
</script>

<style scoped></style>
