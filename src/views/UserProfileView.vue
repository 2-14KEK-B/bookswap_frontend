<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card>
			<q-card-section class="text-center">
				<h3>{{ user?.email }}'s profile</h3>
				<q-img
					class="q-pa-lg"
					:src="user?.picture ? user.picture : 'https://pic.onlinewebfonts.com/svg/img_329115.png'"
					style="height: 150px; max-width: 150px"
				></q-img>
			</q-card-section>
			<q-card-section>
				<div v-for="(value, key, index) in user" :key="index">
					<span v-if="!['createdAt', 'updatedAt', 'books', 'borrows', 'rated_books'].includes(key)">
						{{ key }} - {{ value }}
					</span>
					<span v-if="['createdAt', 'updatedAt'].includes(key)">
						{{ key }} - {{ new Date(value as string).toString().split("GMT")[0] }}
					</span>
				</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useRoute } from "vue-router";
	import { User } from "@interfaces/user";

	const route = useRoute();
	const user = ref<User>();
	onMounted(() => {
		// console.log(route.meta);
		user.value = route.meta as unknown as User;
	});
</script>

<style scoped></style>
