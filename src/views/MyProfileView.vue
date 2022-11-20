<template>
	<q-page padding :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
		<q-card>
			<q-card-section class="text-center">
				<h3>My account</h3>
			</q-card-section>
			<q-card-section>
				<q-img :src="
			userStore.getLoggedUser?.picture
				? userStore.getLoggedUser.picture
				: 'https://pic.onlinewebfonts.com/svg/img_329115.png'" style="height: 140px; max-width: 150px" ></q-img>
				<div v-for="(value, key, index) in me" :key="index">
					<span>{{ key }} - {{ value }}</span>
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

<style scoped>

</style>
