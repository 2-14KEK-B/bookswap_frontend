<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card class="flex-center">
			<q-card-section class="text-center q-pt-sm">
				<h3>My account</h3>
				<q-img
					class="q-pa-lg"
					:src="
						userStore.getLoggedUser?.picture
							? userStore.getLoggedUser.picture
							: 'https://pic.onlinewebfonts.com/svg/img_329115.png'
					"
					style="height: 150px; max-width: 150px"
				/>
			</q-card-section>
			<q-card-section class="flex column content-left" style="width: 100%">
				<div v-for="(value, key, index) in me" :key="index" style="max-width: 40vw">
					<span
						v-if="
							!['_id', 'borrows', 'messages', 'books', 'rated_books', 'user_ratings', 'createdAt', 'updatedAt'].includes(key)
						"
					>
						{{ key }} - {{ value }}
					</span>
					<span v-if="['createdAt', 'updatedAt'].includes(key)">
						{{ key }} - {{ new Date(value as string).toString().split(" GMT")[0] }}
					</span>
				</div>
				<q-btn label="Edit" :to="{ name: 'editProfile' }" />
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { User } from "@interfaces/user";
	import { useUserStore } from "@stores/user";
	import { onMounted, ref } from "vue";
	import { useRoute } from "vue-router";

	const userStore = useUserStore();
	const route = useRoute();
	const me = ref(userStore.getLoggedUser);

	onMounted(() => {
		me.value = route.meta as unknown as User;
	});
</script>

<style scoped></style>
