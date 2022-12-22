<template>
	<q-avatar>
		<q-img
			:src="src || 'https://pic.onlinewebfonts.com/svg/img_329115.png'"
			referrerpolicy="no-referrer"
			:alt="alt || 'profile'"
		/>
	</q-avatar>
</template>

<script setup lang="ts">
	defineProps<{ src?: string; alt?: string }>();
</script>

<style scoped></style>
