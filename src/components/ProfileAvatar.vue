<template>
	<q-avatar
		v-if="src"
		:size="size"
		:style="{
			border: title ? '2px solid white' : $q.dark.isActive ? '2px solid white' : '2px solid DarkSlateGrey',
			margin: title ? '' : '1px',
		}"
	>
		<q-img
			:src="src"
			referrerpolicy="no-referrer"
			:img-style="{ borderRadius: '50%', backgroundColor: $q.dark.isActive ? 'white' : 'black' }"
			loading="eager"
			:alt="alt"
			fetchpriority="high"
			:placeholder-src="'https://pic.onlinewebfonts.com/svg/img_329115.png'"
		/>
	</q-avatar>
	<q-avatar
		v-else
		:color="$q.dark.isActive ? 'cyan-10' : 'cyan'"
		text-color="white"
		:size="size"
		:style="{
			border: title ? '2px solid white' : $q.dark.isActive ? '2px solid white' : '2px solid DarkSlateGrey',
			margin: title ? '' : '1px',
		}"
	>
		{{ alt?.charAt(0).toUpperCase() }}
	</q-avatar>
</template>

<script setup lang="ts">
	interface Props {
		size?: string;
		title?: boolean;
		src?: string;
		alt?: string;
	}
	withDefaults(defineProps<Props>(), {
		size: "30px",
		title: false,
		src: "",
		alt: "",
	});
</script>

<style scoped>
	.q-avatar {
		box-sizing: content-box;
	}
</style>
