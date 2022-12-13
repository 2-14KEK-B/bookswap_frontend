<template>
	<q-drawer v-model="openContacts" bordered side="left" :breakpoint="50" :width="drawerWidth">
		<q-toolbar class="bg-grey-8">
			<q-toolbar-title>Contacts</q-toolbar-title>
			<q-btn v-if="selectedUser" round flat icon="close" class="WAL__drawer-close" @click="openContacts = !openContacts" />
		</q-toolbar>
		<q-toolbar class="bg-grey-8">
			<q-input
				v-model="input"
				rounded
				outlined
				dense
				class="WAL__field full-width"
				placeholder="Search or start a new conversation"
			>
				<template #prepend>
					<q-icon name="search" />
				</template>
			</q-input>
		</q-toolbar>
		<q-scroll-area style="height: calc(100vh - 150px)">
			<q-item v-for="user in users" :key="user._id" clickable class="bg-grey-10" @click.prevent="selectUser(user)">
				<q-item-section avatar>
					<q-avatar color="primary" text-color="white"></q-avatar>
				</q-item-section>
				<q-item-section no-wrap>
					<q-item-label>{{ user.fullname }}</q-item-label>
					<q-item-label caption lines="1">{{}}</q-item-label>
				</q-item-section>
			</q-item>
		</q-scroll-area>
	</q-drawer>
	<q-page :class="$q.screen.lt.md && openContacts ? 'hidden' : ''">
		<div v-if="selectedUser">
			<div style="height: calc(100vh - 168px)">
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
								Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
							</div>
						</template>
					</q-infinite-scroll>
				</q-scroll-area>
				<div class="row justify-evenly q-mt-sm">
					<q-input v-model="input" class="col-9" type="text" placeholder="Start a new message" rounded outlined />
					<q-btn class="col" color="primary" label="Send" rounded />
				</div>
			</div>
		</div>
		<div v-else>Select a user</div>
	</q-page>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref } from "vue";
	import { useQuasar } from "quasar";
	import { mdiArrowRight, mdiArrowLeft } from "@quasar/extras/mdi-v7";
	import { useUserStore } from "@stores/user";
	import { User } from "@interfaces/user";

	const $q = useQuasar();
	const userStore = useUserStore();
	
	const users = ref<User[]>([]);
	const selectedUser = ref();
	const input = ref("");
	const openContacts = ref(true);

	const drawerWidth = computed(() => {
		if ($q.screen.lt.sm) {
			return $q.screen.width * 1;
		} else {
			return 350;
		}
	});

	const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

	function onLoad(_index: number, done: (stop?: boolean) => void) {
		setTimeout(() => {
			items.value.splice(0, 0, {}, {}, {}, {}, {}, {}, {});
			done();
		}, 2000);
	}

	function selectUser(user: User) {
		if ($q.screen.lt.sm) {
			openContacts.value = false;
		}
		selectedUser.value = user;
	}

	onMounted(() => {
		userStore.socket?.send("hy");
	});
</script>

<style scoped></style>
