<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card>
			<q-card-section class="text-center">
                <h3>{{ user?.email }}'s profile</h3>
            </q-card-section>
			<q-card-section>
                <div v-for="(value, key, index) in user" :key="index">
                    <div v-if="key != 'email'">{{ key }} - {{ value }}</div>
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
