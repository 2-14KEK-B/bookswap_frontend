<template>
	<div class="flex-center column bg-grey-8" style="height: 100vh; width: 100vw">
		<div class="col-2 text-h1">404</div>
		<div class="col-1 text-h4">{{ $t("404") }}</div>
		<p class="col-1 text-h6">{{ $t("404message") }}</p>
		<div class="col-auto row q-gutter-xl items-center">
			<q-btn color="black" class="text-h6" :to="{ name: 'home' }">
				{{ $t("homePage") }}
			</q-btn>
			<div class="text-h6 text-center">{{ $t("or") }}</div>
			<q-btn color="black" class="text-h6" @click="$router.back">
				{{ $t("back") }}
			</q-btn>
		</div>
	</div>
</template>
