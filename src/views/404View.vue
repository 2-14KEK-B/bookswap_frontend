<script setup lang="ts"></script>

<template>
	<div class="flex-center">
		<h1>404</h1>
	</div>
	<h4>
		{{$t('Page not found, go to')}}
		<RouterLink :to="{ name: 'home' }">{{$t('homepagere')}}</RouterLink>
	</h4>
</template>

<style scoped lang="scss"></style>
