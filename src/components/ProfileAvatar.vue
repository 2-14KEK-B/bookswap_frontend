<template>
	<q-avatar v-if="src">
		<q-img
			:src="src"
			referrerpolicy="no-referrer"
			loading="eager"
			:alt="alt"
			fetchpriority="high"
			:placeholder-src="'https://pic.onlinewebfonts.com/svg/img_329115.png'"
		/>
	</q-avatar>
	<q-avatar v-else color="secondary" text-color="white">
		{{ alt?.charAt(0).toUpperCase() }}
	</q-avatar>
</template>

<script setup lang="ts">
	import { onMounted } from "vue";

	const props = defineProps<{ src?: string; alt?: string }>();

	onMounted(() => {
		console.log(props);
	});
</script>

<style scoped></style>
